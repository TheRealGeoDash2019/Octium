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
import { internalNamespace, jsNamespace } from "../../consts";
import React from "react";
import "../../style/home.css";
import "../../style/settings.css";
import ServerLogoIcon from "../../components/custom-icons/logo";
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SettingsSections from "../../components/settings/sections";

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

    const getOrigin = () => {
        const internalUrl = new URL("/internal", window.parent.origin).href;
        const pathname = window.location.href.replace(internalUrl, ``);
        const [page, ...subpage] = pathname.split("/").filter(e => e !== "");
        return ({
            page,
            subpage
        })
    }

    const [activeTab, setActiveTab] = React.useState(
        (getOrigin().subpage? getOrigin().subpage[0] : "appearance") || "appearance"
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
    let initialValue = 0;
    let triggerValue = 15;
    let lastTimeoutClick = 0;
    const devModeTrigger = function() {
        clearTimeout(lastTimeoutClick);
        initialValue += 1;
        if (initialValue >= triggerValue) {
            localStorage.setItem("NOT_SO_SECRET_DEVMODE_FEATURE", [jsNamespace,(new Date).getFullYear().toString()].join("|"))
            try {
                window.top[jsNamespace].alert("Developer Mode", "You are now a Developer. Refresh to apply...");
            } catch {
                // Probably not on the Browser?
            }
        }
        // @ts-ignore
        lastTimeoutClick = setTimeout(() => {
            initialValue = 0;
        }, 250)
    }

    const setUrlBar = (pathname = "blank") => {
        // Warning: very buggy?
        try {
            // @ts-ignore
            window.parent.document.querySelector(`.search`).value = `${internalNamespace}://${pathname}`;
        } catch(err) {
            // Probably not updated. Just ignore.
        }
    }

    const getSettingContent = () => {
        switch (activeTab) {
            case "help":
                setUrlBar("settings/help");
                return (<SettingsSections.About></SettingsSections.About>);
            case "appearance":
                setUrlBar("settings/appearance");
                return (<SettingsSections.Appearance></SettingsSections.Appearance>);
            case "cloaking":
                setUrlBar("settings/cloaking");
                return (<SettingsSections.Cloaking></SettingsSections.Cloaking>);
            case "search":
                setUrlBar("settings/search");
                return (<SettingsSections.Search></SettingsSections.Search>);
            case "reset":
                setUrlBar("settings/reset");
                return (<SettingsSections.Reset></SettingsSections.Reset>);
            default:
                return (<></>)
        }
    }

    return (
        <>
            <Head defaultTitle="Settings" />
            <div className="settings" style={{ background: "var(--primary)", height: "100vh" }}>
                <AppBar position="static" color="primary" enableColorOnDark className="settings-navbar" sx={{ background: "var(--background)" }}>
                    <Container maxWidth="xl" className="settings-navbar-container">
                        <Toolbar disableGutters className="settings-navbar-toolbar">
                            <div className="settings-navbar-left">
                                <ServerLogoIcon className="logo settings-navbar-logo" sx={{ width: "32px", height: "32px" }}></ServerLogoIcon>
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
                            <ListItem key="Appearance" disablePadding onClick={() => { setActiveTab("appearance"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "appearance")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <PaletteIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></PaletteIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary="Appearance" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="Cloaking" disablePadding onClick={() => { setActiveTab("cloaking"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "cloaking")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <VisibilityOffIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></VisibilityOffIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary="Cloaking" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="Search Engine" disablePadding onClick={() => { setActiveTab("search"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "search")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <SearchIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></SearchIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary="Search Engine" />
                                </ListItemButton>
                            </ListItem>
                            <hr className="settings-app-drawer-divider"></hr>
                            <ListItem key="Reset settings" disablePadding onClick={() => { setActiveTab("reset"); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "reset")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="settings-app-drawer-tab-icon-container">
                                        <RestoreIcon className="settings-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></RestoreIcon>
                                    </ListItemIcon>
                                    <ListItemText className="settings-app-drawer-tab-label" primary={`Reset settings`} />
                                </ListItemButton>
                            </ListItem>
                            <hr className="settings-app-drawer-divider"></hr>
                            <ListItem key="About" disablePadding onClick={() => { (setActiveTab("help"), devModeTrigger()); }}>
                                <ListItemButton className="settings-app-drawer-tab" {...((activeTab === "help")? { "active": "true" } : {}) }>
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
                        <SettingsSection title={activeTab}>
                            { getSettingContent() }
                        </SettingsSection>
                    </Container>
                    <div className="spacer-from-drawer"></div>
                </div>
            </div>
        </>
    );
}

export default InternalSettings;
