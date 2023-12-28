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

        getState() {
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

        async getAdDomains() {
            if (this.#state === false) {
                return [];
            } else {
                const req = await fetch(`https://hosts.anudeep.me/mirror/adservers.txt`);
                const resp = await req.text();
                return resp.split("\n").filter(e => (!e.startsWith("#"))).map(e => e.split(" ")[1]);
            }
        }
    }

    const config = Object.freeze({
        blockedDomains: new BDomainList(),
        adBlockState: new AdBlockToggle()
    });

    return self.internalConfig = config;
})(self);