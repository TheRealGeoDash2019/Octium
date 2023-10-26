import React from "react";
import { jsNamespace } from "../consts";
import "../style/install-prompt.css";
import Button from "@mui/material/Button";

interface ConfirmPromptOptions {
    title: string;
    description?: string;
    onConfirm?: Function;
}

function ConfirmPrompt(options: ConfirmPromptOptions) {
    const promptTitle = options.title || "Confirm";
    // @ts-ignore
    const promptDescription = (options.description || "No Content").replaceAll("\n\r", "<br />").replaceAll("\n", "<br />");
    // const icons = Object.entries(manifestData?.icons || {});
    const onConfirm: Function = options.onConfirm || (() => {});

    // <div className="app-icon">
    //     <img src={icon} />
    // </div>
    // 

    /* <Button className="button-action" variant="outlined" onClick={emitOnClick.bind(this, true)}>Add extension</Button> */

    return (
        <>
            <div className="prompt">
                <div className="prompt-details">
                    <div className="prompt-title">
                        { promptTitle }
                    </div>
                </div>
                <p className="prompt-description">
                    { promptDescription }
                </p>
                <div className="prompt-actions">
                    <Button className="button-action" variant="contained" onClick={onConfirm.bind(this, true)}>OK</Button>
                    <Button className="button-action" variant="outlined" onClick={onConfirm.bind(this, false)}>Cancel</Button>
                </div>
            </div>
        </>
    )
}

export default ConfirmPrompt;