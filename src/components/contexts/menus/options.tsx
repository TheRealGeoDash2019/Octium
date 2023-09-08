import { jsNamespace } from "../../../consts";
import ContextMenuButton from "../contextMenuButton";

function Options({ hideFn }) {
    const closeMenuFunction = () => {
        if (hideFn) {
            hideFn();
        }
    }

    const openUrl = (_: string) => {
        return (window[jsNamespace].navigate(_), _);
    }

    return (
        <>
            <ContextMenuButton displayLabel="Settings" onClick={() => {openUrl("octium://settings"),closeMenuFunction();}} />
        </>
    )
} 

export default Options;