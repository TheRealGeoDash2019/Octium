import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { jsNamespace } from "./consts.tsx";
import 'regenerator-runtime/runtime';
import App from "./pages/app.js";
import ExtensionManager from "./extensionManager.tsx";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

window[`${jsNamespace}ExtensionManager`] = new ExtensionManager();

root.render(
    <BrowserRouter basename="">
        <App />
    </BrowserRouter>
);
