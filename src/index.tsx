import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import localforage from "localforage";
import { jsNamespace, extensionsDisabled } from "./consts.tsx";
import 'regenerator-runtime/runtime';
import App from "./pages/app.js";
import ExtensionManager from "./extensionManager.tsx";
import configManager from "./configManager.tsx";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

if (!extensionsDisabled) {
    window[`${jsNamespace}ExtensionManager`] = new ExtensionManager();
}

configManager().then(resp => {
    window[`${jsNamespace}Config`] = resp;
})

window[`localForage`] = localforage;

root.render(
    <BrowserRouter basename="">
        <App />
    </BrowserRouter>
);
