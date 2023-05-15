/*! @ryanmorr/fusion v1.0.0 | https://github.com/ryanmorr/fusion */
"use strict";
/*! @ryanmorr/isotope v3.1.0 | https://github.com/ryanmorr/isotope */class e{constructor(e){this._value=e,this._subscribers=[]}value(){return this._value}set(e){const t=this.value();if(e!==t)return this._value=e,this._subscribers.slice().forEach((r=>r(e,t))),e}subscribe(e){const t=this._subscribers;if(!t.includes(e))return t.push(e),e(this.value()),()=>{const r=t.indexOf(e);-1!==r&&t.splice(r,1)}}then(e){e(this.value())}toString(){return String(this.value())}valueOf(){return this.value()}toJSON(){return this.value()}}let t=class extends e{update(e){return this.set(e(this.value()))}},r=class extends e{constructor(e,t){super();let r=!1;const n=[],s=()=>super.set(t(...n));e.forEach(((e,t)=>e.subscribe((e=>{n[t]=e,r&&s()})))),r=!0,s()}};class n extends e{constructor(e,t){super();let r=0,n=!1;const s=[],u=e=>t(...s.concat([e]));e.forEach(((e,t)=>e.subscribe((e=>{if(s[t]=e,n){r++;const e=r;u((t=>{r===e&&super.set(t)}))}})))),n=!0,u((e=>super.set(e)))}}r.prototype.set=void 0,n.prototype.set=void 0,class extends e{constructor(e,t){super(e),this._reducer=t}dispatch(e){return super.set(this._reducer(this.value(),e))}}.prototype.set=void 0;
/*! @ryanmorr/amble v0.1.2 | https://github.com/ryanmorr/amble */
const s=/([^{};]*)([;{}])/g,u=/(\r\n|\r|\n)+/g,c=/\t/g,o=/\s{2,}/g,i=/\/\*[\W\w]*?\*\//g,l=/\s*([:;{}])\s*/g,a=/\};+/g,p=/([^:;{}])}/g;class h extends e{constructor(e){super(),this.mq=matchMedia(e),this.mq.addEventListener("change",this.set.bind(this)),this.query=e,this.set()}set(){super.set(this.mq.matches)}}let f=null;const d=[];function m(e){return Array.from(document.querySelectorAll(e))}class v extends e{constructor(e){var t;super(m(e)),this.selector=e,t=this,f||(f=new MutationObserver((()=>d.forEach((e=>e.set())))),f.observe(document.documentElement,{childList:!0,subtree:!0})),d.push(t)}set(){const e=this.value(),t=m(this.selector);(t.filter((t=>!e.includes(t))).length>0||e.filter((e=>!t.includes(e))).length>0)&&super.set(t)}}function y(){return Math.random().toString(36).substring(2,11)}function b(e){return e&&"function"==typeof e.subscribe}function g(e){return e&&"function"==typeof e.then}function x(e,t,r){return e.raw.reduce(((e,n,s)=>e+r(t[s-1])+n))}const $=document.documentElement.style;function E(e,t){if("function"==typeof t)return E(e,t());if(g(t))return t.then((t=>E(e,t)));""!==$.getPropertyValue(e)&&null==t?$.removeProperty(e):null!=t&&$.setProperty(e,t)}function w(e){if("prop"in e)return e.prop;const t=`--${y()}`;return b(e)?e.subscribe((e=>E(t,e))):e.then((e=>E(t,e))),e.prop=t}let S;const _=/([\s\S]+,[\s\S]+)/m;function q(e){const t=[{children:[]}];let r=0;return function(e,t){e=function(e){return e.replace(u," ").replace(c," ").replace(o," ").replace(i,"").trim().replace(l,"$1").replace(a,"}").replace(p,"$1;}")}(e),s.lastIndex=0;for(let r;null!=(r=s.exec(e));)t(r[1],r[2])}(e,((e,n)=>{"{"==n?t[++r]={selector:e,rules:"",children:[]}:"}"==n?(t[r].rules+=e,t[--r].children.push(t.pop())):";"==n&&(t[r].rules+=e+n)})),t[0].children}function C(e,t){return e.reduce(((e,r)=>{let n=r.selector.trim();return"@"===n[0]?(e+=n+"{",r.children.length>0&&(e+=C(r.children,t)+"}")):(n=t&&"&"===n[0]?t+n.substring(1).replace(_,":is($1)"):t?t+" "+n.replace(_,":is($1)"):n.replace(_,":is($1)"),e+=n+"{"+r.rules+"}",r.children.length>0&&(e+=C(r.children,n))),e}),"")}function O(e){return C(q(e))}function k(e){return"function"==typeof e?k(e()):b(e)?e instanceof h?"@media "+e.query:e instanceof v?e.selector:`var(${w(e)})`:g(e)?`var(${w(e)})`:e&&1===e.nodeType&&"STYLE"===e.nodeName?e.textContent:e}function A(e){S||(S=document.createElement("style"),document.head.appendChild(S)),S.textContent+=e}function L(e){return"function"==typeof e?L(e()):b(e)?`var(${w(e)})`:e}exports.css=function(e,...t){const r=x(e,t,k),n=document.createElement("style");return n.textContent+=O(r),n},exports.derived=function(...e){const t=e.pop();return t.length>e.length?new n(e,t):new r(e,t)},exports.fallback=function(...e){let t=1;const r=e.length,n=(e,s,u)=>"function"==typeof s?n(e,s(),u):(b(s)||g(s)?(t++,e+=`var(${w(s)}`):"string"==typeof s&&s.startsWith("--")?(t++,e+=`var(${s}`):e+=s,e+=u+1!==r?", ":Array(t).join(")"));return e.reduce(n,"")},exports.keyframes=function(e,...t){const r="fusion-animation-"+y();return A(`@keyframes ${r} { ${x(e,t,L)} }`),r},exports.media=function(e){return new h(e)},exports.query=function(e){return new v(e)},exports.store=function(e){return new t(e)},exports.style=function(e,...t){const r=x(e,t,k),n="fusion-"+y();return A(O(`.${n} { ${r} }`)),n};
