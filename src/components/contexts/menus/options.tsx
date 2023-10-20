import { jsNamespace, internalNamespace, extensionsDisabled } from "../../../consts";
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
            {extensionsDisabled? (<></>) : (<ContextMenuButton displayLabel="Extensions" onClick={() => {openUrl(`${internalNamespace}://extensions`),closeMenuFunction();}} />) }
            {extensionsDisabled? (<></>) : (<ContextMenuSeparator />)}
            <ContextMenuButton displayLabel="Developer tools" onClick={() => {toggleDevtools(),closeMenuFunction();}} />
            <ContextMenuSeparator />
            <ContextMenuButton displayLabel="Settings" onClick={() => {openUrl(`${internalNamespace}://settings`),closeMenuFunction();}} />
        </>
    )
} 

export default Options;