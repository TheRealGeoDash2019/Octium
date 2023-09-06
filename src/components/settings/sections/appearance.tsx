// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionDropdown from "../settingDropdown";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
import { useLocalAppearance } from "../../../settings";

function Appearance({ }) {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
    return (
        <>
            <SettingsSectionDropdown className="first-subsetting last-subsetting" title="Theme" subtitle={`Set to: ${localAppearance}`}></SettingsSectionDropdown>
        </>
    )
}

export default Appearance;