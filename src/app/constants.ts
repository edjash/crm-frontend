export const APP_URL = import.meta.env.VITE_APP_URL;

let srv_url = import.meta.env.VITE_SERVER_URL;
//This is used when testing the app on a mobile device on the local network,
//as there no way to use host records on the mobile device.
if (document.location.hostname.match(/^192\.168\./)) {
    const api_url = new URL(srv_url);
    const app_url = new URL(APP_URL);
    if (document.location.host != app_url.host) {
        srv_url = `${api_url.protocol}//${document.location.hostname}`;
        let port = parseInt(api_url.port);
        if (port && port != 80) {
            srv_url += `:${api_url.port}`;
        }
    }
}

export const SERVER_URL = srv_url;