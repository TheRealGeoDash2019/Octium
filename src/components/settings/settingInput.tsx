import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import { parseColor, getAppropriateColor } from "../utils/color";

interface SectionInputProps {
    title?: string;
    subtitle?: string;
    initialValue?: string;
    onChange?: Function;
    className?: string;
    placeholder?: string;
    extended?: boolean;
}

class SettingsSectionInput extends React.Component {
    constructor(props: SectionInputProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "";
        const initialValue = this.props["initialValue"] || "";
        const placeholder = this.props["placeholder"] || "";
        const updateFunc = this.props["onChange"] || (() => null);
        const className = this.props["className"] || "";
        const isExtended = Boolean(this.props["extended"] || false)
        return (
            <>
                <div className={`settings-app-section-setting ${className}`}>
                    <div className="settings-app-section-setting-label">
                        <div className="settings-app-section-setting-title">
                            {title}
                        </div>
                        <div className="settings-app-section-setting-subtitle">
                            {subtitle}
                        </div>
                    </div>
                    <input className={`settings-app-section-setting-input${isExtended? "-extended" : ""}`} onChange={updateFunc} value={initialValue} placeholder={placeholder}></input>
                </div>
            </>
        )
    }
}

export default SettingsSectionInput;