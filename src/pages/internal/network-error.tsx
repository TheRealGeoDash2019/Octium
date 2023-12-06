import Head from "../../components/head";
import { useLocalAppearance } from "../../settings";
import { internalNamespace, networkErrors } from "../../consts";
import "../../style/network-error.css";
import "../../style/home.css";

function NetworkError() {
    const [localAppearance, setLocalAppearance] = useLocalAppearance();

    const [pagename, errorType] = location.pathname.split("/").slice(2);
    const { searchParams } = new URL(location.href);

    const errorCode = (errorType? networkErrors[errorType] : networkErrors["-300"]);
    const standardErrorUrl = `${internalNamespace}://${pagename}` + (errorType? `/${errorType}` : ``);
    const actualErrorUrl = searchParams.get("u") || standardErrorUrl;

    // @ts-ignore
    globalThis.changeTheme = (theme: string) => {
        setLocalAppearance(theme);
    };
    return (
        <>
            <Head defaultTitle="Network Error" />
            <div className="interstitial-wrapper">
                <div className="error-main-content">
                    <div className="icon icon-network-error"></div>
                    <div className="error-main-message">
                        <h1><span>This site can't be reached</span></h1>
                        <p>The webpage at <strong className="error-page-url">{actualErrorUrl}</strong> might be temporarily down or it may have moved permanently to a new web address.</p>
                        <div className="error-info"><div className="error-code">{errorCode}</div></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NetworkError;
