import webstorePrivate from "./webstorePrivate";

const webstoreRegex = /https\:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore)/gmi;
const urlTester = /http(s?):\/\//gmi;
const idTester = /^[a-z]{32}$/gmi;

const webstoreDefault = Object.defineProperties({}, {
    webstorePrivate: {
        value: webstorePrivate,
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
    runtime: {
        value: {},
        writable: false,
        enumerable: false,
        configurable: false
    }
})

globalThis.__capi$getModules = function(urlOrID: string) {
    const idMatch = (idTester.test(urlOrID)||!!urlOrID.match(idTester));
    const urlMatch = (webstoreRegex.test(urlOrID)||!!urlOrID.match(webstoreRegex));
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