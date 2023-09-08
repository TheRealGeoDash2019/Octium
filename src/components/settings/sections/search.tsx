// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionSwitch from "../settingSwitch";
import SettingsSectionInput from "../settingInput";
import SettingsSectionDropdown from "../settingDropdown";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
import { useLocalTitle, useLocalIcon } from "../../../settings";
import MenuItem from '@mui/material/MenuItem';

function Search({ }) {
    const [searchEngine, setSearchEngine] = React.useState(
        localStorage.getItem("engine") || "https://www.google.com/search?q=%s"
    );

    const defaultEngine = searchEngine || "https://www.google.com/search?q=%s";

    const searchChange = function(event) {
        const value = event.target.value;
        try {
            setSearchEngine(value || "https://www.google.com/search?q=%s");
        } catch {
            // Probably Errored...
        }
    }

    return (
        <>
            <SettingsSectionInput className="first-subsetting last-subsetting" title="Search Engine" initialValue={defaultEngine} placeholder="Provider URL" onChange={searchChange} extended={true}></SettingsSectionInput>
        </>
    )
}

export default Search;