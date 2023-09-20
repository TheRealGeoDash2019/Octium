import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { jsNamespace } from "./consts.tsx";
import 'regenerator-runtime/runtime';
import App from "./pages/app.js";
import localForage from "localforage";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

window[`${jsNamespace}Storage`] = localForage.createInstance({
    driver: localForage.INDEXEDDB,
    name: jsNamespace,
    version: 1,
    storeName: 'globalStorage',
    description: `Storage Namespace for ${jsNamespace}`
});

window[`${jsNamespace}ExtensionStorage`] = localForage.createInstance({
    driver: localForage.INDEXEDDB,
    name: jsNamespace,
    version: 1,
    storeName: 'extensionFiles',
    description: `Storage for ${jsNamespace} Extensions`
});

root.render(
    <BrowserRouter basename="">
        <App />
    </BrowserRouter>
);
