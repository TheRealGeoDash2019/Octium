import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import { parseColor, getAppropriateColor } from "../utils/color";

interface SectionDropdownProps {
    title?: string;
    subtitle?: string;
    children?: any[];
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
<<<<<<< HEAD
        const subtitle = this.props["subtitle"] || "Setting Subtitle";
=======
        const subtitle = this.props["subtitle"] || "";
>>>>>>> 2e66843 (Git broken)
        let active = this.props["active"] || false;
        const children = Children.toArray(this.props["children"]) || [];
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
                    <select className="settings-app-section-setting-select" onChange={updateFunc} value={active}>
                        { ...children }
                    </select>
                </div>
            </>
        )
    }
}

export default SettingsSectionDropdown;