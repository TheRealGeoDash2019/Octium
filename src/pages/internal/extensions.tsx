import Head from "../../components/head";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from "@mui/icons-material/Search";
import { useLocalAppearance, useLocalExtensionAllowDev } from "../../settings";
import ExtensionSettingsSection from "../../components/extension-settings/section";
import Drawer from '@mui/material/Drawer';
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
import "../../style/extensions.css";
import ServerLogoIcon from "../../components/custom-icons/logo";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import ExtensionSettingsSections from "../../components/extension-settings/sections";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import localForage from "localforage"; 

const ThemedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: "var(--primary)",
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: "var(--primary)",
    },
  }));

function Extensions() {
    const settingsSearch = React.useRef<HTMLInputElement>(null);
    const [localAppearance, setLocalAppearance] = useLocalAppearance();
    const [localExtensionAllowDev, setLocalExtensionAllowDev] = useLocalExtensionAllowDev();
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
        (getOrigin().subpage? getOrigin().subpage[0] : "") || "my-extensions"
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
        // if (e.key == "Enter" && e.target.value) {
            // @ts-ignore
        //    return console.log(e.target.value);
        //    return window.parent[jsNamespace].navigate(e.target.value);
        // }
    };

    const setUrlBar = (pathname = "extensions") => {
        // Warning: very buggy?
        try {
            // @ts-ignore
            window.parent.document.querySelector(`.search`).value = `${internalNamespace}://${pathname}`;
        } catch(err) {
            // Probably not updated. Just ignore.
        }
    }

    const setUrl = (url = "") => {
        // Warning: may be buggy?
        try {
            // @ts-ignore
            window.parent[jsNamespace].navigate(url);
        } catch(err) {
            // Just to shut up compiler
        }
    }

    const getExtensionSettingContent = () => {
        switch (activeTab) {
            case "my-extensions":
                setUrlBar("extensions");
                return (<ExtensionSettingsSections.MyExtensions></ExtensionSettingsSections.MyExtensions>);
            case "shortcuts":
                setUrlBar("extensions/shortcuts");
                return (<ExtensionSettingsSections.MyExtensions></ExtensionSettingsSections.MyExtensions>);
            default:
                return (<></>)
        }
    }

    return (
        <>
            <Head defaultTitle="Extensions" />
            <div className="extensions" style={{ background: "var(--primary)", height: "100vh" }}>
                <AppBar position="static" color="primary" enableColorOnDark className="extensions-navbar" sx={{ background: "var(--background)" }}>
                    <Container maxWidth="xl" className="extensions-navbar-container">
                        <Toolbar disableGutters className="extensions-navbar-toolbar">
                            <div className="extensions-navbar-left">
                                <ServerLogoIcon className="logo extensions-navbar-logo" sx={{ width: "32px", height: "32px" }}></ServerLogoIcon>
                                <Typography className="extensions-navbar-title">
                                    Extensions
                                </Typography>
                            </div>
                            <div className="extensions-navbar-right">
                                <span className="extensions-devmode-label">Developer mode</span>
                                <ThemedSwitch checked={JSON.parse(localExtensionAllowDev)} onClick={() => { setLocalExtensionAllowDev(!JSON.parse(localExtensionAllowDev)) }}></ThemedSwitch>
                            </div>
                        </Toolbar>
                    </Container>
                </AppBar>
                <div className="extensions-app">
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        className="extensions-app-drawer"
                    >
                        <List className="extensions-app-drawer-list">
                            <ListItem key="My extensions" disablePadding onClick={() => { setActiveTab("my-extensions"); }}>
                                <ListItemButton className="extensions-app-drawer-tab" {...((activeTab === "my-extensions")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="extensions-app-drawer-tab-icon-container">
                                        <ExtensionOutlinedIcon className="extensions-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></ExtensionOutlinedIcon>
                                    </ListItemIcon>
                                    <ListItemText className="extensions-app-drawer-tab-label" primary="My extensions" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="Keyboard shortcuts" disablePadding onClick={() => { setActiveTab("shortcuts"); }}>
                                <ListItemButton className="extensions-app-drawer-tab" {...((activeTab === "shortcuts")? { "active": "true" } : {}) }>
                                    <ListItemIcon className="extensions-app-drawer-tab-icon-container">
                                        <KeyboardOutlinedIcon className="extensions-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></KeyboardOutlinedIcon>
                                    </ListItemIcon>
                                    <ListItemText className="extensions-app-drawer-tab-label" primary="Keyboard shortcuts" />
                                </ListItemButton>
                            </ListItem>
                            <hr className="extensions-app-drawer-divider"></hr>
                            <ListItem key="Discover more extensions and themes on the Chrome Web Store" disablePadding onClick={() => { setUrl(`https://chrome.google.com/webstore/category/extensions?utm_source=ext_sidebar&hl=${navigator.language}`) }}>
                                <ListItemButton className="extensions-app-drawer-tab extended">
                                    <ListItemIcon className="extensions-app-drawer-tab-icon-container">
                                        <ServerLogoIcon className="extensions-app-drawer-tab-icon" sx={{ width: "20px", height: "20px" }}></ServerLogoIcon>
                                    </ListItemIcon>
                                    <ListItemText className="extensions-app-drawer-tab-label" primary="Discover more extensions and themes on the Chrome Web Store" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Container maxWidth="xl" className="extensions-app-container">
                        { /* @ts-ignore */ }
                        <ExtensionSettingsSection title={activeTab}>
                            { getExtensionSettingContent() }
                        </ExtensionSettingsSection>
                    </Container>
                    <div className="spacer-from-drawer"></div>
                </div>
            </div>
        </>
    );
}

export default Extensions;
