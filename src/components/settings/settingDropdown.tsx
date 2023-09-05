import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps } from "react";
import { alpha, styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface SectionDropdownProps {
    title?: string;
    subtitle?: string;
    options?: string[];
    active?: string;
    onChange?: Function;
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
        return (
            <>
                <div className="settings-app-section-setting">
                    <div className="settings-app-section-setting-label">
                        <div className="settings-app-section-setting-title">
                            {title}
                        </div>
                        <div className="settings-app-section-setting-subtitle">
                            {subtitle}
                        </div>
                    </div>
                    <Select>
                        <MenuItem value={"testing"}>Testing</MenuItem>
                    </Select>
                </div>
            </>
        )
    }
}

export default SettingsSectionDropdown;