// @ts-nocheck
<<<<<<< HEAD
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
=======
>>>>>>> 2e66843 (Git broken)
import SettingsSectionDropdown from "../settingDropdown";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
<<<<<<< HEAD
import { useLocalAppearance } from "../../../settings";
import themeTranslations from "../../utils/themeNames.json";
import MenuItem from '@mui/material/MenuItem';

function Appearance({ }) {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
=======
import { useLocalAppearance, useLocalBorderRadius } from "../../../settings";
import themeTranslations from "../../utils/themeNames.json";
import borderRadiusOptions from "../../utils/borderRadiusOptions.json";

function Appearance({ }) {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
    const [localBorderRadius, setLocalBorderRadius] = useLocalBorderRadius();
>>>>>>> 2e66843 (Git broken)
    const handleThemeChange = (event) => {
        const theme = event.target.value;
        setLocalAppearance(theme);
        window.parent.document.body.setAttribute(
            "data-appearance",
            theme
        );
    }
<<<<<<< HEAD
    return (
        <>
            <SettingsSectionDropdown className="first-subsetting last-subsetting" title="Theme" subtitle={`Set to: ${themeTranslations[localAppearance]}`} active={localAppearance} onChange={handleThemeChange}>
=======
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
>>>>>>> 2e66843 (Git broken)
                { ...Object.entries(themeTranslations).map(e => {
                    return <option value={e[0]}>{e[1]}</option>
                }) }
            </SettingsSectionDropdown>
<<<<<<< HEAD
=======
            <SettingsSectionDropdown className="last-subsetting" title="Border Radius" active={localBorderRadius} onChange={handleRadiusChange}>
                { ...Object.entries(borderRadiusOptions).map(e => {
                    return <option value={e[0]}>{e[1]}</option>
                }) }
            </SettingsSectionDropdown>
>>>>>>> 2e66843 (Git broken)
        </>
    )
}

export default Appearance;