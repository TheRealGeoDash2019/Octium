// @ts-ignore
navigator.serviceWorker.register(new URL("/sv-sw.js", globalThis.location), {
    scope: __sv$config.prefix,
});
