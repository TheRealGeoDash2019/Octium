import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

interface SectionHeaderProps {
    title?: string;
    className?: string;
    children?: any[];
}


class SettingsSectionHeader extends React.Component {
    constructor(props: SectionHeaderProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const className = this.props["className"] || "";
        const children = Children.toArray(this.props["children"]) || [];
        return (
            <>
                <div className={`settings-app-section-setting ${className}`}>
                    <div className="settings-app-section-setting-header-icons">
                        { ...children }
                    </div>
                    <div className="settings-app-section-setting-label">
                        <div className="settings-app-section-setting-header">
                            {title}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default SettingsSectionHeader;