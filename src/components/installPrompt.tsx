import React from "react";
import { jsNamespace } from "../consts";
import "../style/install-prompt.css";
import Button from "@mui/material/Button";

interface BasicExtensionManifest {
    // Recommended
    manifest_version: number;
    name: string;
    version: string;
    default_locale?: string;
    description?: string;
    icons?: object;
    permissions?: string[];
    host_permissions?: string[];
}

function InstallPrompt({ name, manifest, iconUrl, onChange }) {
    const extensionName = name || "Unknown Extension";
    const manifestData = ((typeof manifest === "object")? manifest : JSON.parse(manifest)) as BasicExtensionManifest;

    const permissions = manifestData?.permissions || [];
    const hostPermissions = (manifestData?.host_permissions || []).map(e => e.split("//")[1].split("/")[0]);
    // const icons = Object.entries(manifestData?.icons || {});
    const icon = (iconUrl? iconUrl : "");
    const onChangeEvent = ((onChange && (typeof onChange === "function"))? onChange : () => null);

    const permissionValues = {
        "notifications": "Display Notifcations",
        "tabs": "Create, Modify or Delete Tabs",
        "scripting": "Execute Scripts on Sites",
        "contextMenus": "Add or Remove Items in the Context Menu",
        "alarms": "Create or Modify Alarms",
        "bookmarks": "Read and change your bookmarks",
        "browsingData": "Read or Modify your Browsing Data",
        "downloads": "Create, Modify, or Search your Downloads",
        "gcm": "Send or Receive Google Cloud Messages",
        "history": "Add, Modify or Remove History Items",
        "identity": "Identify the Current User",
        "idle": "Monitor when the machine goes idle",
        "management": "Manage the installed extensions/apps",
        "runtime": "Access various runtime tools",
        "webRequest": "Modify, Intercept or Block Web Requests",
        "serial": "Access your serial devices",
    }

    function hasPermissions() {
        const permissionsStringsAvailable = Object.keys(permissions).filter(e => Object.keys(permissionValues).includes(e));
        return (!!permissionsStringsAvailable.length || !!hostPermissions.length);
    }

    function getAllPermissionStrings() {
        const permissionStrings = permissions.map(e => {
            if (permissionValues[e]) {
                return (
                    <>
                        <li className="permission-item">
                            { permissionValues[e] }
                        </li>
                    </>
                )
            } else {
                return null;
            }
        }).filter(e => (e !== null));
        if (!!hostPermissions.length) {
            const sites = hostPermissions.map((e, i, a) => {
                const maxLength = (a.length - 1);
                if (i === maxLength && maxLength > 0) {
                    return `and ${e}`;
                } else {
                    return e
                }
            }).join(", ");
            const permissionDetail = `Read and change your data on ${sites}`;
            const permissionItem = (
                <>
                    <li className="permission-item">
                        { permissionDetail }
                    </li>
                </>
            );
            return (
                <>
                    { ...[...permissionStrings, permissionItem] }
                </>
            )
        }
        return (
            <>
                { ...permissionStrings }
            </>
        )
    }

    // <div className="app-icon">
    //     <img src={icon} />
    // </div>
    // 

    function emitOnClick(value: boolean) {
        return onChangeEvent.call(onChangeEvent, {
            value
        });
    };

    return (
        <>
            <div className="prompt">
                <div className="prompt-details">
                    <div className="app-icon">
                        <img src={icon} />
                    </div>
                    <div className="app-title">
                        Add "{extensionName}"?
                    </div>
                </div>
                <div className="prompt-permissions">
                    {hasPermissions()? <span className="permission-list-header">It can:</span> : <></>}
                    <ul className="permission-items">
                        { getAllPermissionStrings() }
                    </ul>
                </div>
                <div className="prompt-actions">
                    <Button className="button-action" variant="outlined" onClick={emitOnClick.bind(this, true)}>Add extension</Button>
                    <Button className="button-action" variant="contained" onClick={emitOnClick.bind(this, false)}>Cancel</Button>
                </div>
            </div>
        </>
    )
}

export default InstallPrompt;