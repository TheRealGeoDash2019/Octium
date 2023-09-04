import Head from "../../components/head";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from "@mui/icons-material/Search";
import { useLocalAppearance } from "../../settings";
import { Obfuscated } from "../../components/obfuscate";
import SettingsSection from "../../components/settings/section";
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PaletteIcon from '@mui/icons-material/Palette';
import { jsNamespace } from "../../consts";
import React from "react";
import "../../style/home.css";
import "../../style/settings.css";
import ServerLogoIcon from "../../components/custom-icons/logo";

function InternalSettings() {
    const settingsSearch = React.useRef<HTMLInputElement>(null);
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
    const [theme, setTheme] = React.useState(
        !getComputedStyle(window.document.body)
            .getPropertyValue("--primary")
            .startsWith("linear-gradient(")
            ? "var(--primary)"
            : getComputedStyle(window.document.body)
                  .getPropertyValue("--primary")
                  .split("linear-gradient(")[1]
                  .split(",")[1]
                  .trim()
    );

    const [activeTab, setActiveTab] = React.useState(
        "Appearance"
    );
    // @ts-ignore
    globalThis.changeTheme = (theme: string) => {
        setLocalAppearance(theme);
    };

    React.useEffect(() => {
        setTheme(
            !getComputedStyle(window.document.body)
                .getPropertyValue("--primary")
                .startsWith("linear-gradient(")
                ? "var(--primary)"
                : getComputedStyle(window.document.body)
                      .getPropertyValue("--primary")
                      .split("linear-gradient(")[1]
                      .split(",")[1]
                      .trim()
        );
    }, [localAppearance]);

    const searchType = (e: any) => {
        // @ts-ignore
        const easyAccess = ["Appearance", "About"]
        if (easyAccess.includes(e.target.value)) {
            setActiveTab(e.target.value);
        }
        // if (e.key == "Enter" && e.target.value) {
            // @ts-ignore
        //    return console.log(e.target.value);
        //    return window.parent[jsNamespace].navigate(e.target.value);
        // }
    };

    return (
        <>
            <Head defaultTitle="Settings" />
            <div className="settings" style={{background: "var(--primary)", height: "100vh"}}>
                <AppBar position="static" color="primary" enableColorOnDark className="settings-navbar" sx={{background: "var(--background)"}}>
                    <Container maxWidth="xl" className="settings-navbar-container">
                        <Toolbar disableGutters className="settings-navbar-toolbar">
                            <div className="settings-navbar-left">
                                <div className="logo settings-navbar-logo" style={{width: "32px", height: "32px"}}>
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 24 24"
                                    >
                                        <title>{jsNamespace}</title>
                                        <path
                                            fill={theme}
                                            d="M 0 13.023 L 4.429 18.595 L 20.714 18.261 L 24 12.309 L 20.998 3.971 L 13.88 8.904 L 7.919 7.125 L 0 13.023 Z"
                                        ></path>
                                    </svg>
                                </div>
                                <Typography className="settings-navbar-title">
                                    {jsNamespace}
                                </Typography>
                            </div>
                            <div className="settings-navbar-right"></div>
                        </Toolbar>
                    </Container>
                </AppBar>
                <div className="settings-app">
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        className="settings-app-drawer"
                    >
                        <List className="settings-app-drawer-list">
                            <ListItem key="Appearance" disablePadding onClick={() => { setActiveTab("Appearance"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "Appearance")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <PaletteIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></PaletteIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary="Appearance" />
                                </ListItemButton>
                            </ListItem>
                            <hr className="settings-app-drawer-divider"></hr>
                            <ListItem key="About" disablePadding onClick={() => { setActiveTab("About"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "About")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <ServerLogoIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></ServerLogoIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary={`About ${jsNamespace}`} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Container maxWidth="xl" className="settings-app-container">
                        { /* @ts-ignore */ }
                        <SettingsSection title={activeTab}></SettingsSection>
                    </Container>
                    <div className="spacer-from-drawer"></div>
                </div>
            </div>
        </>
    );
}

export default InternalSettings;
