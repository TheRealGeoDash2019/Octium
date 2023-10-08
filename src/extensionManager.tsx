import BrowserFS, { Errors, BFSRequire } from "browserfs";
import { internalNamespace, jsNamespace } from "./consts";

class ExtensionManager {
    #fsBackend = null;
    #nodeGlobal = {};
    constructor() {
        BrowserFS.install(this.#nodeGlobal);
        BrowserFS.configure({
            fs: "AsyncMirror",
            options: {
                sync: { 
                    fs: "InMemory"
                },
                async: { 
                    fs: "IndexedDB",
                    options: {
                        storeName: `${internalNamespace}ExtensionFiles`
                    }
                }
            }
        }, this.#initialize.bind(this));
        this.#fsBackend = BFSRequire("fs");
    }

    getNodeGlobal() {
        return this.#nodeGlobal;
    }

    getFSBackend() {
        return this.#fsBackend;
    }

    getBrowserFS() {
        return BrowserFS;
    }

    #initialize(err?: Errors.ApiError) {
        const self = this;
        return new Promise((res, rej) => {
            if (err) return (console.error(err),console.warn("Extensions cannot be loaded!\nAny API calls will fail!"));
            console.log("Initializing Extensions")
            self.getFSBackend().exists("/Extensions", (result) => {
                if (result !== true) {
                    self.getFSBackend().mkdir("/Extensions", (err) => {
                        if (err) rej(new Errors.ApiError(1, "Couldn't make /Extensions"));
                    });
                    self.getFSBackend().writeFile("/README.md", `${jsNamespace} Project - ${new Date().getFullYear()}\nDirectory for Profile Data`, (err) => {
                        if (err) rej(new Errors.ApiError(1, "Couldn't make /README.md"));
                    })
                }
            })
            res(null);
        });
    }
}

export default ExtensionManager;