import { jsNamespace } from "../../../consts";
import ContextMenuButton from "../contextMenuButton";
import ContextMenuSeparator from "../contextMenuSeparator";

function Options({ hideFn, exposeFn }) {
    const closeMenuFunction = () => {
        if (hideFn) {
            hideFn();
        }
    }

    const openUrl = (_: string) => {
        return (window[jsNamespace].navigate(_), _);
    }

    const toggleDevtools = exposeFn.toggleDevtools;

    return (
        <>
            <ContextMenuButton displayLabel="Extensions" onClick={() => {openUrl("octium://extensions"),closeMenuFunction();}} />
            <ContextMenuSeparator />
            <ContextMenuButton displayLabel="Developer tools" onClick={() => {toggleDevtools(),closeMenuFunction();}} />
            <ContextMenuSeparator />
            <ContextMenuButton displayLabel="Settings" onClick={() => {openUrl("octium://settings"),closeMenuFunction();}} />
        </>
    )
} 

export default Options;