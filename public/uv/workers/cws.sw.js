try {
    window.chrome = window.__capi$getModules(window.__uv$location.href);
    console.log("Attempted to override window.chrome");
} catch(err) {
    console.error(err)
}