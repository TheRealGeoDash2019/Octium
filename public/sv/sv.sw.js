importScripts('/sv/sv.bundle.js');
importScripts('/sv/sv.config.js');
importScripts("/config.js");

(()=>{var p=self.Superviolet,x=["cross-origin-embedder-policy","cross-origin-opener-policy","cross-origin-resource-policy","content-security-policy","content-security-policy-report-only","expect-ct","feature-policy","origin-isolation","strict-transport-security","upgrade-insecure-requests","x-content-type-options","x-download-options","x-frame-options","x-permitted-cross-domain-policies","x-powered-by","x-xss-protection"],C=["GET","HEAD"],g=class extends p.EventEmitter{constructor(t=__sv$config){super(),t.bare||(t.bare="/bare/"),t.prefix||(t.prefix="/service/"),this.config=t;let i=(Array.isArray(t.bare)?t.bare:[t.bare]).map(e=>new URL(e,location).toString());this.address=i[~~(Math.random()*i.length)],this.bareClient=new p.BareClient(this.address)}async fetch({request:t}){let i;try{if(!t.url.startsWith(location.origin+this.config.prefix))return await fetch(t);let e=new p(this.config,this.address);typeof this.config.construct=="function"&&this.config.construct(e,"service");let a=await e.cookie.db();e.meta.origin=location.origin,e.meta.base=e.meta.url=new URL(e.sourceUrl(t.url));let r=new w(t,this,e,C.includes(t.method.toUpperCase())?null:await t.blob());if(e.meta.url.protocol==="blob:"&&(r.blob=!0,r.base=r.url=new URL(r.url.pathname)),t.referrer&&t.referrer.startsWith(location.origin)){let s=new URL(e.sourceUrl(t.referrer));(r.headers.origin||e.meta.url.origin!==s.origin&&t.mode==="cors")&&(r.headers.origin=s.origin),r.headers.referer=s.href}let c=await e.cookie.getCookies(a)||[],l=e.cookie.serialize(c,e.meta,!1);r.headers["user-agent"]=navigator.userAgent,l&&(r.headers.cookie=l);let m=new f(r,null,null);if(this.emit("request",m),m.intercepted)return m.returnValue;i=r.blob?"blob:"+location.origin+r.url.pathname:r.url;let b=new Request(i,{headers:r.headers,method:r.method,body:r.body,credentials:r.credentials,mode:location.origin!==r.address.origin?"cors":r.mode,cache:r.cache,redirect:r.redirect});if(typeof this.config.middleware=="function"){let s=await this.config.middleware(b);if(s instanceof Response)return s;s instanceof Request&&(b=s)}let u=await this.bareClient.fetch(b,{headers:r.headers,method:r.method,body:r.body,credentials:r.credentials,mode:location.origin!==r.address.origin?"cors":r.mode,cache:r.cache,redirect:r.redirect}),o=new v(r,u),h=new f(o,null,null);if(this.emit("beforemod",h),h.intercepted)return h.returnValue;for(let s of x)o.headers[s]&&delete o.headers[s];if(o.headers.location&&(o.headers.location=e.rewriteUrl(o.headers.location)),t.destination==="document"){let s=o.headers["content-disposition"];if(!/\s*?((inline|attachment);\s*?)filename=/i.test(s)){let d=/^\s*?attachment/i.test(s)?"attachment":"inline",[y]=new URL(u.finalURL).pathname.split("/").slice(-1);o.headers["content-disposition"]=`${d}; filename=${JSON.stringify(y)}`}}if(o.headers["set-cookie"]&&(Promise.resolve(e.cookie.setCookies(o.headers["set-cookie"],a,e.meta)).then(()=>{self.clients.matchAll().then(function(s){s.forEach(function(d){d.postMessage({msg:"updateCookies",url:e.meta.url.href})})})}),delete o.headers["set-cookie"]),o.body)switch(t.destination){case"script":case"worker":{let s=[e.bundleScript,e.clientScript,e.configScript,e.handlerScript].map(d=>JSON.stringify(d)).join(",");o.body=`if (!self.__sv && self.importScripts) { ${e.createJsInject(this.address,this.bareClient.manifest,e.cookie.serialize(c,e.meta,!0),t.referrer)} importScripts(${s}); }
`,o.body+=e.js.rewrite(await u.text())}break;case"style":o.body=e.rewriteCSS(await u.text());break;case"iframe":case"document":if(E(e.meta.url,o.headers["content-type"]||"")){let s=await u.text();if(typeof this.config.inject=="function"){let d=s.indexOf("</head>"),y=s.indexOf("</HEAD>"),S=await this.config.inject(new URL(i));(d!==-1||y!==-1)&&(s=s.slice(0,d)+`${await S}`+s.slice(d))}o.body=e.rewriteHtml(s,{document:!0,injectHead:e.createHtmlInject(e.handlerScript,e.bundleScript,e.clientScript,e.configScript,this.address,this.bareClient.manifest,e.cookie.serialize(c,e.meta,!0),t.referrer)})}}return r.headers.accept==="text/event-stream"&&(o.headers["content-type"]="text/event-stream"),crossOriginIsolated&&(o.headers["Cross-Origin-Embedder-Policy"]="require-corp"),this.emit("response",h),h.intercepted?h.returnValue:new Response(o.body,{headers:o.headers,status:o.status,statusText:o.statusText})}catch(e){return["document","iframe"].includes(t.destination)?(console.error(e),T(e,i,this.address)):new Response(void 0,{status:500})}}static Superviolet=p};self.SVServiceWorker=g;var v=class{constructor(t,i){this.request=t,this.raw=i,this.superviolet=t.superviolet,this.headers={};for(let e in i.rawHeaders)this.headers[e.toLowerCase()]=i.rawHeaders[e];this.status=i.status,this.statusText=i.statusText,this.body=i.body}get url(){return this.request.url}get base(){return this.request.base}set base(t){this.request.base=t}},w=class{constructor(t,i,e,a=null){this.superviolet=e,this.request=t,this.headers=Object.fromEntries(t.headers.entries()),this.method=t.method,this.address=i.address,this.body=a||null,this.cache=t.cache,this.redirect=t.redirect,this.credentials="omit",this.mode=t.mode==="cors"?t.mode:"same-origin",this.blob=!1}get url(){return this.superviolet.meta.url}set url(t){this.superviolet.meta.url=t}get base(){return this.superviolet.meta.base}set base(t){this.superviolet.meta.base=t}};function E(n,t=""){return(p.mime.contentType(t||n.pathname)||"text/html").split(";")[0]==="text/html"}var f=class{#e;#t;constructor(t={},i=null,e=null){this.#e=!1,this.#t=null,this.data=t,this.target=i,this.that=e}get intercepted(){return this.#e}get returnValue(){return this.#t}respondWith(t){this.#t=t,this.#e=!0}};function O(n,t){let i=new URL(n),e=`remoteHostname.textContent = ${JSON.stringify(i.hostname)};bareServer.href = ${JSON.stringify(t)};svHostname.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());svVersion.textContent = ${JSON.stringify("2.0.2")};`;return`<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1>This site can\u2019t be reached</h1><hr /><p><b id="remoteHostname"></b>\u2019s server IP address could not be found.</p><p>Try:</p><ul><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="svHostname"></b>'s administrator</li><li>Verifying the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</li></ul><button id="reload">Reload</button><hr /><p><i>Superviolet v<span id="svVersion"></span></i></p><script src="${"data:application/javascript,"+encodeURIComponent(e)}"><\/script></body></html>`}function R(n,t,i,e,a,r,c){if(e==="The specified host could not be resolved.")return O(r,c);let l=`errorTitle.textContent = ${JSON.stringify(n)};errorCode.textContent = ${JSON.stringify(t)};`+(i?`errorId.textContent = ${JSON.stringify(i)};`:"")+`errorMessage.textContent =  ${JSON.stringify(e)};errorTrace.value = ${JSON.stringify(a)};fetchedURL.textContent = ${JSON.stringify(r)};bareServer.href = ${JSON.stringify(c)};for (const node of document.querySelectorAll("#svHostname")) node.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());svVersion.textContent = ${JSON.stringify("2.0.2")};`;return`<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1 id='errorTitle'></h1><hr /><p>Failed to load <b id="fetchedURL"></b></p><p id="errorMessage"></p><table><tbody><tr><td>Code:</td><td id="errorCode"></td></tr>`+(i?'<tr><td>ID:</td><td id="errorId"></td></tr>':"")+`</tbody></table><textarea id="errorTrace" cols="40" rows="10" readonly></textarea><p>Try:</p><ul><li>Checking your internet connection</li><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="svHostname"></b>'s administrator</li><li>Verify the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</li></ul><p>If you're the administrator of <b id="svHostname"></b>, try:</p><ul><li>Restarting your Bare server</li><li>Updating Superviolet</li><li>Troubleshooting the error on the <a href="https://github.com/TheRealGeoDash2019/superviolet" target="_blank">GitHub repository</a></li></ul><button id="reload">Reload</button><hr /><p><i>Superviolet v<span id="svVersion"></span></i></p><script src="${"data:application/javascript,"+encodeURIComponent(l)}"><\/script></body></html>`}function k(n){return n instanceof Error&&typeof n.body=="object"}function T(n,t,i){let e,a,r,c="",l;return k(n)?(e=n.status,a="Error communicating with the Bare server",l=n.body.message,r=n.body.code,c=n.body.id):(e=500,a="Error processing your request",l="Internal Server Error",r=n instanceof Error?n.name:"UNKNOWN"),new Response(R(a,r,c,l,String(n),t,i),{status:e,headers:{"content-type":"text/html"}})}})();
;(async () => {
    self.__sv$config.bare = await self.internalConfig.bareServers.getBareServers(true);
    const getRedirectToErrorCode = function(errorCode = 300, url = "about:blank") {
        return new Response(null, {
            status: 307,
            headers: new Headers({
                "Location": `/internal/network-error/-${errorCode}?u=${url}`    
            })
        })
    };

    const commonAdNames = ["ad.js", "pagead.js", "partner.ads.js"];
    self.__sv$config.middleware = async function(req) {
        try {
            const blockedDomains = await self.internalConfig.blockedDomains.listDomains(true);
            const adDomains = await self.internalConfig.adBlockState.getAdDomains(true);
            const adBlockEnabled = await self.internalConfig.adBlockState.getState(true);
            const url = new URL(req.url);
            if (blockedDomains.includes(url.host)) {
                return getRedirectToErrorCode(20, url.href);
            } else if (adBlockEnabled && adDomains.includes(url.host)) {
                return new Response(null, {
                    status: 404,
                    headers: new Headers({
                        "X-Blocked": "?1"
                    })
                })
            } else if (adBlockEnabled && url.pathname.split("/").find(e => commonAdNames.includes(e))) {
                return new Response(null, {
                    status: 404,
                    headers: new Headers({
                        "X-Blocked": "?1"
                    })
                })
            } else {
                return req;
            }
        } catch {
            return req;
        }
    };

    self.addEventListener("message", function({ data: _ }) {
        if (typeof _ === "object" && _ !== null && _ !== undefined) {
            const { action, data } = _;
            if (action === "clientSetMiddleware") {
                // console.log(self);
                // console.log("[Octium Worker] Modifying Client Middleware.");
                // self.__sv$config.middleware = new Function('req', `return (${data || "(req) => { return req; }"}).call(this, req);`);
                // target.postMessage({ action: "clientSetMiddleware", data: { success: true } })
            }
            if (action === "clientSetInject") {
                // console.log(self);
                // console.log("[Octium Worker] Modifying Client Inject.");
                // self.__sv$config.inject = new Function('url', `return (${data || "() => { return ''; }" }).call(this, url);`);
                // target.postMessage({ action: "clientSetInject", data: { success: true } })
            }
        }
    });
})();
//# sourceMappingURL=sv.sw.js.map
