import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps } from "react";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

interface SectionSwitchProps {
    title?: string;
    subtitle?: string;
    active?: boolean;
    onChange?: Function;
}

const ThemedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: "var(--primary)",
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: "var(--primary)",
    },
  }));

class SettingsSectionSwitch extends React.Component {
    constructor(props: SectionSwitchProps) {
        super(props);
    }

    render() {
        const title = this.props["title"] || "Setting Name";
        const subtitle = this.props["subtitle"] || "Setting Subtitle";
        let active = this.props["active"] || false;
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
                    { /* @ts-ignore */ }
                    <ThemedSwitch checked={active} onChange={updateFunc}>

                    </ThemedSwitch>
                </div>
            </>
        )
    }
}

export default SettingsSectionSwitch;