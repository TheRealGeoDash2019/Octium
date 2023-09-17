function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of webstorePrivate.${funcName}(${params}): ${reason}`)
}

function isInIncognitoMode(callback: Function) {
    // You've been trolled :)
    if (!callback || !(typeof callback === "function")) {
        throw generateError("isInIncognitoMode", "function callback");
    }
    return (callback(true),null);
}

export default {
    isInIncognitoMode
}