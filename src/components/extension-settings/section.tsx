import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, ComponentProps, Children } from "react";

interface SettingsSectionProps {
    title?: string;
    children?: any[];
}

class ExtensionSettingsSection extends React.Component {
    constructor(props: SettingsSectionProps) {
        super(props);
    }

    render() {
        const title = this.props["title"];
        const children = Children.toArray(this.props["children"]) || [];
        return (
            <>
                <Container className="extensions-app-section">
                    <div className="extensions-app-section-page">
                        <div className="extensions-app-section-settings">
                            {...children}
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default ExtensionSettingsSection;