// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionExternalLink from "../settingExternalLink";
import SettingsSectionInfo from "../settingInfo";
import SettingsSectionHeader from "../settingHeader";
import { Obfuscated } from "../../obfuscate";
import React from "react";
import { jsNamespace, internalNamespace, github, discord } from "../../../consts";
import BugReportIcon from '@mui/icons-material/BugReport';
import BusinessIcon from '@mui/icons-material/Business';
import { version } from "../../../../package.json";
import ServerLogoIcon from "../../custom-icons/logo";

function About({ }) {

    const isViteDevActive = () => {
        return ("__vite_plugin_react_runtime_loaded__" in globalThis);
    }

    const getVersionInfo = () => {
        const buildName = (isViteDevActive()? "Canary Build" : "Official Build")
        return (`Version ${version} (${buildName}) Web`)
    }

    return (
        <>
            <SettingsSectionHeader className="first-subsetting" title={`${jsNamespace}`}>
                <ServerLogoIcon></ServerLogoIcon>
            </SettingsSectionHeader>
            <SettingsSectionInfo title={`${jsNamespace} is up to date`} subtitle={getVersionInfo()}></SettingsSectionInfo>
            <SettingsSectionExternalLink title={`Get help with ${jsNamespace}`} link={`${discord}`}></SettingsSectionExternalLink>
            <SettingsSectionExternalLink className={((isViteDevActive())? "" : "last-subsetting")} title="Report an issue" link={`${github}/issues/new/choose`}></SettingsSectionExternalLink>
            { 
                ((isViteDevActive())? (
                    <SettingsSectionInfo className="last-subsetting" title="Your browser is managed">
                        <BusinessIcon className="settings-app-section-setting-icon"></BusinessIcon>
                        <BugReportIcon className="settings-app-section-setting-icon"></BugReportIcon>
                    </SettingsSectionInfo>
                ) : (<></>))
            }
        </>
    )
}

export default About;