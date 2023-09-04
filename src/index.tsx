import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'regenerator-runtime/runtime';
import App from "./pages/app.js";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <BrowserRouter basename="">
        <App />
    </BrowserRouter>
);
