import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { parseColor, getAppropriateColor } from "../utils/color";

interface SectionDropdownProps {
    title?: string;
    subtitle?: string;
    options?: string[];
    active?: string;
    onChange?: Function;
    className?: string;
}

class SettingsSectionDropdown extends React.Component {
    constructor(props: SectionDropdownProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "Setting Subtitle";
        let active = this.props["active"] || false;
        const options = this.props["options"] || [];
        const updateFunc = this.props["onChange"] || (() => null);
        const className = this.props["className"] || "";
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
                    <Select value={"testing"} className="settings-app-section-setting-select">
                        <MenuItem value={"testing"}>Testing</MenuItem>
                    </Select>
                </div>
            </>
        )
    }
}

export default SettingsSectionDropdown;