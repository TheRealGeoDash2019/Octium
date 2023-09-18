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

interface ExtensionManifestIcon {
    size: number | string;
    url: string;
}

interface ExtensionItem {
    description: string;
    enabled: boolean;
    homepageUrl: string;
    hostPermissions: string[];
    icons: ExtensionManifestIcon[];
    id: string;
    installType: ExtensionInstallType;
    isApp: boolean;
    mayDisable: boolean;
    name: string;
    offlineEnabled: boolean;
    optionsUrl: string;
    permissions: string[];
    shortName: string;
    type: ExtensionType;
    updateUrl: string;
    version: string;
}

function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of management.${funcName}(${params}): ${reason}`)
}

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
    onDisabled: EventEmitter(),
    onEnabled: EventEmitter(),
    onInstalled: EventEmitter(),
    onUninstalled: EventEmitter()
}