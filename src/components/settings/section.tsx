import { jsNamespace, internalNamespace, exposedInternalUrls } from "../../consts";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect } from "react";

interface SectionTitle {
    title?: string;
}

const replacementTitle = {
    "About": `About ${jsNamespace}`
}

class SettingsSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Container className="settings-app-section">
                    <div className="settings-app-section-page">
                        <div className="settings-app-section-title">
                            <Typography variant="h2">
                                {(replacementTitle[this.props.title]? replacementTitle[this.props.title]: this.props.title)}
                            </Typography>
                        </div>
                    </div>
                </Container>
            </>
        )
    }
}

export default SettingsSection;