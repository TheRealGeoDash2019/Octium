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
                <div className="logo homeLogo">
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24"
                    >
                        <title>{jsNamespace}</title>
                        <path
                            fill={theme}
                            d="M17.0291 3.67612C18.5044 4.90312 19.6518 6.21991 20.242 7.62647C20.7993 9.06296 20.7665 10.6192 21.6189 12.6243C22.4713 14.6294 24.2088 17.1133 23.9793 19.0286C23.717 20.9439 21.4877 22.3206 19.1601 23.0987C16.7996 23.8768 14.3736 24.0264 11.9804 23.9965C9.55441 23.9366 7.16119 23.7271 5.0958 22.8293C3.0632 21.9016 1.32566 20.2855 0.538845 18.4002C-0.280752 16.5148 -0.116833 14.36 0.702764 12.6243C1.55514 10.8885 3.09599 9.60165 3.71888 7.47684C4.37456 5.35202 4.11229 2.35933 5.35807 1.01262C6.57108 -0.364014 9.25935 -0.154525 11.4887 0.56372C13.7507 1.25204 15.5539 2.44912 17.0291 3.67612Z"
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
                <Obfuscated>{jsNamespace} {(new Date()).getFullYear().toString()}</Obfuscated>
            </div>
        </>
    );
}

export default InternalHome;
