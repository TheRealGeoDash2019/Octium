import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

interface SectionActionProps {
    title?: string;
    subtitle?: string;
    className?: string;
    onClick?: Function;
}


class SettingsSectionAction extends React.Component {
    constructor(props: SectionActionProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "";
        const className = this.props["className"] || "";
        const onClick = this.props["onClick"] || (() => {});
        return (
            <>
                <div className={`settings-app-section-setting setting-clickable ${className}`} onClick={onClick}>
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
                        <ArrowRightIcon className="settings-app-section-setting-icon"></ArrowRightIcon>
                    </div>
                </div>
            </>
        )
    }
}

export default SettingsSectionAction;