// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionExternalLink from "../settingExternalLink";
import SettingsSectionInfo from "../settingInfo";
import SettingsSectionHeader from "../settingHeader";
import SettingsSectionAction from "../settingAction";
import { Obfuscated } from "../../obfuscate";
import React from "react";
import { jsNamespace, internalNamespace, github, discord } from "../../../consts";
import BugReportIcon from '@mui/icons-material/BugReport';
import BusinessIcon from '@mui/icons-material/Business';
import { version } from "../../../../package.json";
import ServerLogoIcon from "../../custom-icons/logo";

function Reset({ }) {

    const isViteDevActive = () => {
        const devModeOverride = (!!localStorage.getItem("NOT_SO_SECRET_DEVMODE_FEATURE") && localStorage.getItem("NOT_SO_SECRET_DEVMODE_FEATURE") === [jsNamespace,(new Date).getFullYear().toString()].join("|"));
        return devModeOverride || ("__vite_plugin_react_runtime_loaded__" in globalThis);
    }

    const confirmReset = async function() {
        try {
            const result = await window.top[jsNamespace].confirm("Browser Reset", "Are you sure you want to reset?");
            if (result === true) {
                // Reset LocalStorage, SessionStorage, IndexedDB, Cookies, Service Workers
                Object.keys(localStorage).forEach(e => localStorage.removeItem(e));
                Object.keys(sessionStorage).forEach(e => sessionStorage.removeItem(e));
                indexedDB.databases().then(e => (e || []).forEach(db => indexedDB.deleteDatabase(db?.name)));
                cookieStore.getAll().then(c => cookieStore.delete(c?.name));
                navigator.serviceWorker.getRegistrations().then(r => r.forEach(e => e.unregister()))
                window.top[jsNamespace].alert("Browser Reset", "All Settings are reset...").then(ack => {
                    location.reload();
                })
            } else {
                // Ignore
            }
        } catch(err) {
            console.error(err);
        }
    }

    const getVersionInfo = () => {
        const buildName = (isViteDevActive()? "Canary Build" : "Official Build")
        return (`Version ${version} (${buildName}) Web`)
    }

    return (
        <>
            <SettingsSectionAction className="first-subsetting last-subsetting" title="Reset the browser to the original defaults" onClick={confirmReset}></SettingsSectionAction>
        </>
    )
}

export default Reset;