try {
    window.chrome = window.__capi$getModules(window.__sv$location.href);
    console.log("Attempted to override window.chrome");
} catch(err) {
    console.error(err)
}