import { useEffect } from "react";
import { useLocation } from "react-router";
import qs from "query-string";

function ScrollTop({ children }) {

    const location = useLocation();
    const { gu } = qs.parse(location.search);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (gu) {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "URL", data: 'not-home' }, '*'));
        } else {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "URL", data: location.pathname }, '*'));
        }

    }, [location.pathname]);

    return children;
}

export default ScrollTop;
