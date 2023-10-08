import React, { Suspense } from "react";
import { 
    Routes, 
    Route, 
    useLocation,
    useNavigationType,
    createRoutesFromChildren,
    matchRoutes
} from "react-router-dom";
import { ObfuscateLayout } from "../components/obfuscate";

import "../style/index.css";
import "../navigationBackup";
import "../proxy";
import { jsNamespace, internalNamespace } from "../consts";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://e9f7e81e4be690c00b4c5bc61b705414@o1228900.ingest.sentry.io/4506012351266816",
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["localhost", "localhost:8000", "octium.azul.one"],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
        )
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.5,
    replaysSessionSampleRate: 0.4,
    replaysOnErrorSampleRate: 0.5,
});

var Home = React.lazy(() => import("./home"));
var InternalHome = React.lazy(() => import("./internal/home"));
var InternalBlank = React.lazy(() => import("./internal/blank"));
var InternalSettings = React.lazy(() => import("./internal/settings"));
var InternalViewSource = React.lazy(() => import("./internal/viewsource"));
var InternalExtensions = React.lazy(() => import("./internal/extensions"));
var InternalURLS = React.lazy(() => import("./internal/internal-urls"));
var Error = React.lazy(() => import("./error"));

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
    return (
        <>
            <ObfuscateLayout />
            <SentryRoutes>
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
            </SentryRoutes>
        </>
    );
}

export default App;