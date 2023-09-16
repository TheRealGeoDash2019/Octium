import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ObfuscateLayout } from "../components/obfuscate";

import "../style/index.css";
import "../navigationBackup";
import "../proxy";
import { jsNamespace, internalNamespace } from "../consts";

var Home = React.lazy(() => import("./home"));
var InternalHome = React.lazy(() => import("./internal/home"));
var InternalBlank = React.lazy(() => import("./internal/blank"));
var InternalSettings = React.lazy(() => import("./internal/settings"));
var InternalViewSource = React.lazy(() => import("./internal/viewsource"));
var InternalExtensions = React.lazy(() => import("./internal/extensions"));
var InternalURLS = React.lazy(() => import("./internal/internal-urls"));
var Error = React.lazy(() => import("./error"));

function App() {
    return (
        <>
            <ObfuscateLayout />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<></>}>
                            <Home />
                        </Suspense>
                    }
                />
                <Route
                    path="/internal/home"
                    element={
                        <Suspense fallback={<></>}>
                            <InternalHome />
                        </Suspense>
                    }
                />
                <Route
                    path="/internal/settings/*"
                    element={
                        <Suspense fallback={<></>}>
                            <InternalSettings />
                        </Suspense>
                    }
                />
                
                <Route
                    path="/internal/extensions/*"
                    element={
                        <Suspense fallback={<></>}>
                            <InternalExtensions />
                        </Suspense>
                    }
                />
                <Route
                    path="/internal/blank"
                    element={
                        <Suspense fallback={<></>}>
                            <InternalBlank />
                        </Suspense>
                    }
                />
                <Route
                    path="/internal/viewsource"
                    element={
                        <Suspense fallback={<></>}>
                            <InternalViewSource />
                        </Suspense>
                    }
                />
                <Route
                    path={`/internal/${internalNamespace}-urls`}
                    element={
                        <Suspense fallback={<></>}>
                            <InternalURLS />
                        </Suspense>
                    }
                />
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<></>}>
                            <Error />
                        </Suspense>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
