// @ts-nocheck
import SettingsSection from "../section";
import SettingsSectionInput from "../settingInput";
import SettingsSectionInfo from "../settingInfo";
import { Obfuscated } from "../../../components/obfuscate";
import React from "react";
import { jsNamespace, internalNamespace } from "../../../consts";
import { useLocalTitle, useLocalIcon } from "../../../settings";
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';


function Cloaking({ }) {
    var [localTitle, setLocalTitle] = useLocalTitle();
    var [localIcon, setLocalIcon] = useLocalIcon();

    const defaultTitle = localTitle || jsNamespace;
    const defaultIcon = localIcon || "";

    const titleChange = function(event) {
        const value = event.target.value;
        try {
            window.parent.document.title = value || jsNamespace;
            setLocalTitle(value || "");
        } catch {
            // Probably Errored...
        }
    }

    const iconChange = function(event) {
        const value = event.target.value;
        try {
            window.parent.document.querySelector(`[rel="icon"]`).href = (value || "/logos/logo.svg");
            setLocalIcon(value || "");
        } catch {
            // Probably Errored...
        }
    }

    var title = React.useRef<HTMLInputElement>(null);
    var icon = React.useRef<HTMLInputElement>(null);

    const resetCloaking = () => {
        const event = { target: { value: "" } };
        titleChange(event);
        iconChange(event);
    };

    interface ChangeIconTypes {
        title: string;
        icon: string;
    }

    function ChangeIcon({ title, icon }: ChangeIconTypes) {
        return (
            <div
                onClick={() => {
                    titleChange({ target: { value: title } });
                    iconChange({ target: { value: icon } });
                }}
                className="sidePanelCloakingPreset"
                title={title}
            >
                <img
                    style={{ pointerEvents: "none" }}
                    src={icon}
                    alt={title}
                />
            </div>
        );
    }

    return (
        <>
            <SettingsSectionInput className="first-subsetting" title="Title" initialValue={defaultTitle} placeholder="Title" onChange={titleChange}></SettingsSectionInput>
            <SettingsSectionInput title="Icon" initialValue={defaultIcon} placeholder="Favicon URL" onChange={iconChange}></SettingsSectionInput>
            <SettingsSectionInfo className="last-subsetting" title="Presets">
                <div
                    className="sidePanelCloakingPreset"
                    onClick={resetCloaking}
                    title="Clear"
                >
                    <CloseIcon
                        style={{ pointerEvents: "none" }}
                        fontSize="medium"
                    />
                </div>
                <ChangeIcon
                    icon="https://www.google.com/favicon.ico"
                    title="Google"
                />
                <ChangeIcon
                    icon="https://www.drive.google.com/favicon.ico"
                    title="Google Drive"
                />
                <ChangeIcon
                    icon="https://edpuzzle.imgix.net/favicons/favicon-32.png"
                    title="EdPuzzle"
                />
                <ChangeIcon
                    icon="https://st1.zoom.us/zoom.ico"
                    title="Zoom"
                />
                <ChangeIcon
                    icon="https://www.khanacademy.org/favicon.ico"
                    title="Khan Academy"
                />
            </SettingsSectionInfo>
        </>
    )
}

export default Cloaking;