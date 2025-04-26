
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]'
);
export function register(config) {
    if ('serviceWorker' in navigator) {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        if (isLocalhost) {
            // Check service worker validity on localhost
            fetch(swUrl).then(response => {
                if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
                    navigator.serviceWorker.ready.then(reg => reg.unregister());
                } else {
                    registerValidSW(swUrl, config);
                }
            });
        } else {
            registerValidSW(swUrl, config);
        }
    }
}
function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => { /* handle updates... */ })
        .catch(console.error);
}
export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(r => r.unregister());
    }
}
