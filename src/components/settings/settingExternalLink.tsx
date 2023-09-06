import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps } from "react";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface SectionExternalLinkProps {
    title?: string;
    subtitle?: string;
    link?: string;
    className?: string;
}

class SettingsSectionExternalLink extends React.Component {
    constructor(props: SectionExternalLinkProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "";
        const link = this.props["link"] || `${internalNamespace}://blank`;
        const className = this.props["className"] || "";
        return (
            <>
                <div className={`settings-app-section-setting setting-clickable ${className}`} onClick={() => { window.parent[jsNamespace].navigate(link)}}>
                    <div className="settings-app-section-setting-label">
                        <div className="settings-app-section-setting-title">
                            {title}
                        </div>
                        <div className="settings-app-section-setting-subtitle">
                            {subtitle}
                        </div>
                    </div>
                    { /* @ts-ignore */ }
                    <OpenInNewIcon className="settings-app-section-setting-icon"></OpenInNewIcon>
                </div>
            </>
        )
    }
}

export default SettingsSectionExternalLink;