import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

interface SectionInfoProps {
    title?: string;
    subtitle?: string;
    className?: string;
    children?: any[];
}


class SettingsSectionInfo extends React.Component {
    constructor(props: SectionInfoProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "";
        const className = this.props["className"] || "";
        const children = Children.toArray(this.props["children"]) || [];
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
                    { /* @ts-ignore */ }
                    <div className="settings-app-section-setting-icons">
                        { ...children }
                    </div>
                </div>
            </>
        )
    }
}

export default SettingsSectionInfo;