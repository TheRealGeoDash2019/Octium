import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps } from "react";

interface SettingsSectionProps {
    title?: string;
}

const replacementTitle = {
    "About": `About ${jsNamespace}`
}

class SettingsSection extends React.Component {
    constructor(props: SettingsSectionProps) {
        super(props);
    }

    render() {
        const title = this.props["title"];
        return (
            <>
                <Container className="settings-app-section">
                    <div className="settings-app-section-page">
                        <div className="settings-app-section-title">
                            <Typography variant="h2">
                                {(replacementTitle[title]? replacementTitle[title]: title)}
                            </Typography>
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default SettingsSection;