import Head from "../../components/head";
import React from "react";
import { useLocalAppearance } from "../../settings";

import { internalNamespace, jsNamespace, exposedInternalUrls } from "../../consts";
import "../../style/internal-urls.css";

function InternalURLS() {
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

    return (
        <>
            <Head defaultTitle={`${jsNamespace} URLs`} />
            <h2>List of {jsNamespace} URLs</h2>
            <ul>
                {...exposedInternalUrls.map(e => {
                    return (<li>
                        <a href="#" title={`${internalNamespace}://${e}`} onClick={() => { window.parent.Octium.navigate(`${internalNamespace}://${e}`) }}>{`${internalNamespace}://${e}`}</a>
                    </li>)
                })}
            </ul>
        </>
    );
}

export default InternalURLS;
