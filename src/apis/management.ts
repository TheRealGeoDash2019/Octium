import EventEmitter from "./util/Event";

enum ExtensionInstallType {
    ADMIN = "admin",
    DEVELOPMENT = "development",
    NORMAL = "normal",
    OTHER = "other",
    SIDELOAD = "sideload"
}

enum ExtensionDisabledReason {
    PERMISSIONS_INCREASE = "permissions_increase",
    UNKNOWN = "unknown"
}

enum ExtensionType {
    EXTENSION = "extension",
    HOSTED_APP = "hosted_app",
    LEGACY_PACKAGED_APP = "legacy_packaged_app",
    LOGIN_SCREEN_EXTENSION = "login_screen_extension",
    PACKAGED_APP = "packaged_app",
    THEME = "theme"
}

enum LaunchType {
    OPEN_AS_PINNED_TAB = "OPEN_AS_PINNED_TAB",
    OPEN_AS_REGULAR_TAB = "OPEN_AS_REGULAR_TAB",
    OPEN_AS_WINDOW = "OPEN_AS_WINDOW",
    OPEN_FULL_SCREEN = "OPEN_FULL_SCREEN"
}

interface IconInfo {
    size: number;
    url: string;
}

interface ExtensionInfo {
    appLaunchUrl?: string;
    availableLaunchTypes?: LaunchType[];
    description: string;
    disabledReason?: ExtensionDisabledReason;
    enabled: boolean;
    homepageUrl?: string;
    hostPermissions: string[];
    icons?: IconInfo[];
    id: string;
    installType: ExtensionInstallType;
    isApp: boolean;
    launchType?: LaunchType;
    mayDisable: boolean;
    mayEnable?: boolean;
    name: string;
    offlineEnabled: boolean;
    optionsUrl: string;
    permissions: string[];
    shortName: string;
    type: ExtensionType;
    updateUrl?: string;
    version: string;
    versionName?: string;
}

interface UninstallOptions {
    showConfirmDialog?: boolean;
}

function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of management.${funcName}(${params}): ${reason}`)
}

/**
 * Gets All Extensions regardless of Enabled or Disabled
 * @param callback              Function
 * @returns                     ExtensionInfo[]
 */
function getAll(callback: Function) {
    if (!callback || !(typeof callback === "function")) {
        throw generateError("getAll", "function callback");
    }
    // TODO:
    return (callback([]),null);
}

export default {
    ExtensionDisabledReason,
    ExtensionInstallType,
    ExtensionType,
    LaunchType,
    getAll,
    // (info: ExtensionInfo) => void
    onDisabled: EventEmitter(),
    // (info: ExtensionInfo) => void
    onEnabled: EventEmitter(),
    // (info: ExtensionInfo) => void
    onInstalled: EventEmitter(),
    // (id: string) => void
    onUninstalled: EventEmitter()
}