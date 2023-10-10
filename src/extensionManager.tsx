import BrowserFS, { Errors, BFSRequire } from "browserfs";
import { FileFlag } from "browserfs/dist/node/core/file_flag";
import { internalNamespace, jsNamespace } from "./consts";

function calculateSize(size: number = 0) {
    const sizes = {
        0: "B", 1: "KB", 2: "MB", 3: "GB", 4: "TB",
    }
    let base = 0;
    let parsedUnit = size;
    while (parsedUnit >= 1024 && !!sizes[base]) {
        parsedUnit = (parsedUnit / 1024) as number;
        base += 1;
    }
    // Realistically this should never go over GB for Extensions... :)
    const sizePrefix = parseFloat(parsedUnit.toString()).toPrecision(3);
    const sizeSuffix = sizes[base];
    return (sizePrefix + " " + sizeSuffix);
}

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
                res({
                    size: calculateSize(zipBuffer.byteLength),
                    fs: zip 
                });
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

    async installExtension(extId: string, details) {
        // console.log(extId);
        // console.log(details);
        console.log("[Extension Manager] Installing %s (%s)", details.localizedName, details.id)
        const saveDirectory = `/Extensions/${extId}`;
        if (!this.getFSBackend().existsSync(saveDirectory)) {
            this.getFSBackend().mkdirSync(saveDirectory);
        };
        // @ts-ignore
        const { fs: zip, size } = await this.#crxBackend.getZIPFS(extId);
        const zipFiles = zip._directoryEntries.map(e => e._filename);
        try {
            for (const file of zipFiles) {
                if (file.endsWith("/")) {
                    // Most likely a directory :o
                    const _ = [saveDirectory, file].join("/");
                    if (!this.getFSBackend().existsSync(_)) {
                        this.getFSBackend().mkdirSync(_);
                    }
                } else {
                    // Most likely a file :)
                    const _ = [saveDirectory, file].join("/");
                    const content = zip.readFileSync(`/${file}`, null, new FileFlag("r"))
                    this.getFSBackend().writeFileSync(_, content);
                }
            }
            return (console.log("[Extension Manager] Installed %s (%s)", details.localizedName, details.id), true);
        } catch (err) {
            console.debug(err);
            return (console.log("[Extension Manager] Failed to Install %s (%s)", details.localizedName, details.id), false);
        }
    }

    isExtensionInstalled(extId: string) {
        const saveDirectory = `/Extensions/${extId}`;
        return this.getFSBackend().existsSync(saveDirectory);
    }

    getInstalledExtensionIds() {
        return Array.from(this.getFSBackend().readdirSync(`/Extensions`) || [])
    }

    getInstalledExtensionManifests() {
        const installedIds = Array.from(this.getFSBackend().readdirSync(`/Extensions`) || []);
        return installedIds.map(e => {
            const manifest = JSON.parse(this.getFSBackend().readFileSync(`/Extensions/`+e+`/manifest.json`, "utf-8", new FileFlag("r")));
            return Object.assign(manifest, {
                id: e
            })
        });
    }

    getParsedExtensionManifest(extId: string) {
        const manifest = JSON.parse(this.getFSBackend().readFileSync(`/Extensions/`+extId+`/manifest.json`, "utf-8", new FileFlag("r")));
        if ("default_locale" in manifest) {
            if (this.getFSBackend().existsSync(`/Extensions/`+extId+`/_locales/${manifest.default_locale}/messages.json`)) {
                const messages = JSON.parse(this.getFSBackend().readFileSync(`/Extensions/`+extId+`/_locales/${manifest.default_locale}/messages.json`, "utf-8", new FileFlag("r")));
                // @ts-ignore
                const newManifest = JSON.stringify(manifest).replace(/\"__MSG_([^"'`]*)__\"/gmi, function(value: string) {
                    // @ts-ignore
                    const messageToGet = value.replaceAll("__", "").replace("MSG_", "").replaceAll("\"", "");
                    return value = JSON.stringify(messages[messageToGet].message);
                });
                return JSON.parse(newManifest);
            } else {
                return manifest;
            }
        } else {
            return manifest;
        }
    }

    getExtensionManifest(extId: string) {
        const saveDirectory = `/Extensions/${extId}`;
        const manifestFile = `${saveDirectory}/manifest.json`;
        if (this.getFSBackend().existsSync(saveDirectory)) {
            if (this.getFSBackend().existsSync(manifestFile)) {
                return JSON.parse(this.getFSBackend().readFileSync(manifestFile, "utf-8", new FileFlag("r")));
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default ExtensionManager;