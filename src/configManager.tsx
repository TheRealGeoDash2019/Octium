import localforage from "localforage";

interface BlockedDomainList {
    addDomain: Function;
    removeDomain: Function;
    hasDomain: Function;
    listDomains: Function;
    clearDomains: Function;
}

interface AdBlockState {
    enableBlocking: Function;
    disableBlocking: Function;
}

interface WebConfig {
    blockedDomains: BlockedDomainList;
    adBlockState: AdBlockState;
}

export default async function() {
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
                console.debug("[Config] Setting up blocked domains.");
                x.setItem("bDomains", []);
            } else {
                console.debug("[Config] Loaded blocked domains.");
                this.#domains = blockedDomainsResult;
            }
        }

        async addDomain(...domains) {
            this.#domains.push(...domains);
            const bDomains = (await x.getItem("bDomains")) as string[];
            return x.setItem("bDomains", [...Array.from(bDomains), ...domains])
        }

        async removeDomain(...domains) {
            this.#domains = this.#domains.filter(e => (![...domains].includes(e)));
            const bDomains = (await x.getItem("bDomains")) as string[];
            return x.setItem("bDomains", Array.from(bDomains).filter(e => (![...domains].includes(e))))
        }

        async hasDomain(domain) {
            return this.#domains.find(e => (e === domain));
        }

        async clearDomains() {
            this.#domains = [];
            return x.setItem("bDomains", []);
        }

        async listDomains() {
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
                console.debug("[Config] Loaded adblock state.");
                this.#state = adBlockState;
            } else {
                console.debug("[Config] Setting up adblock state.");
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



    const config: WebConfig = Object.freeze({
        blockedDomains: new BDomainList() as BlockedDomainList,
        adBlockState: new AdBlockToggle() as AdBlockState
    });

    return config;
}