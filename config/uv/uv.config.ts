const config = {
    prefix: `${import.meta.env.VITE_PUBLIC_PATH}/superviolet/`,
    bare: import.meta.env.VITE_BARE_APIS.split(",").map(format),
    encodeUrl: Function,
    decodeUrl: Function,
    handler: `${import.meta.env.VITE_PUBLIC_PATH}/sv/sv.handler.js`,
    bundle: `${import.meta.env.VITE_PUBLIC_PATH}/sv/sv.bundle.js`,
    config: `${import.meta.env.VITE_PUBLIC_PATH}/sv/sv.config.js`,
    client: `${import.meta.env.VITE_PUBLIC_PATH}/sv/sv.client.js`,
    sw: `${import.meta.env.VITE_PUBLIC_PATH}/sv/sv.sw.js`,
};

// @ts-ignore
globalThis.sv$config = config;

function format(env: string) {
    const { host, hostname, protocol } = globalThis.location;

    return env
        .replace("%{location.host}", host)
        .replace("%{location.hostname}", hostname)
        .replace("%{location.protocol}", protocol);
}
