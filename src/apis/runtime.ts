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

export default {
    ContextType,
    OnInstalledReason,
    OnRestartRequiredReason,
    PlatformArch,
    PlatformNaclArch,
    PlatformOs,
    RequestUpdateCheckStatus
}