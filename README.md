<div align="center">
<img height="150px" src="https://raw.githubusercontent.com/TheRealGeoDash2019/Octium/main/src/assets/logo.svg">
<h1>Octium, based on Cobalt</h1>
<h3>A new minimal yet powerful proxy site, built for both users and developers.</h3>
</div>

<p align="center">
<a href="https://repl.it/github/TheRealGeoDash2019/Octium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/replit2.svg"><img></a>
<a href="https://glitch.com/edit/#!/import/github/TheRealGeoDash2019/Octium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/glitch2.svg"><img></a>
<a href="https://railway.app/new/template?template=https://github.com/TheRealGeoDash2019/Octium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/railway2.svg"><img></a>
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/TheRealGeoDash2019/Octium&branch=main&name=Octium"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/koyeb2.svg"><img></a>
</p>

### Warning about using Replit, Glitch or Railway
Due to the dependencies of this project, it will not allow Ultraviolet to install. If you plan on using this on any of the platforms, consider forking and modifying the code to bypass it.

## Features
- Simple clean design
- Side panel for quick access to anything, anywhere
- Extremely customizable
- Massive library of themes
- Star you favorite sites and view you browsing history
- Extensions
- Devtools (Eruda)

## Setup
**Run**

Run `npm start` to start a webserver and the Bare server. You may deploy Octium by using an external bare server and a static file host. Octium must be built before attempting to start.

**Build**

Run `npm run build` to build app for production to the `build` folder.

**Development**

Run `npm run dev` to run the app in development mode.

**Deploy**

Click a button at the top of this page and follow the directions for an easy way to host Octium.

## Configuration

**Obfuscation**

File: [/src/consts.tsx](https://github.com/TheRealGeoDash2019/Octium/blob/main/src/consts.tsx)

`const obfuscation = true | false;` - Choose to obfuscate text

**Github and Discord**

File: [/src/consts.tsx](https://github.com/TheRealGeoDash2019/Octium/blob/main/src/consts.tsx)

`const github = "string";` - Update the Github links

`const discord = "string";` - Update the Discord link

**JS and Internal Namespace**

File: [/src/consts.tsx](https://github.com/TheRealGeoDash2019/Octium/blob/main/src/consts.tsx)

`const jsNamespace = "string";` - Change the Bundle Namepsace (eg. "MyNamespace" = window.MyNamespace[...])
`const internalNamespace = "string";` - Change the Internal URL namespace (eg. "myepicnamespace" = myepicnamespace://home)

**Bare Server**

File: [/public/uv/uv.config.js](https://github.com/TheRealGeoDash2019/Octium/blob/main/public/uv/uv.config.js)

`bare: url,` - Ultraviolet bare server

## To Do (imported from Cobalt)
- [ ] Reading mode extension
- [ ] Popup for how to use Cobalt on first load
- [ ] Keyboard shortcuts (reload, back, forward, favorite)
- [ ] Have real components and not everything in one file
- [ ] Blocklist with custom bloacked page
- [ ] Syntax highlighting for view-source: (make it work with theme)
- [ ] Make Monaco Editor use style
- [ ] Update iframe on custom style change
- [ ] Section to change headers sent to site on proxy (eg. user-agent)
- [ ] Share button
- [ ] Dashboard with widgets
- [ ] Make Ultraviolet take less space
- [ ] URL option for cloaking
- [ ] Update iframe on custom style change
- [ ] Suggestions for home page
- [ ] Games

## License
Octium uses the MIT license.
