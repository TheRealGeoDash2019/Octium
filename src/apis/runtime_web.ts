enum ContextType {
    BACKGROUND = "BACKGROUND",
    OFFSCREEN_DOCUMENT = "OFFSCREEN_DOCUMENT",
    POPUP = "POPUP",
    SIDE_PANEL = "SIDE_PANEL",
    TAB = "TAB"
}

enum OnInstalledReason {
    CHROME_UPDATE = "chrome_update",
    INSTALL = "install",
    SHARED_MODULE_UPDATE = "shared_module_update",
    UPDATE = "update"
}

enum OnRestartRequiredReason {
    APP_UPDATE = "app_update",
    OS_UPDATE = "os_update",
    PERIODIC = "periodic"
}

enum PlatformArch {
    ARM = "arm",
    ARM64 = "arm64",
    MIPS = "mips",
    MIPS64 = "mips64",
    X86_32 = "x86-32",
    X86_64 = "x86-64"
}

enum PlatformNaclArch {
    ARM = "arm",
    MIPS = "mips",
    MIPS64 = "mips64",
    X86_32 = "x86-32",
    X86_64 = "x86-64"
}

enum PlatformOs {
    ANDROID = "android",
    CROS = "cros",
    FUCHSIA = "fuchsia",
    LINUX = "linux",
    MAC = "mac",
    OPENBSD = "openbsd",
    WIN = "win"
}

enum RequestUpdateCheckStatus {
    NO_UPDATE = "no_update",
    THROTTLED = "throttled",
    UPDATE_AVAILABLE = "update_available"
}

function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of runtime.${funcName}(${params}): ${reason}`)
}

function sendMessage(extensionId: string, message: any, options: object | null | undefined, callback: Function | null | undefined) {
    if (!extensionId || !message) {
        const reason = (!extensionId? "chrome.runtime.sendMessage() called from a webpage must specify an Extension ID (string) for its first argument." : null);
        throw generateError("sendMessage", "optional string extensionId, any message, optional object options, optional function callback", reason);
    }
}

function connect(extensionId: string, connectInfo: object | null | undefined) {
    if (!extensionId) {
        throw generateError("connect", "optional string extensionId, optional object connectInfo", "chrome.runtime.connect() called from a webpage must specify an Extension ID (string) for its first argument.")
    }
}

export default {
    ContextType,
    OnInstalledReason,
    OnRestartRequiredReason,
    PlatformArch,
    PlatformNaclArch,
    PlatformOs,
    RequestUpdateCheckStatus,
    id: undefined,
    sendMessage,
    connect
}