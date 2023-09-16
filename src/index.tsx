import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { jsNamespace } from "./consts.tsx";
import 'regenerator-runtime/runtime';
import App from "./pages/app.js";
import localForage from "localforage";

localForage.config({
    driver: localForage.INDEXEDDB,
    name: jsNamespace,
    version: 1,
    storeName: 'globalStorage',
    description: `Storage Namespace for ${jsNamespace}`
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

window[`${jsNamespace}Storage`] = localForage;

root.render(
    <BrowserRouter basename="">
        <App />
    </BrowserRouter>
);
