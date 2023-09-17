enum ExtensionInstallStatus {
    BLACKLISTED = "blacklisted",
    BLOCKED_BY_POLICY = "blocked_by_policy",
    CAN_REQUEST = "can_request",
    CUSTODIAN_APPROVAL_REQUIRED = "custodian_approval_required",
    DISABLED = "disabled",
    ENABLED = "enabled",
    FORCE_INSTALLED = "force_installed",
    INSTALLABLE = "installable",
    REQUEST_PENDING = "request_pending",
    TERMINATED = "terminated"
}

enum Result {
    "" = "",
    ALREADY_INSTALLED = "already_installed",
    BLACKLISTED = "blacklisted",
    BLOCKED_BY_POLICY = "blocked_by_policy",
    BLOCKED_FOR_CHILD_ACCOUNT = "blocked_for_child_account",
    FEATURE_DISABLED = "feature_disabled",
    ICON_ERROR = "icon_error",
    INSTALL_ERROR = "install_error",
    INSTALL_IN_PROGRESS = "install_in_progress",
    INVALID_ICON_URL = "invalid_icon_url",
    INVALID_ID = "invalid_id",
    LAUNCH_IN_PROGRESS = "launch_in_progress",
    MANIFEST_ERROR = "manifest_error",
    MISSING_DEPENDENCIES = "missing_dependencies",
    SUCCESS = "success",
    UNKNOWN_ERROR = "unknown_error",
    UNSUPPORTED_EXTENSION_TYPE = "unsupported_extension_type",
    USER_CANCELLED = "user_cancelled",
    USER_GESTURE_REQUIRED = "user_gesture_required"
}

enum WebGlStatus {
    WEBGL_ALLOWED = "webgl_allowed",
    WEBGL_BLOCKED = "webgl_blocked"
}

interface InstallManifest3Details {
    esbAllowlist?: boolean,
    iconUrl?: string,
    id: string,
    localizedName?: string,
    manifest: string
}

const pendingCompletionInstalls = new Map();

function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of webstorePrivate.${funcName}(${params}): ${reason}`)
}

function isInIncognitoMode(callback: Function) {
    // You've been trolled :)
    if (!callback || !(typeof callback === "function")) {
        throw generateError("isInIncognitoMode", "function callback");
    }
    return (callback(false),null);
}

function getExtensionStatus(id: string, manifest: string | undefined, callback: Function) {
    console.log("ID:",id);
    console.log("Manifest:",manifest);
    if (!id || !callback || !(typeof callback === "function")) {
        throw generateError("getExtensionStatus", "string id, optional string manifest, function callback");
    }
    return (callback(ExtensionInstallStatus.INSTALLABLE),null);
}

function getStoreLogin(callback: Function) {
    if (!callback || !(typeof callback === "function")) {
        throw generateError("getStoreLogin", "function callback");
    }
    return (callback(""),null);
}

function beginInstallWithManifest3(details: InstallManifest3Details, callback: Function) {
    if (!details || !callback || !(typeof callback === "function")) {
        throw generateError("beginInstallWithManifest3", "object details, optional function callback");
    }
    pendingCompletionInstalls.set(details.id, details);
    const userInput = confirm(`Chrome Web Store wants to Install:\n${details.localizedName}\nPress "OK" to proceed, otherwise press "Cancel"`);
    if (userInput === true) return (callback(""),null);
    else return (callback(Result.USER_CANCELLED),null);
}

function getReferrerChain(callback: Function) {
    if (!callback || !(typeof callback === "function")) {
        throw generateError("getReferrerChain", "function callback");
    }
    return (callback("EgIIAA=="),null);
}

function completeInstall(expectedId: string, callback: Function | undefined) {
    if (!pendingCompletionInstalls.has(expectedId)) {
        console.error(`Unchecked runtime.lastError: ${expectedId} does not match a previous call to beginInstallWithManifest3`);
    } else {
        // Browser would install the Extension and return something?
        pendingCompletionInstalls.delete(expectedId);
        if (callback && typeof callback === "function") {
            return callback(Result.SUCCESS);
        } else {
            return Result.SUCCESS;
        }
    }
}

export default {
    ExtensionInstallStatus,
    Result,
    WebGlStatus,
    isInIncognitoMode,
    getExtensionStatus,
    getStoreLogin,
    beginInstallWithManifest3,
    getReferrerChain,
    completeInstall
}