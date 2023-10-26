import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ShieldIcon from '@mui/icons-material/Shield';
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PublicIcon from "@mui/icons-material/Public";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CodeIcon from "@mui/icons-material/Code";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { ReactComponent as DockSVG } from "../assets/dock-to-left-filled.svg";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from "@mui/material/Tooltip";
import { BareClient } from "@tomphttp/bare-client";
import clsx from "clsx";
import { bareServerURL, internalNamespace, jsNamespace, exposedInternalUrls, extensionsDisabled } from "../consts";
import { Obfuscated } from "../components/obfuscate";
import InstallPrompt from "../components/installPrompt";
import AlertPrompt from "../components/alertPrompt";
import ConfirmPrompt from "../components/confirmPrompt";
import Head from "../components/head";
import {
    useLocalAppearance,
    useLocalTitle,
    useLocalIcon,
    useLocalCustomStyle,
    useLocalInstalledExtensions,
    useLocalFavorites,
    useLocalBorderRadius,
    useLocalHistory,
    useLocalPanelWidth,
} from "../settings.js";
import Editor from "@monaco-editor/react";
// @ts-ignore
import mime from "mime-types";
import ServerLogoIcon from "../components/custom-icons/logo.js";
import ExtensionIcon from '@mui/icons-material/Extension';
import ContextMenu from "../components/contexts/contextMenu.js";

interface SearchSuggestion {
    internal?: boolean;
    value: string;
}

function Home() {
    const bare = React.useMemo(() => new BareClient(bareServerURL), []);
    const web = React.useRef<HTMLIFrameElement>(null);
    const panel = React.useRef<HTMLDivElement>(null);
    const search = React.useRef<HTMLInputElement>(null);
    const [lastURL, setLastURL] = React.useState("");
    var homeURL = localStorage.getItem("homeURL") || `${internalNamespace}://home`;
    const [loading, setLoading] = React.useState(false);
    const internalURLS = exposedInternalUrls;
    const [canGoBack, setCanGoBack] = React.useState(false);
    
    const [canGoForward, setCanGoForward] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState([] as SearchSuggestion[]);
    const [searchEngine, setSearchEngine] = React.useState(
        localStorage.getItem("engine") || "https://www.google.com/search?q=%s"
    );
    const [useSuggestions, setUseSuggestions] = React.useState(true);
    const [currentURL, setCurrentURL] = React.useState(homeURL);
    const defaultPanelOptions = [
        {
            name: "Bookmarks",
            component: "favorites",
        },
        {
            name: "History",
            component: "history",
        },
        {
            name: "Custom Style",
            component: "customStyle",
        },
        {
            name: "Extensions",
            component: "extensions",
        },
    ];
    const [currentPanelOption, setCurrentPanelOption] = React.useState(0);
    const sidePanelNav = React.useRef<HTMLDivElement>(null);
    const sidePanelBody = React.useRef<HTMLDivElement>(null);
    const [sidePanelBodyData, setSidePanelBodyData] = React.useState({});
    const [history, setHistory] = useLocalHistory();
    const [loaded, setLoaded] = React.useState(true);
    const [checking, setChecking] = React.useState(false);
    const [showContextMenu, setShowContextMenu] = React.useState(false);
    const [activeInstallPrompt, setActiveInstallPrompt] = React.useState(false);
    const [activeAlertPrompt, setActiveAlertPrompt] = React.useState(false);
    const [activeConfirmPrompt, setActiveConfirmPrompt] = React.useState(false);
    const [installPromptDetails, setInstallPromptDetails] = React.useState({
        name: null,
        manifest: null,
        icon: null,
        callback: null
    })
    const [alertPromptDetails, setAlertPromptDetails] = React.useState({
        title: null,
        description: null,
        callback: null
    })
    const [confirmPromptDetails, setConfirmPromptDetails] = React.useState({
        title: null,
        description: null,
        callback: null
    })
    const defaultExtensions = [
        {
            name: "Dark Reader",
            author: "darkreader.org",
            description:
                "Dark mode for every website. Take care of your eyes, use dark theme for night and daily browsing.",
            load: `setTimeout(function() {var darkreader = ${jsNamespace}.web.current.contentWindow.document.createElement("script");darkreader.src = "https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js";${jsNamespace}.web.current.contentWindow.document.head.appendChild(darkreader);darkreader.onload = function() {${jsNamespace}.web.current.contentWindow.DarkReader.enable()}}, 1)`,
            id: "default-dark-mode",
            installed: false as Boolean,
        },
        {
            name: "Youtube Speed Controller",
            author: "ehrenjn",
            description:
                "Adds an extra control to Youtube video playbars that allows you to speed up videos past 2x speed (up to 16x speed).",
            load: `${jsNamespace}.web.current.contentWindow.addEventListener("load", () => {if (${jsNamespace}.url.startsWith("https://www.youtube.com/watch?v=")) {(function(){function setRate(n) {${jsNamespace}.web.current.contentWindow.document.getElementsByClassName("html5-video-container")[0].getElementsByClassName("video-stream html5-main-video")[0].playbackRate = n};function getRate() {return ${jsNamespace}.web.current.contentWindow.document.getElementsByClassName("html5-video-container")[0].getElementsByClassName("video-stream html5-main-video")[0].playbackRate};function hasVideo() {return ${jsNamespace}.web.current.contentWindow.document.getElementsByClassName("ytp-right-controls").length != 0};function injectController() {var i = ${jsNamespace}.web.current.contentWindow.document.createElement('input');i.style = "width: 30%; height: 70%; position: relative; bottom: 37%; background-Color: transparent; color: white; border-Color: transparent;";i.id = 'spdctrl';i.title = 'Playback Rate';i.style.fontSize = '100%';i.type = 'number';i.value = getRate();i.step = 0.1;i.max = 16;i.min = 0;i.onchange = function() {var s = i.value;setRate(s)};${jsNamespace}.web.current.contentWindow.document.getElementsByTagName('video')[0].onratechange = function() {if (${jsNamespace}.web.current.contentWindow.document.activeElement != i) {i.value = getRate()}};toolbar = ${jsNamespace}.web.current.contentWindow.document.getElementsByClassName("ytp-right-controls")[0];toolbar.prepend(i)};window.setInterval(function(){var controller = ${jsNamespace}.web.current.contentWindow.document.getElementById('spdctrl');if (controller === null && hasVideo()){injectController()}}, 300)})()}})`,
            id: "default-yt-speed-controller",
            installed: false as Boolean,
        },
        {
            name: "Google Old Logo",
            author: "Nebelung",
            description: "Revert to the classic Google logo!",
            load: `setInterval(() => {
                if (${jsNamespace}.url.startsWith("https://www.google.com")) {
                    var googleLogo = ${jsNamespace}.web.current.contentWindow.document.querySelector("img.lnXdpd")
                    var googleSearchLogo = ${jsNamespace}.web.current.contentWindow.document.querySelector("img.jfN4p")
                    var googleImagesLogo = ${jsNamespace}.web.current.contentWindow.document.querySelector(".F1hUFe, .jbTlie[aria-label='Go to Google Home']")
                
                    if (googleLogo) {
                        if (googleLogo.src == "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png") {
                            googleLogo.src = "/images/srpr/logo11w.png"
                            googleLogo.srcset = "/images/srpr/logo11w.png 1x"
                        }
                    }
                
                    if (googleSearchLogo) {
                        if (googleSearchLogo.src == "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png") {
                            googleSearchLogo.src = "/images/srpr/logo11w.png"
                        }
                    }
                
                    if (googleImagesLogo) {
                        googleImagesLogo.style.background = "url(/intl/en_ALL/images/srpr/logo11w.png) no-repeat center"
                        googleImagesLogo.style.backgroundSize = "90px 31.7px"
                        googleImagesLogo.style.height = "31.7px"
                        googleImagesLogo.style.width = "90px"
                        googleImagesLogo.querySelector("svg").style.display = "none"
                    }
                }
            }, 100)`,
            id: "default-google-old-logo",
            installed: false as Boolean,
        },
        {
            name: ":3",
            author: "Nebelung",
            description: ":3",
            load: `${jsNamespace}.web.current.contentWindow.setInterval(() => {
                if (${jsNamespace}.web.current.contentWindow.document.body) {
                    var e;
                    var o = ${jsNamespace}.web.current.contentWindow.document.createTreeWalker(${jsNamespace}.web.current.contentWindow.document.body, NodeFilter.SHOW_TEXT)
                    for (; e = o.nextNode(); ) {
                        if (e.parentElement.nodeName !== "STYLE" && e.parentElement.nodeName !== "SCRIPT") {
                            if (e.textContent.trim() && e.textContent !== ":)") {
                                e.textContent = ":3"
                            }
                        }
                    }
                }
            }, 100)`,
            id: "default-:3",
            installed: false as Boolean,
        },
        {
            name: "Youtube Downloader",
            author: "Nebelung",
            description:
                "Download any video on youtube in many formats, all from the side panel.",
            panel: {
                id: "default-youtube-downloader",
                script: `var onYoutube = false;

                ${jsNamespace}.setSidePanelBody('default-youtube-downloader', '<div class="settingsTitle">You are not on a valid youtube video.</div>')

                setInterval(() => {
                    if (${jsNamespace}.web.current.contentWindow.ytInitialPlayerResponse) {
                        if (${jsNamespace}.url.startsWith("https://www.youtube.com/watch?v=")) {
                            if (!onYoutube) {
                                var downloadLinks = ${jsNamespace}.web.current.contentWindow.ytInitialPlayerResponse.streamingData.adaptiveFormats
                                .map(item => {
                                    var mime = item.mimeType.split(";")[0]
                                    var quality = item.qualityLabel ? item.qualityLabel : item.audioQuality.split("AUDIO_QUALITY_")[1].toLowerCase()
                                    var audioDefault = item.audioTrack ? item.audioTrack.audioIsDefault : false
                                    var otherMP4 = mime == "video/mp4" ? item.colorInfo : ""

                                    if (!item.audioTrack && otherMP4) {
                                        return "";
                                    }
                                    
                                    if (item.audioTrack && !audioDefault) {
                                        return "";
                                    }

                                    return "<a class='sidePanelYoutubeDownloaderLink' download='" + ${jsNamespace}.web.current.contentWindow.ytInitialPlayerResponse.videoDetails.title.normalize() + "." + ${jsNamespace}.mime.extension(mime) + "' href='" + new URL(__uv$config.prefix + __uv$config.encodeUrl(item.url), window.location).toString() + "'>" + mime + " - " + quality + "</a>"
                                }).filter(item => item).join("")
                                ${jsNamespace}.setSidePanelBody('default-youtube-downloader', '<div class="sidePanelYoutubeDownloader">' + downloadLinks + '</div>')
                                onYoutube = true
                            }
                        } else {
                            if (onYoutube) {
                                ${jsNamespace}.setSidePanelBody('default-youtube-downloader', '<div class="settingsTitle">You are not on a valid youtube video.</div>')
                                onYoutube = false
                            }
                        }
                    } else {
                        if (onYoutube) {
                            ${jsNamespace}.setSidePanelBody('default-youtube-downloader', '<div class="settingsTitle">You are not on a valid youtube video.</div>')
                            onYoutube = false
                        }
                    }
                }, 100)`,
            },
            id: "default-youtube-downloader",
            installed: false as Boolean,
        },
    ];
    const [localInstalledExtensions, setLocalInstalledExtensions] =
        useLocalInstalledExtensions();
    const [extensions, setExtensions] = React.useState(
        defaultExtensions.map((item) => {
            if (JSON.parse(localInstalledExtensions).includes(item.id)) {
                item.installed = true;
            } else {
                item.installed = false;
            }

            return item;
        })
    );
    const [localFavorites, setLocalFavorites] = useLocalFavorites();
    const [panelOptions, setPanelOptions] = React.useState(
        defaultPanelOptions.concat(
            // @ts-ignore
            extensions.filter((item: any) => item.installed && item.panel)
        )
    );
    const [localPanelWidth, setLocalPanelWidth] = useLocalPanelWidth();
    // @ts-ignore
    globalThis.draggingPanel = false;
    // @ts-ignore
    globalThis.panelLeft = "";
    // @ts-ignore
    globalThis.originalPanelWidth = "";

    React.useEffect(() => {
        globalThis.document.body.style.setProperty(
            "--panel-width",
            localPanelWidth
        );
    }, []);

    React.useEffect(() => {
        setPanelOptions(
            defaultPanelOptions.concat(
                // @ts-ignore
                extensions.filter((item) => item.installed && item.panel)
            )
        );
    }, [extensions]);

    React.useEffect(() => {
        setExtensions(
            defaultExtensions.map((item) => {
                if (JSON.parse(localInstalledExtensions).includes(item.id)) {
                    item.installed = true;
                } else {
                    item.installed = false;
                }

                return item;
            })
        );
    }, [localInstalledExtensions]);

    const ExtensionsComponent = () => {
        const toggleExtension = (id: string) => {
            let tempLocalInstalledExtensions = JSON.parse(
                localInstalledExtensions
            );

            if (tempLocalInstalledExtensions.includes(id)) {
                tempLocalInstalledExtensions =
                    tempLocalInstalledExtensions.filter(
                        (item: string) => item !== id
                    );
            } else {
                tempLocalInstalledExtensions.push(id);
            }

            setLocalInstalledExtensions(
                JSON.stringify(tempLocalInstalledExtensions)
            );
        };

        return (
            <>
                <div className="sidePanelExtensions">
                    {extensions.map((item, index) => (
                        <div key={index} className="sidePanelExtension">
                            <div className="sidePanelExtensionName">
                                <Obfuscated>{item.name}</Obfuscated>
                            </div>
                            <div className="sidePanelExtensionAuthor">
                                <Obfuscated>{item.author}</Obfuscated>
                            </div>
                            <div className="sidePanelExtensionDescription">
                                <Obfuscated>{item.description}</Obfuscated>
                            </div>
                            <button
                                onClick={() => toggleExtension(item.id)}
                                className="sidePanelExtensionInstall"
                            >
                                <Obfuscated>
                                    {!item.installed ? "Install" : "Uninstall"}
                                </Obfuscated>
                            </button>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const toggleFavorite = async () => {
        if (
            JSON.parse(localFavorites).filter(
                (item: any) => item.url == currentURL
            ).length > 0
        ) {
            let tempFavorites = JSON.parse(localFavorites);
            tempFavorites = tempFavorites.filter(
                (item: any) => item.url !== currentURL
            );
            setLocalFavorites(JSON.stringify(tempFavorites));
        } else {
            if (web.current && web.current.contentWindow) {
                if (
                    web.current.contentWindow.location.pathname.startsWith(
                        // @ts-ignore
                        __uv$config.prefix
                    )
                ) {
                    // @ts-ignore
                    var url = __uv$config.decodeUrl(
                        web.current.contentWindow.location.pathname.split(
                            // @ts-ignore
                            __uv$config.prefix
                        )[1]
                    );
                } else if (
                    web.current.contentWindow.location.pathname.startsWith(
                        "/internal/"
                    )
                ) {
                    if (
                        (
                            web.current.contentWindow.location.pathname +
                            web.current.contentWindow.location.search
                        ).startsWith("/internal/viewsource?url=")
                    ) {
                        var url =
                            "view-source:" +
                            (
                                web.current.contentWindow.location.pathname +
                                web.current.contentWindow.location.search
                            ).split("/internal/viewsource?url=")[1];
                    } else {
                        var url =
                            `${internalNamespace}://` +
                            web.current.contentWindow.location.pathname.split(
                                "/internal/"
                            )[1];
                    }
                } else {
                    var url = web.current.contentWindow.location.toString();
                }

                var title = web.current.contentWindow.document.title;
                var favicon = [
                    ...web.current.contentWindow.document.querySelectorAll(
                        "link[rel='icon'], link[rel='shortcut icon']"
                    ),
                ].slice(-1)[0]
                    ? [
                          ...web.current.contentWindow.document.querySelectorAll(
                              "link[rel='icon'], link[rel='shortcut icon']"
                          ),
                          // @ts-ignore
                      ].slice(-1)[0].href
                        ? [
                              ...web.current.contentWindow.document.querySelectorAll(
                                  "link[rel='icon'], link[rel='shortcut icon']"
                              ),
                              // @ts-ignore
                          ].slice(-1)[0].href
                        : ""
                    : "";

                if (
                    url.startsWith(`${internalNamespace}://`) ||
                    url.startsWith("view-source:")
                ) {
                    favicon = "";
                }

                if (url.startsWith(`${internalNamespace}://`)) {
                    title = url.split(`${internalNamespace}://`)[1];
                    title = title.charAt(0).toUpperCase() + title.slice(1);
                }

                if (favicon) {
                    favicon = await createFavicon(favicon);
                }

                let tempFavorites = JSON.parse(localFavorites);

                tempFavorites.unshift({
                    url: url,
                    title: title,
                    favicon: favicon,
                });

                setLocalFavorites(JSON.stringify(tempFavorites));
            }
        }
    };

    const FavoritesComponent = () => {
        const removeFavorite = (e: any, url: string) => {
            e.stopPropagation();

            let tempFavorites = JSON.parse(localFavorites);
            tempFavorites = tempFavorites.filter(
                (item: any) => item.url !== url
            );
            setLocalFavorites(JSON.stringify(tempFavorites));
        };

        return (
            <>
                {JSON.parse(localFavorites).length <= 0 ? (
                    <div className="settingsTitle">
                        Your favorites are empty.
                    </div>
                ) : (
                    ""
                )}
                <div className="historyPanel">
                    {JSON.parse(localFavorites).map(
                        (item: any, index: number) => (
                            <div
                                title={item.url}
                                key={index}
                                className="historyPanelItem"
                                onClick={() => searchURL(item.url)}
                            >
                                {item.favicon ? (
                                    <img
                                        className="historyPanelFavicon"
                                        src={item.favicon}
                                    />
                                ) : (
                                    <div className="historyPanelFaviconGlobe">
                                        <PublicIcon
                                            style={{
                                                height: "18px",
                                                width: "18px",
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="historyPanelTitle">
                                    <Obfuscated>
                                        {item.title || item.url}
                                    </Obfuscated>
                                </div>
                                <div
                                    className="historyPanelRemove"
                                    onClick={(e: any) =>
                                        removeFavorite(e, item.url)
                                    }
                                >
                                    <DeleteIcon fontSize="small" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </>
        );
    };

    const HistoryComponent = () => {
        const removeHistory = (e: any, index: number) => {
            e.stopPropagation();

            let tempHistory = JSON.parse(history);
            tempHistory = tempHistory.filter(
                (item: any, index2: number) => index2 !== index
            );
            setHistory(JSON.stringify(tempHistory));
        };

        const clearHistory = () => {
            setHistory(JSON.stringify([]));
        };

        return (
            <>
                <div
                    className="historyPanelRemoveAll"
                    onClick={() => clearHistory()}
                >
                    <DeleteIcon fontSize="small" />
                    <Obfuscated>Clear History</Obfuscated>
                </div>
                <div className="historyPanel">
                    {JSON.parse(history).map((item: any, index: number) => (
                        <div
                            title={
                                item.url +
                                " - " +
                                // @ts-ignore
                                new Date(item.time).toLocaleTimeString(90, {
                                    hour: "numeric",
                                    minute: "numeric",
                                }) +
                                " " +
                                new Date(item.time).toLocaleDateString()
                            }
                            key={index}
                            className="historyPanelItem"
                            onClick={() => searchURL(item.url)}
                        >
                            {item.favicon ? (
                                <img
                                    className="historyPanelFavicon"
                                    src={item.favicon}
                                />
                            ) : (
                                <div className="historyPanelFaviconGlobe">
                                    <PublicIcon
                                        style={{
                                            height: "18px",
                                            width: "18px",
                                        }}
                                    />
                                </div>
                            )}
                            <div className="historyPanelTitle">
                                <Obfuscated>
                                    {item.title || item.url}
                                </Obfuscated>
                            </div>
                            <div
                                className="historyPanelRemove"
                                onClick={(e: any) => removeHistory(e, index)}
                            >
                                <DeleteIcon fontSize="small" />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    interface ThemeTypes {
        theme: string;
        noPreview?: boolean;
        children?: React.ReactNode;
    }

    function ThemeOption({ theme, noPreview, children }: ThemeTypes) {
        const [localAppearance, setLocalAppearance] = useLocalAppearance();

        var themeStyle = !noPreview
            ? { "--theme": "var(--" + theme + "-theme)" }
            : {};

        return (
            <div
                onClick={() => {
                    setLocalAppearance(theme);
                    if (
                        currentURL.startsWith(`${internalNamespace}://`) ||
                        currentURL.startsWith("view-source:")
                    ) {
                        if (web.current && web.current.contentWindow) {
                            web.current.contentWindow.document.body.setAttribute(
                                "data-appearance",
                                theme
                            );
                            // @ts-ignore
                            web.current.contentWindow.changeTheme(theme);
                        }
                    }
                }}
                // @ts-ignore
                style={themeStyle}
                className={clsx(
                    "sidePanelTheme",
                    theme === localAppearance && "sidePanelThemeActive"
                )}
            >
                {children}
            </div>
        );
    }

    interface BorderRadiusOptionTypes {
        name: string;
        children?: React.ReactNode;
    }

    function BorderRadiusOption({ name, children }: BorderRadiusOptionTypes) {
        const [localBorderRadius, setLocalBorderRadius] =
            useLocalBorderRadius();

        return (
            <div
                onClick={() => {
                    setLocalBorderRadius(name);
                    if (
                        currentURL.startsWith(`${internalNamespace}://`) ||
                        currentURL.startsWith("view-source:")
                    ) {
                        if (web.current && web.current.contentWindow) {
                            web.current.contentWindow.document.body.setAttribute(
                                "data-border-radius",
                                name
                            );
                        }
                    }
                }}
                className={clsx(
                    "settingsOption",
                    name === localBorderRadius && "settingsOptionSelected"
                )}
            >
                {children}
            </div>
        );
    }

    const CustomStyleComponent = () => {
        const [localCustomStyle, setLocalCustomStyle] = useLocalCustomStyle();

        const customStyleChange = (value: string) => {
            setLocalCustomStyle(value);
        };

        return (
            <div className="customStyleMain">
                <Editor
                    onChange={(value?: string) =>
                        customStyleChange(value || "")
                    }
                    value={localCustomStyle}
                    options={{
                        wordWrap: "on",
                        roundedSelection: true,
                        minimap: { enabled: false },
                        tabSize: 8,
                        quickSuggestions: false,
                    }}
                    loading=""
                    height="100%"
                    defaultLanguage="css"
                    theme="vs-dark"
                />
            </div>
        );
    };

    const SidePanelMainComponent = () => {
        // @ts-ignore
        if (panelOptions[currentPanelOption].panel) {
            // @ts-ignore
            if (panelOptions[currentPanelOption].panel.id) {
                if (
                    // @ts-ignore
                    sidePanelBodyData[panelOptions[currentPanelOption].panel.id]
                ) {
                    var content =
                        // @ts-ignore
                        sidePanelBodyData[
                            // @ts-ignore
                            panelOptions[currentPanelOption].panel.id
                        ];
                }
            } else {
                // @ts-ignore
                var content = panelOptions[currentPanelOption].panel.content;
            }
        } else {
            // @ts-ignore
            if (panelOptions[currentPanelOption].id) {
                // @ts-ignore
                if (sidePanelBodyData[panelOptions[currentPanelOption].id]) {
                    var content =
                        // @ts-ignore
                        sidePanelBodyData[panelOptions[currentPanelOption].id];
                }
            } else {
                // @ts-ignore
                var content = panelOptions[currentPanelOption].content;
            }
        }

        return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
    };

    React.useEffect(() => {
        searchURL(homeURL);
    }, []);

    React.useEffect(() => {
        if (!useSuggestions) {
            setSuggestions([]);
        }
    }, [useSuggestions]);

    const reloadPage = () => {
        setLoading(true);

        if (web.current && web.current.contentWindow) {
            web.current.contentWindow.location.reload();
        }
    };

    const historyBack = () => {
        if (canGoBack) {
            setLoading(true);

            if (web.current && web.current.contentWindow) {
                web.current.contentWindow.history.back();
            }
        }
    };

    const historyForward = () => {
        if (canGoForward) {
            setLoading(true);

            if (web.current && web.current.contentWindow) {
                web.current.contentWindow.history.forward();
            }
        }
    };

    const stopLoadingPage = () => {
        setLoading(false);

        if (web.current && web.current.contentWindow) {
            web.current.contentWindow.stop();
        }
    };

    try {
        JSON.parse(history);
    } catch {
        console.error("Error with history: Not valid JSON");
        console.error(history);
        setHistory("[]");
    }

    try {
        JSON.parse(localFavorites);
    } catch {
        console.error("Error with favorites: Not valid JSON");
        console.error(localFavorites);
        setLocalFavorites("[]");
    }

    try {
        JSON.parse(localInstalledExtensions);
    } catch {
        console.error("Error with local install extensions: Not valid JSON");
        console.error(localInstalledExtensions);
        setLocalInstalledExtensions("[]");
    }

    async function createFavicon(url: string) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await bare.fetch(url);
                var blob = await response.blob();
                var reader = new FileReader();

                reader.onloadend = function () {
                    resolve(reader.result);
                };

                reader.readAsDataURL(blob);
            } catch {
                resolve("");
            }
        });
    }

    const webLoad = async () => {
        setLoading(false);

        if (web.current && web.current.contentWindow) {
            if (
                web.current.contentWindow.location.pathname.startsWith(
                    // @ts-ignore
                    __uv$config.prefix
                )
            ) {
                // @ts-ignore
                var url = __uv$config.decodeUrl(
                    web.current.contentWindow.location.pathname.split(
                        // @ts-ignore
                        __uv$config.prefix
                    )[1]
                );
            } else if (
                web.current.contentWindow.location.pathname.startsWith(
                    "/internal/"
                )
            ) {
                if (
                    (
                        web.current.contentWindow.location.pathname +
                        web.current.contentWindow.location.search
                    ).startsWith("/internal/viewsource?url=")
                ) {
                    var url =
                        "view-source:" +
                        (
                            web.current.contentWindow.location.pathname +
                            web.current.contentWindow.location.search
                        ).split("/internal/viewsource?url=")[1];
                } else {
                    var url =
                        `${internalNamespace}://` +
                        web.current.contentWindow.location.pathname.split(
                            "/internal/"
                        )[1];
                }
            } else {
                var url = web.current.contentWindow.location.toString();
            }

            var title = web.current.contentWindow.document.title;
            var favicon = [
                ...web.current.contentWindow.document.querySelectorAll(
                    "link[rel='icon'], link[rel='shortcut icon']"
                ),
            ].slice(-1)[0]
                ? [
                      ...web.current.contentWindow.document.querySelectorAll(
                          "link[rel='icon'], link[rel='shortcut icon']"
                      ),
                      // @ts-ignore
                  ].slice(-1)[0].href
                    ? [
                          ...web.current.contentWindow.document.querySelectorAll(
                              "link[rel='icon'], link[rel='shortcut icon']"
                          ),
                          // @ts-ignore
                      ].slice(-1)[0].href
                    : ""
                : "";

            if (url.startsWith(`${internalNamespace}://`) || url.startsWith("view-source:")) {
                favicon = "";
            }

            if (url.startsWith(`${internalNamespace}://`)) {
                title = url.split(`${internalNamespace}://`)[1];
                title = title.charAt(0).toUpperCase() + title.slice(1);
            }

            if (favicon) {
                favicon = await createFavicon(favicon);
            }

            function addHistory() {
                var tempHistory = JSON.parse(history);

                tempHistory.unshift({
                    url: url,
                    title: title,
                    time: Date.now(),
                    favicon: favicon,
                });

                setHistory(JSON.stringify(tempHistory));

                if (!checking) {
                    setChecking(true);

                    setInterval(async () => {
                        if (web.current && web.current.contentWindow) {
                            if (
                                web.current.contentWindow.location.pathname.startsWith(
                                    // @ts-ignore
                                    __uv$config.prefix
                                )
                            ) {
                                // @ts-ignore
                                var url = __uv$config.decodeUrl(
                                    web.current.contentWindow.location.pathname.split(
                                        // @ts-ignore
                                        __uv$config.prefix
                                    )[1]
                                );
                            } else if (
                                web.current.contentWindow.location.pathname.startsWith(
                                    "/internal/"
                                )
                            ) {
                                if (
                                    (
                                        web.current.contentWindow.location
                                            .pathname +
                                        web.current.contentWindow.location
                                            .search
                                    ).startsWith("/internal/viewsource?url=")
                                ) {
                                    var url =
                                        "view-source:" +
                                        (
                                            web.current.contentWindow.location
                                                .pathname +
                                            web.current.contentWindow.location
                                                .search
                                        ).split("/internal/viewsource?url=")[1];
                                } else {
                                    var url =
                                        `${internalNamespace}://` +
                                        web.current.contentWindow.location.pathname.split(
                                            "/internal/"
                                        )[1];
                                }
                            } else {
                                var url =
                                    web.current.contentWindow.location.toString();
                            }

                            // @ts-ignore
                            let tempHistory = window[jsNamespace].history;

                            let checkURLHistory = tempHistory[0]
                                ? tempHistory[0].url == url
                                : false;

                            if (checkURLHistory) {
                                if (web.current && web.current.contentWindow) {
                                    var realTitle =
                                        web.current.contentWindow.document.head.querySelector(
                                            "title"
                                        )
                                            ? // @ts-ignore
                                              web.current.contentWindow.document.head.querySelector(
                                                  "title"
                                              ).textContent
                                            : "";
                                    var favicon = [
                                        ...web.current.contentWindow.document.querySelectorAll(
                                            "link[rel='icon'], link[rel='shortcut icon']"
                                        ),
                                    ].slice(-1)[0]
                                        ? [
                                              ...web.current.contentWindow.document.querySelectorAll(
                                                  "link[rel='icon'], link[rel='shortcut icon']"
                                              ),
                                              // @ts-ignore
                                          ].slice(-1)[0].href
                                            ? [
                                                  ...web.current.contentWindow.document.querySelectorAll(
                                                      "link[rel='icon'], link[rel='shortcut icon']"
                                                  ),
                                                  // @ts-ignore
                                              ].slice(-1)[0].href
                                            : ""
                                        : "";

                                    if (
                                        url.startsWith(`${internalNamespace}://`) ||
                                        url.startsWith("view-source:")
                                    ) {
                                        favicon = "";
                                    }

                                    if (url.startsWith(`${internalNamespace}://`)) {
                                        realTitle = url.split(`${internalNamespace}://`)[1];
                                        realTitle =
                                            realTitle.charAt(0).toUpperCase() +
                                            realTitle.slice(1);
                                    }

                                    if (realTitle !== tempHistory[0].title) {
                                        tempHistory[0].title = realTitle;
                                        setHistory(JSON.stringify(tempHistory));
                                    }

                                    if (favicon !== tempHistory[0].favicon) {
                                        if (favicon) {
                                            favicon = await createFavicon(
                                                favicon
                                            );
                                        }

                                        tempHistory[0].favicon = favicon;
                                        setHistory(JSON.stringify(tempHistory));
                                    }

                                    if (
                                        // @ts-ignore
                                        window[jsNamespace].favorites.filter(
                                            (item: any) => item.url == url
                                        ).length > 0
                                    ) {
                                        // @ts-ignore
                                        let tempFavorites = window[jsNamespace].favorites;

                                        let currentFavoriteItem =
                                            tempFavorites.filter(
                                                (item: any) => item.url == url
                                            )[0];

                                        if (
                                            realTitle !==
                                            currentFavoriteItem.title
                                        ) {
                                            currentFavoriteItem.title =
                                                realTitle;
                                        }

                                        if (
                                            favicon !==
                                            currentFavoriteItem.favicon
                                        ) {
                                            if (favicon) {
                                                favicon = await createFavicon(
                                                    favicon
                                                );
                                            }

                                            currentFavoriteItem.favicon =
                                                favicon;
                                        }

                                        setLocalFavorites(
                                            JSON.stringify(tempFavorites)
                                        );
                                    }
                                }
                            }
                        }
                    }, 100);
                }

                setLoaded(true);
            }

            var tempHistory = JSON.parse(history);

            //All 1 duplicate on first page load
            if (tempHistory[0]) {
                if (url !== tempHistory[0].url) {
                    addHistory();
                }
            } else {
                addHistory();
            }

            var webChange = function () {
                setLoaded(false);

                setTimeout(function () {
                    if (web.current && web.current.contentWindow) {
                        setCanGoBack(
                            // @ts-ignore
                            web.current.contentWindow.navigation.canGoBack
                        );
                        setCanGoForward(
                            // @ts-ignore
                            web.current.contentWindow.navigation.canGoForward
                        );

                        const webResizeMouseMove = (e: Event) => {
                            // @ts-ignore
                            if (parent.draggingPanel) {
                                var newWidth =
                                    // @ts-ignore
                                    parent.originalPanelWidth +
                                    // @ts-ignore
                                    (parent.panelLeft - e.clientX) +
                                    "px";
                                localStorage.setItem("panelWidth", newWidth);
                                parent.document.body.style.setProperty(
                                    "--panel-width",
                                    newWidth
                                );
                            }
                        };

                        const webResizeMouseUp = () => {
                            parent.document.body.removeAttribute(
                                "data-panel-resizing"
                            );
                            // @ts-ignore
                            parent.draggingPanel = false;
                        };

                        web.current.contentWindow.addEventListener(
                            "mousemove",
                            webResizeMouseMove
                        );
                        web.current.contentWindow.addEventListener(
                            "mouseup",
                            webResizeMouseUp
                        );

                        //Fix youtube.com because history.replaceState() and history.pushState() dont work
                        // @ts-ignore
                        var lastEntryURL =
                            // @ts-ignore
                            web.current.contentWindow.navigation.currentEntry
                                .url;

                        web.current.contentWindow.setInterval(async () => {
                            if (web.current && web.current.contentWindow) {
                                if (
                                    lastEntryURL !==
                                    // @ts-ignore
                                    web.current.contentWindow.navigation
                                        .currentEntry.url
                                ) {
                                    if (
                                        new URL(
                                            // @ts-ignore
                                            web.current.contentWindow.navigation.currentEntry.url
                                        ).pathname.startsWith(
                                            // @ts-ignore
                                            __uv$config.prefix
                                        )
                                    ) {
                                        // @ts-ignore
                                        var url = __uv$config.decodeUrl(
                                            new URL(
                                                // @ts-ignore
                                                web.current.contentWindow.navigation.currentEntry.url
                                            ).pathname.split(
                                                // @ts-ignore
                                                __uv$config.prefix
                                            )[1]
                                        );
                                    } else if (
                                        new URL(
                                            // @ts-ignore
                                            web.current.contentWindow.navigation.currentEntry.url
                                        ).pathname.startsWith("/internal/")
                                    ) {
                                        if (
                                            (
                                                new URL(
                                                    // @ts-ignore
                                                    web.current.contentWindow.navigation.currentEntry.url
                                                ).pathname +
                                                web.current.contentWindow
                                                    .location.search
                                            ).startsWith(
                                                "/internal/viewsource?url="
                                            )
                                        ) {
                                            var url =
                                                "view-source:" +
                                                (
                                                    new URL(
                                                        // @ts-ignore
                                                        web.current.contentWindow.navigation.currentEntry.url
                                                    ).pathname +
                                                    web.current.contentWindow
                                                        .location.search
                                                ).split(
                                                    "/internal/viewsource?url="
                                                )[1];
                                        } else {
                                            var url =
                                                `${internalNamespace}://` +
                                                new URL(
                                                    // @ts-ignore
                                                    web.current.contentWindow.navigation.currentEntry.url
                                                ).pathname.split(
                                                    "/internal/"
                                                )[1];
                                        }
                                    } else {
                                        var url =
                                            web.current.contentWindow.location.toString();
                                    }
                                    if (url !== currentURL) {
                                        if (
                                            search.current &&
                                            search.current.value
                                        ) {
                                            search.current.value = url;
                                            setCurrentURL(url);
                                            setLastURL(url);

                                            var title =
                                                web.current.contentWindow
                                                    .document.title;
                                            var favicon = [
                                                ...web.current.contentWindow.document.querySelectorAll(
                                                    "link[rel='icon'], link[rel='shortcut icon']"
                                                ),
                                            ].slice(-1)[0]
                                                ? [
                                                      ...web.current.contentWindow.document.querySelectorAll(
                                                          "link[rel='icon'], link[rel='shortcut icon']"
                                                      ),
                                                      // @ts-ignore
                                                  ].slice(-1)[0].href
                                                    ? [
                                                          ...web.current.contentWindow.document.querySelectorAll(
                                                              "link[rel='icon'], link[rel='shortcut icon']"
                                                          ),
                                                          // @ts-ignore
                                                      ].slice(-1)[0].href
                                                    : ""
                                                : "";

                                            if (
                                                url.startsWith(`${internalNamespace}://`) ||
                                                url.startsWith("view-source:")
                                            ) {
                                                favicon = "";
                                            }

                                            if (url.startsWith(`${internalNamespace}://`)) {
                                                title =
                                                    url.split(`${internalNamespace}://`)[1];
                                                title =
                                                    title
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    title.slice(1);
                                            }

                                            if (favicon) {
                                                favicon = await createFavicon(
                                                    favicon
                                                );
                                            }

                                            var tempHistory =
                                                JSON.parse(history);

                                            tempHistory.unshift({
                                                url: url,
                                                title: title,
                                                time: Date.now(),
                                                favicon: favicon,
                                            });

                                            setHistory(
                                                JSON.stringify(tempHistory)
                                            );
                                        }
                                    }
                                    lastEntryURL =
                                        // @ts-ignore
                                        web.current.contentWindow.navigation
                                            .currentEntry.url;
                                }
                            }
                        }, 500);

                        setTimeout(() => {
                            if (web.current && web.current.contentWindow) {
                                // @ts-ignore
                                if (!web.current.contentWindow.eruda) {
                                    var erudaScript =
                                        web.current.contentWindow.document.createElement(
                                            "script"
                                        );
                                    erudaScript.src =
                                        "https://cdn.jsdelivr.net/npm/eruda";
                                    web.current.contentWindow.document.head.appendChild(
                                        erudaScript
                                    );
                                    erudaScript.onload = () => {
                                        if (
                                            web.current &&
                                            web.current.contentWindow
                                        ) {
                                            // @ts-ignore
                                            web.current.contentWindow.eruda.init();
                                            // @ts-ignore
                                            web.current.contentWindow.eruda._$el[0].querySelector(
                                                ".eruda-entry-btn"
                                            ).style.display = "none";
                                        }
                                    };
                                }
                                const webstoreRegex = /https\:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore)/gmi;

                                if ("__uv$location" in web.current.contentWindow) {
                                    const createScript = function(options = {}) {
                                        const o = document.createElement("script");
                                        for (const [name, param] of Object.entries(options)) {
                                            o[name] = param;
                                        }
                                        return o;
                                    }
                                    /* web.current.contentWindow.document.head.appendChild(createScript({
                                        src: new URL("/assets/chromeAPIs.js", window.location.origin).href,
                                        onerror: function() {
                                            console.debug("Failed to load Chrome APIs implementation");
                                        },
                                        onload: function() {
                                            console.log("Loading Chrome APIs");
                                        }
                                    }))
                                    const loc = web.current.contentWindow.__uv$location as Location;
                                    if (loc.href && webstoreRegex.test(loc.href)) {
                                        web.current.contentWindow.document.head.appendChild(createScript({
                                            src: new URL("/uv/workers/cws.sw.js", window.location.origin).href,
                                            onload: function() {
                                                console.log(`[CWS for ${jsNamespace}] Ready`)
                                            },
                                            onerror: function() {
                                                console.error(`[CWS for ${jsNamespace}]`, new Error(`Failed to Load Chrome Web Store implementation`))
                                            }
                                        }))
                                    } */
                                }
                            }
                        }, 1);

                        if (
                            web.current.contentWindow.location.pathname.startsWith(
                                // @ts-ignore
                                __uv$config.prefix
                            )
                        ) {
                            // @ts-ignore
                            var url = __uv$config.decodeUrl(
                                web.current.contentWindow.location.pathname.split(
                                    // @ts-ignore
                                    __uv$config.prefix
                                )[1]
                            );

                            for (let extension of extensions) {
                                if (extension.load) {
                                    if (extension.installed) {
                                        eval(extension.load);
                                    }
                                }
                            }
                        } else if (
                            web.current.contentWindow.location.pathname.startsWith(
                                "/internal/"
                            )
                        ) {
                            if (
                                (
                                    web.current.contentWindow.location
                                        .pathname +
                                    web.current.contentWindow.location.search
                                ).startsWith("/internal/viewsource?url=")
                            ) {
                                var url =
                                    "view-source:" +
                                    (
                                        web.current.contentWindow.location
                                            .pathname +
                                        web.current.contentWindow.location
                                            .search
                                    ).split("/internal/viewsource?url=")[1];
                            } else {
                                var url =
                                    `${internalNamespace}://` +
                                    web.current.contentWindow.location.pathname.split(
                                        "/internal/"
                                    )[1];
                            }
                        } else {
                            var url =
                                web.current.contentWindow.location.toString();
                        }

                        if (url !== lastURL) {
                            if (search.current && search.current.value) {
                                search.current.value = url;
                            }
                            setCurrentURL(url);
                            setLastURL(url);
                        }
                    }
                });
            };

            web.current.contentWindow.removeEventListener("unload", webChange);
            web.current.contentWindow.addEventListener("unload", webChange);
            webChange();
        }
    };

    function isURL(url: string) {
        if (!url.includes(".")) {
            return false;
        }

        try {
            var valid = new URL(url);

            return valid.toString();
        } catch {
            try {
                var valid = new URL("https://" + url);

                return valid.toString();
            } catch {
                return false;
            }
        }
    }

    const isInternalURL = (value: string) => {
        const currentHost = new URL(window.location.href);
        if (value.startsWith(currentHost.origin) || (value.startsWith(`${internalNamespace}://`))) {
            if (value.startsWith(currentHost.origin)) {
                try {
                    const path = currentHost.pathname;
                    const endpoint = path.split("/internal/")[1];
                    if (internalURLS.includes(endpoint)) {
                        return true;
                    } else if (internalURLS.find(e => endpoint.startsWith(e + "/"))) {
                        // Cases such as /endpoint/extraContent
                        return true;
                    } else {
                        return false;
                    }
                } catch {
                    return false;
                }
            } else if (value.startsWith(`${internalNamespace}://`)) {
                try {
                    const endpoint = value.split(`${internalNamespace}://`)[1];
                    if (internalURLS.includes(endpoint)) {
                        return true;
                    } else if (internalURLS.find(e => endpoint.startsWith(e + "/"))) {
                        // Cases such as /endpoint/extraContent
                        return true;
                    } else {
                        return false;
                    }
                } catch {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    const searchURL = (value: string) => {
        value = value.trim();

        setLoading(true);

        if (
            isInternalURL(value)
        ) {
            if (search.current && search.current.value) {
                search.current.value = value;
            }
            if (web.current && web.current.contentWindow) {
                // @ts-ignore
                web.current.contentWindow.location = new URL(
                    "/internal/" + value.split(`${internalNamespace}://`)[1],
                    // @ts-ignore
                    window.location
                );
            }
            setCurrentURL(value);
        } else if (
            value.startsWith("view-source:") &&
            value !== "view-source:"
        ) {
            if (search.current && search.current.value) {
                search.current.value = value;
            }
            if (web.current && web.current.contentWindow) {
                // @ts-ignore
                web.current.contentWindow.location = new URL(
                    "/internal/viewsource?url=" +
                        value.split("view-source:")[1],
                    // @ts-ignore
                    window.location
                );
            }
            setCurrentURL(value.split("view-source:")[1]);
        } else {
            var checkURL = isURL(value);

            if (checkURL) {
                if (search.current && search.current.value) {
                    search.current.value = checkURL;
                }
                if (web.current && web.current.contentWindow) {
                    // @ts-ignore
                    web.current.contentWindow.location = new URL(
                        // @ts-ignore
                        __uv$config.prefix + __uv$config.encodeUrl(checkURL),
                        // @ts-ignore
                        window.location
                    );
                }
                setCurrentURL(checkURL);
            } else {
                if (search.current && search.current.value) {
                    search.current.value = new URL(
                        searchEngine
                            .replace("%s", encodeURIComponent(value))
                            .toString()
                    ).toString();
                    // @ts-ignore
                    web.current.contentWindow.location = new URL(
                        __uv$config.prefix +
                            // @ts-ignore
                            __uv$config.encodeUrl(search.current.value),
                        // @ts-ignore
                        window.location
                    );
                    setCurrentURL(
                        new URL(
                            searchEngine
                                .replace("%s", encodeURIComponent(value))
                                .toString()
                        ).toString()
                    );
                }
            }
        }

        if (search.current) {
            search.current.blur();
        }
        if (web.current) {
            web.current.focus();
        }
    };

    const togglePanel = () => {
        if (!document.body.dataset.panel) {
            return (document.body.dataset.panel = "true");
        } else if (document.body.dataset.panel == "true") {
            return (document.body.dataset.panel = "false");
        } else if (document.body.dataset.panel == "false") {
            return (document.body.dataset.panel = "true");
        }
    };

    const toggleDevtools = () => {
        if (web.current && web.current.contentWindow) {
            // @ts-ignore
            if (!web.current.contentWindow.eruda) {
                var erudaScript =
                    web.current.contentWindow.document.createElement("script");
                erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
                web.current.contentWindow.document.body.append(erudaScript);
                erudaScript.onload = () => {
                    if (web.current && web.current.contentWindow) {
                        // @ts-ignore
                        web.current.contentWindow.eruda.init();
                        // @ts-ignore
                        web.current.contentWindow.eruda._$el[0].querySelector(
                            ".eruda-entry-btn"
                        ).style.display = "none";
                    }
                };

                if (
                    getComputedStyle(
                        // @ts-ignore
                        web.current.contentWindow.eruda._$el[0].querySelector(
                            ".eruda-dev-tools"
                        )
                    ).display == "none"
                ) {
                    // @ts-ignore
                    web.current.contentWindow.eruda.show();
                } else {
                    // @ts-ignore
                    web.current.contentWindow.eruda.hide();
                }
            } else {
                if (
                    getComputedStyle(
                        // @ts-ignore
                        web.current.contentWindow.eruda._$el[0].querySelector(
                            // @ts-ignore
                            ".eruda-dev-tools"
                        )
                    ).display == "none"
                ) {
                    // @ts-ignore
                    web.current.contentWindow.eruda.show();
                } else {
                    // @ts-ignore
                    web.current.contentWindow.eruda.hide();
                }
            }
        }
    };

    const toggleSidePanelNav = () => {
        if (sidePanelNav.current && sidePanelNav.current.dataset) {
            if (!sidePanelNav.current.dataset.open) {
                return (sidePanelNav.current.dataset.open = "true");
            } else if (sidePanelNav.current.dataset.open == "true") {
                return (sidePanelNav.current.dataset.open = "false");
            } else if (sidePanelNav.current.dataset.open == "false") {
                return (sidePanelNav.current.dataset.open = "true");
            }
        }
    };

    const searchFocus = (e: any) => {
        if (e.target as HTMLInputElement) {
            (e.target as HTMLInputElement).select();
        }
    };

    const searchType = (e: any) => {
        if (e.key == "Enter" && (e.target as HTMLInputElement).value) {
            return searchURL((e.target as HTMLInputElement).value);
        }
    };

    const getSuggestions = async (query: string, limit = 8) => {
        var site = await bare.fetch(
            "https://www.google.com/complete/search?client=firefox&q=" + query
        );
        var internalSites = exposedInternalUrls.map(e => {
            return (internalNamespace + "://" + e);
        })
        var internalResults = internalSites.filter(e => e.startsWith(query));

        var baseResults: SearchSuggestion[] = [];

        if (internalResults.length > 0 && query.startsWith(internalNamespace)) {
            baseResults = internalResults.map(e => ({
                internal: true,
                value: e
            }));
        }

        var siteResult = await site.json();
        var results: SearchSuggestion[] = (siteResult)[1].map((e: string) => ({
            internal: false,
            value: e
        }));
        baseResults = [...baseResults, ...results];
        baseResults = baseResults.slice(0, limit);
        return baseResults;
    };

    const searchChange = async (e: any) => {
        if (
            (e.target as HTMLInputElement) &&
            (e.target as HTMLInputElement).value &&
            useSuggestions
        ) {
            try {
                var newSuggestions = await getSuggestions(
                    (e.target as HTMLInputElement).value
                );
                setSuggestions(newSuggestions);
            } catch {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const searchBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
        }, 100);
    };

    const sidePanelNavBlur = () => {
        if (sidePanelNav.current) {
            sidePanelNav.current.dataset.open = "false";
        }
    };

    const setSidePanelOption = (index: number) => {
        setCurrentPanelOption(index);
    };

    const setupInstallPrompt = (name: string, manifest: string | object, icon: string | object, callback: Function | undefined, active: boolean) => {
        const handleCallback = function(...data) {
            setActiveInstallPrompt(false);
            setInstallPromptDetails({ name: null, manifest: null, icon: null, callback: null });
            if (callback && (typeof callback === "function")) {
                return callback.call(callback, ...data);
            }
        }
        setInstallPromptDetails({ name, manifest, icon, callback: handleCallback });
        setActiveInstallPrompt(active);
        return { active };
    }

    const customAlert = (title: string, description: string) => {
        return new Promise((res, rej) => {
            const callbackPatch = (value) => {
                return (setActiveAlertPrompt(false), res(value));
            }
            setAlertPromptDetails({ title, description, callback: callbackPatch });
            setActiveAlertPrompt(true);
        });
    }

    const customConfirm = (title: string, description: string) => {
        return new Promise((res, rej) => {
            const callbackPatch = (value) => {
                return (setActiveConfirmPrompt(false), res(value));
            }
            setConfirmPromptDetails({ title, description, callback: callbackPatch });
            setActiveConfirmPrompt(true);
        });
    }

    React.useEffect(() => {
        // @ts-ignore
        if (panelOptions[currentPanelOption].panel) {
            if (
                // @ts-ignore
                panelOptions[currentPanelOption].panel.script &&
                sidePanelBody.current
            ) {
                setTimeout(() => {
                    try {
                        // @ts-ignore
                        eval(panelOptions[currentPanelOption].panel.script);
                    } catch (e) {
                        console.error("Error is side panel script");
                        console.error(e);
                    }
                });
            }
        } else {
            if (
                // @ts-ignore
                panelOptions[currentPanelOption].script &&
                sidePanelBody.current
            ) {
                setTimeout(() => {
                    try {
                        // @ts-ignore
                        eval(panelOptions[currentPanelOption].script);
                    } catch (e) {
                        console.error("Error is side panel script");
                        console.error(e);
                    }
                });
            }
        }
    }, [currentPanelOption]);

    // @ts-ignore
    if (!window[jsNamespace]) {
        // @ts-ignore
        window[jsNamespace] = {
            url: currentURL,
            navigate: searchURL,
            reload: reloadPage,
            history: JSON.parse(history),
            favorites: JSON.parse(localFavorites),
            back: historyBack,
            forward: historyForward,
            togglePanel: togglePanel,
            extensions: extensions,
            web: web,
            homeURL: homeURL,
            loading: loading,
            canGoBack: canGoBack,
            canGoForward: canGoForward,
            useSuggestions: useSuggestions,
            searchEngine: searchEngine,
            alert: customAlert,
            confirm: customConfirm,
            getSuggestions: getSuggestions,
            sidePanelBodyData: sidePanelBodyData,
            mime: mime,
            setSidePanelBody: (id: any, value: string) => {
                if (id && value) {
                    setSidePanelBodyData((sidePanelBodyData) => ({
                        ...sidePanelBodyData,
                        [id]: value,
                    }));
                }
            },
            setupInstallPrompt: setupInstallPrompt
        };
    }

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].sidePanelBodyData = sidePanelBodyData;
    }, [sidePanelBodyData]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].history = JSON.parse(history);
    }, [history]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].favorites = JSON.parse(localFavorites);
    }, [localFavorites]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].extensions = extensions;
    }, [extensions]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].web = web;
    }, [web]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].homeURL = homeURL;
    }, [homeURL]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].loading = loading;
    }, [loading]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].canGoBack = canGoBack;
    }, [canGoBack]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].canGoForward = canGoForward;
    }, [canGoForward]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].useSuggestions = useSuggestions;
    }, [useSuggestions]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].url = currentURL;
    }, [currentURL]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].searchEngine = searchEngine;
        // @ts-ignore
        window[jsNamespace].navigate = searchURL;
    }, [searchEngine]);

    React.useEffect(() => {
        // @ts-ignore
        window[jsNamespace].isInternalURL = isInternalURL;
    }, [isInternalURL])

    React.useEffect(() => {
        window[jsNamespace].alert = customAlert;
    }, [customAlert])

    React.useEffect(() => {
        window[jsNamespace].confirm = customConfirm;
    }, [customConfirm])

    React.useEffect(() => {
        window[jsNamespace].setupInstallPrompt = setupInstallPrompt;
    }, [setupInstallPrompt])

    const resizePanelMouseDown = (e: any) => {
        // @ts-ignore
        window.draggingPanel = true;
        // @ts-ignore
        window.panelLeft = e.clientX;
        // @ts-ignore
        window.originalPanelWidth = parseFloat(
            // @ts-ignore
            getComputedStyle(panel.current).width
        );
        window.document.body.setAttribute("data-panel-resizing", "true");
    };

    const resizeMouseMove = (e: PointerEvent) => {
        // @ts-ignore
        if (window.draggingPanel) {
            // @ts-ignore
            var newWidth =
                // @ts-ignore
                window.originalPanelWidth +
                // @ts-ignore
                (window.panelLeft - e.clientX) +
                "px";
            localStorage.setItem("panelWidth", newWidth);
            window.document.body.style.setProperty("--panel-width", newWidth);
        }
    };

    const resizeMouseUp = () => {
        window.document.body.removeAttribute("data-panel-resizing");
        // @ts-ignore
        window.draggingPanel = false;
    };

    // @ts-ignore
    window.addEventListener("mousemove", resizeMouseMove);
    window.addEventListener("mouseup", resizeMouseUp);

    return (
        <>
            <Head />
            <div className="nav">
                <div className="controls">
                    <div
                        className="controlsButton"
                        onClick={historyBack}
                        data-disabled={canGoBack ? "false" : "true"}
                    >
                        <ArrowBackIcon
                            fontSize="small"
                            style={{ height: "0.95em", width: "0.95em" }}
                        />
                    </div>
                    <div
                        className="controlsButton"
                        onClick={historyForward}
                        data-disabled={canGoForward ? "false" : "true"}
                    >
                        <ArrowForwardIcon
                            fontSize="small"
                            style={{ height: "0.95em", width: "0.95em" }}
                        />
                    </div>
                    {!loading ? (
                        <div className="controlsButton" onClick={reloadPage}>
                            <RefreshIcon
                                fontSize="small"
                                style={{ height: "0.95em", width: "0.95em" }}
                            />
                        </div>
                    ) : (
                        <div
                            className="controlsButton"
                            onClick={stopLoadingPage}
                        >
                            <CloseIcon
                                fontSize="small"
                                style={{ height: "0.95em", width: "0.95em" }}
                            />
                        </div>
                    )}
                    <div
                        className="controlsButton"
                        onClick={() => searchURL(homeURL)}
                    >
                        <HomeIcon
                            fontSize="small"
                            style={{ height: "0.95em", width: "0.95em" }}
                        />
                    </div>
                </div>
                <div
                    className="omnibox"
                    data-suggestions={suggestions.length > 0 ? "true" : "false"}
                >
                    <input
                        aria-label="Search"
                        ref={search}
                        defaultValue={homeURL}
                        onFocus={(e: any) => searchFocus(e)}
                        onBlur={searchBlur}
                        autoComplete="off"
                        className="search"
                        onKeyUp={(e: any) => searchType(e)}
                        onChange={searchChange}
                    />
                    <div className="suggestions">
                        {suggestions.map((suggestion: SearchSuggestion, index) => (
                            <div
                                className="suggestion"
                                onClick={() => {
                                    searchURL(suggestion.value);
                                    setSuggestions([]);
                                }}
                                key={index}
                            >
                                <div className="suggestionIcon">
                                    <SearchIcon
                                        style={{
                                            height: "0.7em",
                                            width: "0.7em",
                                        }}
                                    />
                                </div>
                                <Obfuscated>{suggestion.value}</Obfuscated>
                            </div>
                        ))}
                    </div>
                    {isInternalURL(currentURL)? 
                        (<Tooltip title={`You're viewing a Secure ${jsNamespace} page`}>
                            <div className="searchIcon">
                                <ServerLogoIcon style={{ height: "70%", width: "70%" }} />
                            </div>
                        </Tooltip>) :
                        (<Tooltip title="Search the Web">
                            <div className="searchIcon">
                                <SearchIcon style={{ height: "70%", width: "70%" }} />
                            </div>
                        </Tooltip>)
                    }
                    <div className="shareIcon" onClick={() => null}>
                        <Tooltip title="Share QR to Page">
                            <QrCodeScannerIcon
                                fontSize="small"
                                style={{ height: "0.95em", width: "0.95em" }}
                            />
                        </Tooltip>
                    </div>
                    <div className="favoriteIcon" onClick={toggleFavorite}>
                        {JSON.parse(localFavorites).filter(
                            (item: any) => item.url == currentURL
                        ).length > 0 ? (
                            <Tooltip title="Remove from Favorites">
                                <StarIcon
                                    fontSize="small"
                                    style={{ height: "0.95em", width: "0.95em" }}
                                />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Add to Favorites">
                                <StarBorderIcon
                                    fontSize="small"
                                    style={{ height: "0.95em", width: "0.95em" }}
                                />
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="controls">
                    <div 
                        className={"controlsButton" + `${extensionsDisabled? " hidden" : ""}`}
                        onClick={() => searchURL("octium://extensions")}
                    >
                        <ExtensionIcon
                            style={{ height: "0.95em", width: "0.95em", fontSize: "1.25rem" }}
                        />
                    </div>
                    <div
                        className="controlsButton"
                        onClick={() => togglePanel()}
                    >
                        <DockSVG
                            style={{ height: "0.95em", width: "0.95em", fontSize: "1.25rem" }}
                        />
                    </div>
                    <div
                        className="controlsButton"
                        onClick={() => setShowContextMenu(!showContextMenu)}
                    >
                        <MoreVertIcon style={{ height: "0.95em", width: "0.95em", fontSize: "1.25rem" }}></MoreVertIcon>
                    </div>
                </div>
            </div>
            <iframe
                ref={web}
                onLoad={webLoad}
                className="web"
                title="Web"
            ></iframe>
            <div className="panel" ref={panel}>
                <div
                    onMouseDown={(e: any) => resizePanelMouseDown(e)}
                    className="resizePanel"
                >
                    <DragHandleIcon fontSize="small" />
                </div>

                <div className="sidePanel">
                    <div className="sidePanelNav" ref={sidePanelNav}>
                        <div
                            className="sidePanelItem"
                            tabIndex={0}
                            onClick={toggleSidePanelNav}
                            onBlur={sidePanelNavBlur}
                        >
                            <div className="sidePanelItemTitle">
                                <Obfuscated>
                                    {panelOptions[currentPanelOption].name}
                                </Obfuscated>
                            </div>
                            <div className="sidePanelItemIcon">
                                <ArrowDropDownIcon fontSize="small" />
                            </div>
                            <div className="sidePanelItems">
                                {panelOptions.map((option, index) => (
                                    <div
                                        className="sidePanelItemsOption"
                                        onClick={() =>
                                            setSidePanelOption(index)
                                        }
                                        key={index}
                                    >
                                        <Obfuscated>{option.name}</Obfuscated>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sidePanelClose" onClick={togglePanel}>
                            <CloseIcon
                                fontSize="small"
                                style={{ height: "0.95em", width: "0.95em" }}
                            />
                        </div>
                    </div>
                    <div ref={sidePanelBody} className="sidePanelBody">
                        <div>
                            {{
                                history: <HistoryComponent />,
                                customStyle: <CustomStyleComponent />,
                                favorites: <FavoritesComponent />,
                                extensions: <ExtensionsComponent />,
                            }[panelOptions[currentPanelOption].component] || (
                                <SidePanelMainComponent />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            { /* @ts-ignore */ }
            {showContextMenu? (<ContextMenu exposeFn={{toggleDevtools}} hideFn={setShowContextMenu} position={{ right: "0px", top: "2.5rem" }} menuType="Options"></ContextMenu>) : ""}
            {activeInstallPrompt? (<InstallPrompt name={installPromptDetails.name} manifest={installPromptDetails.manifest} iconUrl={installPromptDetails?.icon} onChange={installPromptDetails?.callback || (() => null)}></InstallPrompt>) : (<></>)}
            {activeAlertPrompt? (<AlertPrompt title={alertPromptDetails.title} description={alertPromptDetails.description} onConfirm={alertPromptDetails?.callback || (() => null)}></AlertPrompt>) : (<></>)}
            {activeConfirmPrompt? (<ConfirmPrompt title={confirmPromptDetails.title} description={confirmPromptDetails.description} onConfirm={confirmPromptDetails?.callback || (() => null)}></ConfirmPrompt>) : (<></>)}
        </>
    );
}

export default Home;
