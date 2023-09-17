interface ChromePerformanceReport {
    startE?: number;
    onLoadT?: number;
    pageT?: number;
    tran?: number;
}

export default function csi() {
    return ({
        startE: performance?.timing?.navigationStart || Date.now(),
        onLoadT: performance?.timing?.domContentLoadedEventEnd || Date.now(),
        pageT: ((!!performance?.timing?.navigationStart)? (Date.now() - performance.timing.navigationStart) : 0),
        tran: 16
    }) as ChromePerformanceReport;
}