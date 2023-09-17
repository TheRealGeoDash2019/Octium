Object.defineProperty(self, "chrome", {
    get: function() {
        return __capi$getModules(window.__uv$location);
    },
    set: function() {
        return null;
    },
    writable: false,
    configurable: false,
    enumerable: false
});
console.log("Attempted to override window.chrome");