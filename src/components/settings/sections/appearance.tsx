import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionDropdown from "../settingDropdown";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
import { useLocalAppearance } from "../../../settings";

const [localAppearance, setLocalAppearance] = useLocalAppearance();

const Appearance = [
    // @ts-ignore
    <SettingsSectionSwitch title="Show home button" subtitle="Testing" active={true}></SettingsSectionSwitch>,
    // @ts-ignore
    <SettingsSectionDropdown title="Theme" subtitle={localAppearance}></SettingsSectionDropdown>
];

export default Appearance;