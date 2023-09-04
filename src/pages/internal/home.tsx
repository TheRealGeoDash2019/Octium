import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import Tooltip from '@mui/material/Tooltip';
import Head from "../../components/head";
import "../../style/home.css";
import { Obfuscated } from "../../components/obfuscate";
import { useLocalAppearance } from "../../settings";
import { jsNamespace } from "../../consts";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

function InternalHome() {
    const mainSearch = React.useRef<HTMLInputElement>(null);
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
    window.changeTheme = (theme) => {
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

    React.useEffect(() => {
        mainSearch?.current?.focus();
    }, []);

    const {
        interimTranscript,
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    const searchType = (e: any) => {
        if (e.key == "Enter" && e.target.value) {
            // @ts-ignore
            return window.parent[jsNamespace].navigate(e.target.value);
        }
    };
    let isListening = false;
    const startListening = async function() {
        if (isListening === true) {
            isListening = false;
            return (SpeechRecognition.stopListening, SpeechRecognition.abortListening());
        } else {
            isListening = true;
            SpeechRecognition.startListening().then(() => {
                const waitForStop = function() {
                    setTimeout(() => {
                        if (!listening) {
                            mainSearch.current.value = transcript.toString();
                        } else {
                            waitForStop();
                        }
                    }, 2000);
                };
                waitForStop();
            })
        }
    }

    return (
        <>
            <Head defaultTitle="Home" />
            <div className="home">
                <div className="logo">
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
                <div className="homeOmnibox">
                    <input
                        ref={mainSearch}
                        className="mainSearch"
                        onKeyUp={searchType}
                        readOnly={false}
                    />
                    <div className="homeSearchIcon">
                        <SearchIcon style={{ height: "70%", width: "70%" }} />
                    </div>
                    {(isMicrophoneAvailable? (
                        (browserSupportsSpeechRecognition)? (
                            <Tooltip title={(listening? "Listening..." : "Search by voice")}>
                                <div onClick={startListening} className={`homeSpeechInputIcon${(listening? " listening" : "")}`}>
                                    <KeyboardVoiceIcon style={{ height: "70%", width: "70%" }} />
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Search by voice is Unsupported">
                                <div className="homeSpeechInputIcon unavailable">
                                    <KeyboardVoiceIcon style={{ height: "70%", width: "70%" }} />
                                </div>
                            </Tooltip>
                        )
                    ) : (<Tooltip title="Your microphone is unavailable">
                        <div className="homeSpeechInputIcon unavailable">
                            <MicOffIcon style={{ height: "70%", width: "70%" }} />
                        </div>
                    </Tooltip>))}
                </div>
            </div>
            <div className="footer">
                <Obfuscated>{jsNamespace} {(new Date()).getFullYear()}</Obfuscated>
            </div>
        </>
    );
}

export default InternalHome;
