import webstorePrivate from "./webstorePrivate";
import management from "./management";
import app from "./app";
import runtimeWeb from "./runtime_web";
import csi from "./csi";

const webstoreRegex = /https\:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore)/gmi;
const urlTester = /http(s?):\/\//gmi;
const idTester = /^[a-z]{32}$/gmi;

const webstoreDefault = Object.defineProperties({}, {
    webstorePrivate: {
        value: webstorePrivate,
        writable: false,
        enumerable: false,
        configurable: false
    },
    management: {
        value: management,
        writable: false,
        enumerable: false,
        configurable: false
    },
    runtime: {
        value: runtimeWeb,
        writable: false,
        enumerable: false,
        configurable: false
    },
    app: {
        value: app,
        writable: false,
        enumerable: false,
        configurable: false
    },
    csi: {
        value: csi,
        writable: false,
        enumerable: false,
        configurable: false
    }
});

const websiteDefault = Object.defineProperties({}, {
    app: {
        value: {},
        writable: false,
        enumerable: false,
        configurable: false
    },
    csi: {
        value: csi,
        writable: false,
        enumerable: false,
        configurable: false
    }
})

globalThis.__capi$getModules = function(urlOrID: string) {
    const idMatch = (idTester.test(urlOrID)||!!urlOrID.match(idTester));
    const urlMatch = (urlTester.test(urlOrID)||!!urlOrID.match(urlTester));
    const webStoreMatch = (urlMatch? (webstoreRegex.test(urlOrID)||!!urlOrID.match(webstoreRegex)) : false);
    if (idMatch && !urlMatch) {
        return Object.freeze({});
    } else if (urlMatch && !idMatch) {
        if (webStoreMatch) {
            return Object.freeze(webstoreDefault);
        } else {
            return Object.freeze(websiteDefault);
        }
    } else {
        return Object.freeze(websiteDefault);
    }
}