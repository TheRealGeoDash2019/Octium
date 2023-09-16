const obfuscation = true;
// @ts-ignore
const bareServerURL = new URL("/bare/", globalThis.location);
const github = "https://github.com/TheRealGeoDash2019/Octium";
const discord = "https://discord.gg/25NxvxyEEr";
const internalNamespace = "octium"; // original: cobalt (cobalt://, "://" omitted)
const jsNamespace = "Octium"; // original: Cobalt (eg. Cobalt.web)
const exposedInternalUrls = ["home", "blank", "settings", `${internalNamespace}-urls`, `extensions`]

export { obfuscation, bareServerURL, github, discord, internalNamespace, jsNamespace, exposedInternalUrls };
