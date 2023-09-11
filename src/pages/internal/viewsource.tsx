import React from "react";
import { BareClient } from "@tomphttp/bare-client";
import { bareServerURL } from "../../consts";
import Head from "../../components/head";
import { useLocalAppearance } from "../../settings";
import Editor from "@monaco-editor/react";

function ViewSource() {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();

    // @ts-ignore
    window.changeTheme = (theme) => {
        setLocalAppearance(theme);
    };

    const bare = React.useMemo(() => new BareClient(bareServerURL), []);
    const [source, setSource] = React.useState("");

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has("url")) {
            (async () => {
                try {
                    const url = urlParams.get("url");

                    if (url) {
                        var site = await bare.fetch(url);

                        var code = await site.text();

                        
                        /*
                        code =
                            "<ol class='lines'>" +
                            code
                                .split("\n")
                                .map(
                                    (item) =>
                                        "<li class='line'>" +
                                        item
                                            .replace(
                                                new RegExp("<", "g"),
                                                "&lt;"
                                            )
                                            .replace(
                                                new RegExp(">", "g"),
                                                "&gt;"
                                            )
                                )
                                .join("") +
                            "</ol>"; */

                        setSource(code);
                    }
                } catch {
                    setSource("Error: Website does not exist");
                }
            })();
        } else {
            setSource("Error: Cannot view source code");
        }
    }, []);

    return (
        <>
            <Head defaultTitle="View Source" />
            <Editor
                value={source}
                options={{
                    wordWrap: "off",
                    roundedSelection: true,
                    minimap: { enabled: false },
                    tabSize: 4,
                    quickSuggestions: false,
                    readOnly: true
                }}
                loading="Downloading..."
                height="100%"
                defaultLanguage="HTML"
                theme="vs-dark"
            />
        </>
    );
}

export default ViewSource;
