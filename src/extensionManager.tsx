import BrowserFS, { Errors, BFSRequire, FileSystem } from "browserfs";
import { FileFlag } from "browserfs/dist/node/core/file_flag";
import { internalNamespace, jsNamespace } from "./consts";

class CRXManager {
    #apiHost = "https://crx.azul.one";

    getUrls(extId: string) {
        return ({
            downloadCRX: [this.#apiHost,":id/download".replace(":id", extId)].join("/"),
            downloadZIP: [this.#apiHost,":id/download-as-zip".replace(":id", extId)].join("/"),
            manifest: [this.#apiHost,":id/manifest".replace(":id", extId)].join("/")
        });
    }

    getFileFlag(type: string = "r") {
        return new FileFlag(type);
    }

    async downloadZIP(extId: string) {
        return await fetch(this.getUrls(extId).downloadZIP).then(e => e.arrayBuffer());
    }

    getZIPFS(extId: string) {
        return new Promise(async (res, rej) => {
            const zipAB = await this.downloadZIP(extId);
            const zipBuffer = BFSRequire("buffer").Buffer.from(zipAB);
            BrowserFS.getFileSystem({
                fs: "ZipFS",
                options: {
                    name: `${extId}.zip`,
                    zipData: zipBuffer
                }
            }, function(err, zip) {
                if (err) rej(err);
                res(zip);
            })
        })
    }

    async downloadCRX(extId: string) {
        return await fetch(this.getUrls(extId).downloadCRX).then(e => e.arrayBuffer());
    }

    async getManifest(extId: string) {
        return await fetch(this.getUrls(extId).manifest).then(e => e.json());
    }
}

class ExtensionManager {
    #fsBackend = null;
    #nodeGlobal = {};
    #crxBackend = new CRXManager();
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

    getCRXBackend() {
        return this.#crxBackend;
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

    installExtension(extId: string, details: object) {
        console.log(extId);
        console.log(details);
    }
}

export default ExtensionManager;