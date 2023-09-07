import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";

interface SettingsSectionProps {
    title?: string;
    settings?: any[];
    children?: any[];
}

const replacementTitle = {
    "help": `About ${jsNamespace}`,
    "appearance": "Appearance"
}

class SettingsSection extends React.Component {
    constructor(props: SettingsSectionProps) {
        super(props);
    }

    render() {
        const title = this.props["title"];
        const settings = this.props["settings"] || [];
        const children = Children.toArray(this.props["children"]) || [];
        return (
            <>
                <Container className="settings-app-section">
                    <div className="settings-app-section-page">
                        <div className="settings-app-section-title">
                            <Typography variant="h2">
                                {(replacementTitle[title]? replacementTitle[title]: title)}
                            </Typography>
                        </div>
                        <div className="settings-app-section-settings">
                            {...children}
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default SettingsSection;