importScripts("./localforage.min.js");

;(async function(self) {
    const x = localforage.createInstance({
        description: "Config Storage",
        driver: localforage.INDEXEDDB,
        name: `internal-config`,
        storeName: "config",
        version: 1
    });

    class BDomainList {
        #domains = [];
        constructor() {
            this.#init();
        }

        async #init() {
            const blockedDomainsResult = (await x.getItem("bDomains"));
            if (!(blockedDomainsResult instanceof Array)) {
                x.setItem("bDomains", []);
            } else {
                this.#domains = blockedDomainsResult;
            }
        }

        async addDomain(...domains) {
            this.#domains.push(...domains);
            const bDomains = (await x.getItem("bDomains"));
            return x.setItem("bDomains", [...Array.from(bDomains), ...domains])
        }

        async removeDomain(...domains) {
            this.#domains = this.#domains.filter(e => (![...domains].includes(e)));
            const bDomains = (await x.getItem("bDomains"));
            return x.setItem("bDomains", Array.from(bDomains).filter(e => (![...domains].includes(e))))
        }

        async hasDomain(domain) {
            return this.#domains.find(e => (e === domain));
        }

        async clearDomains() {
            this.#domains = [];
            return x.setItem("bDomains", []);
        }

        async listDomains(update = false) {
            if (update === true) {
                const domains =  Array.from(await x.getItem("bDomains"));
                this.#domains = domains;
                return domains;
            }
            return this.#domains;
        }
    }

    class AdBlockToggle {
        #state = false;
        constructor() {
            this.#init();
        }

        async #init() {
            const adBlockState = (await x.getItem("adBlockState"));
            if (typeof adBlockState === "boolean") {
                this.#state = adBlockState;
            } else {
                x.setItem("adBlockState", false);
            }
        }

        async getState(update = false) {
            if (update === true) {
                const adBlockState = (await x.getItem("adBlockState"));
                this.#state = adBlockState;
            }
            return this.#state;
        }

        async enableBlocking() {
            this.#state = true;
            return x.setItem("adBlockState", true);
        }

        async disableBlocking() {
            this.#state = false;
            return x.setItem("adBlockState", false);
        }

        async getAdDomains(checkIDB = false) {
            const result = (checkIDB? (await x.getItem("adBlockState")) : this.#state);
            if (result === false) {
                return [];
            } else {
                const req = await fetch(`https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt`);
                const resp = await req.text();
                return resp.split("\n").filter(e => (!e.startsWith("#"))).map(e => e.split(" ")[1]);
            }
        }
    }

    class BareConfigurator {
        #servers = [];
        constructor() {
            this.#init();
        }

        async #init() {
            const bareServers = (await x.getItem("bareServers"));
            if (!(bareServers instanceof Array)) {
                x.setItem("bareServers", []);
            } else {
                this.#servers = (bareServers.length > 0)? bareServers : [];
            }
        }

        async addServer(...servers) {
            this.#servers.push(...servers);
            const bServers = (await x.getItem("bareServers"));
            return x.setItem("bareServers", [...Array.from(bServers), ...servers])
        }

        async removeServer(...servers) {
            this.#servers = this.#servers.filter(e => (![...servers].includes(e)));
            const bServers = (await x.getItem("bareServers"));
            return x.setItem("bareServers", Array.from(bServers).filter(e => (![...servers].includes(e))))
        }

        async getServers(update = false) {
            if (update === true) {
                const bareServers = (await x.getItem("bareServers"));
                this.#servers = (bareServers.length > 0)? bareServers : [];
            }
            return this.#servers;
        }

        async getBareServers(update = false) {
            const servers = await this.getServers(update);
            if (servers.length > 0) {
                return servers;
            } else {
                return "/bare";
            }
        }
    }

    const config = Object.freeze({
        blockedDomains: new BDomainList(),
        adBlockState: new AdBlockToggle(),
        bareServers: new BareConfigurator()
    });

    return self.internalConfig = config;
})(self);