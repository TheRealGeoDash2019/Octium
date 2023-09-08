// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionDropdown from "../settingDropdown";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
import { useLocalAppearance } from "../../../settings";
import themeTranslations from "../../utils/themeNames.json";
import MenuItem from '@mui/material/MenuItem';

function Appearance({ }) {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
import { useLocalAppearance, useLocalBorderRadius } from "../../../settings";
import themeTranslations from "../../utils/themeNames.json";
import borderRadiusOptions from "../../utils/borderRadiusOptions.json";

function Appearance({ }) {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
    const [localBorderRadius, setLocalBorderRadius] = useLocalBorderRadius();
    const handleThemeChange = (event) => {
        const theme = event.target.value;
        setLocalAppearance(theme);
        window.parent.document.body.setAttribute(
            "data-appearance",
            theme
        );
    }
    return (
        <>
            <SettingsSectionDropdown className="first-subsetting last-subsetting" title="Theme" subtitle={`Set to: ${themeTranslations[localAppearance]}`} active={localAppearance} onChange={handleThemeChange}>
    const handleRadiusChange = (event) => {
        const radius = event.target.value;
        setLocalBorderRadius(radius);
        window.parent.document.body.setAttribute(
            "data-border-radius",
            radius
        );
    }
    return (
        <>
            <SettingsSectionDropdown className="first-subsetting" title="Theme" subtitle={`Set to: ${themeTranslations[localAppearance]}`} active={localAppearance} onChange={handleThemeChange}>
                { ...Object.entries(themeTranslations).map(e => {
                    return <option value={e[0]}>{e[1]}</option>
                }) }
            </SettingsSectionDropdown>
            <SettingsSectionDropdown className="last-subsetting" title="Border Radius" active={localBorderRadius} onChange={handleRadiusChange}>
                { ...Object.entries(borderRadiusOptions).map(e => {
                    return <option value={e[0]}>{e[1]}</option>
                }) }
            </SettingsSectionDropdown>
        </>
    )
}

export default Appearance;