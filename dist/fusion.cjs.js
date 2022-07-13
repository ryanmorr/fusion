/*! @ryanmorr/fusion v0.2.2 | https://github.com/ryanmorr/fusion */'use strict';Object.defineProperty(exports,"__esModule",{value:!0});function unwrapExports(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a["default"]:a}function createCommonjsModule(a,b){return b={exports:{}},a(b,b.exports),b.exports}var createStore_esm=createCommonjsModule(function(a,b){Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=void 0;b["default"]=function(i){return function(){var j,k=[],a=function(){return j},c=function(){for(var b=arguments.length,c=Array(b),a=0;a<b;a++)c[a]=arguments[a];return j=c[0],k.slice().forEach(function(b){return b.apply(void 0,c)}),j},d=function(c){if(!k.includes(c))return k.push(c),c(j),function(){var a=k.indexOf(c);-1!==a&&k.splice(a,1)}},e=i(a,c,d,k),f=e.apply(void 0,arguments);return f.subscribe||(f.subscribe=d),f}}}),createStore=unwrapExports(createStore_esm),val=createStore(function(a,b){return function(c){b(c);var d=function(c){return b(c,a()),c};return{get:a,set:d,update:function(b){return d(b(a()))}}}}),derived=createStore(function(a,b){return function(){for(var c=!1,d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];var g=e.pop(),h=[],j=function(){return b(g.apply(void 0,h),a())};return e.forEach(function(a,b){return a.subscribe(function(a){h[b]=a,c&&j()})}),c=!0,j(),{get:a}}}),CSS=Symbol("css"),TYPE=Symbol("type"),MEDIA=Symbol("media"),QUERY=Symbol("query"),KEYFRAMES=Symbol("keyframes");function uuid(){return Math.random().toString(36).substr(2,9)}function isStore(a){return a&&"function"==typeof a.subscribe}function isPromise(a){return Promise.resolve(a)===a}var docStyle=document.documentElement.style;function setProp(a,b){if("function"==typeof b)return setProp(a,b());if(isPromise(b))return b.then(function(b){return setProp(a,b)});var c=docStyle.getPropertyValue(a);""!==c&&null==b?docStyle.removeProperty(a):null!=b&&docStyle.setProperty(a,b)}function getProp(a){if(CSS in a)return a[CSS];var b="--".concat(uuid());return isStore(a)?a.subscribe(function(a){return setProp(b,a)}):a.then(function(a){return setProp(b,a)}),a[CSS]=b}var keyframes={};function resolveValue(a){if("function"==typeof a&&!isStore(a))return resolveValue(a());if(isStore(a)){if(!(TYPE in a))return"var(".concat(getProp(a),")");if(a[TYPE]===MEDIA)return"@media ".concat(a[CSS]);if(a[TYPE]===KEYFRAMES){var b=a.toString();return b in keyframes||(keyframes[b]="@keyframes ".concat(b," { ").concat(a[CSS]," }")),b}if(a[TYPE]===QUERY)return a[CSS]}return isPromise(a)?"var(".concat(getProp(a),")"):a}function css(a){for(var b=arguments.length,c=Array(1<b?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];var e=a.raw.reduce(function(a,b,d){return a+resolveValue(c[d-1])+b});Object.keys(keyframes).forEach(function(a){var b=keyframes[a];"string"==typeof b&&(e+=" "+b,keyframes[a]=!0)});var f=document.createElement("style");return f.appendChild(document.createTextNode(e)),f}function fallback(){for(var a=1,b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];var e=c.length,f=function b(c,d,f){return"function"==typeof d?b(c,d(),f):(isStore(d)||isPromise(d)?(a++,c+="var(".concat(getProp(d))):"string"==typeof d&&d.startsWith("--")?(a++,c+="var(".concat(d)):c+=d,c+=f+1===e?Array(a).join(")"):", ",c)};return c.reduce(f,"")}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var media=createStore(function(a,b){return function(c){var d,e=matchMedia(c),f=function(){return b(e.matches)};return"addEventListener"in e?e.addEventListener("change",f):e.addListener(f),f(),(d={},_defineProperty(d,TYPE,MEDIA),_defineProperty(d,CSS,c),_defineProperty(d,"get",a),d)}}),observer=null,listeners=[];function find(a){return Array.from(document.querySelectorAll(a))}function startObserver(){observer||(observer=new MutationObserver(checkSelectors),observer.observe(document.documentElement,{childList:!0,subtree:!0}))}function checkSelectors(){listeners.forEach(function(a){var b=a.selector,c=a.get,d=a.set,e=c(),f=find(b),g=f.filter(function(a){return!e.includes(a)}),h=e.filter(function(a){return!f.includes(a)});(0<g.length||0<h.length)&&d(f,e)})}var query=createStore(function(a,b){return function(c){var d;return startObserver(),listeners.push({selector:c,get:a,set:b}),b(find(c),[]),(d={},_defineProperty(d,TYPE,QUERY),_defineProperty(d,CSS,c),_defineProperty(d,"get",a),d)}}),docElement=document.documentElement,listeners$1={};function startObserver$1(){docElement.addEventListener("animationstart",onStart),docElement.addEventListener("animationend",onEnd),docElement.addEventListener("animationcancel",onEnd)}function onStart(a){var b=a.animationName;if(b in listeners$1){var c=listeners$1[b],d=c.get,e=c.set,f=a.target,g=d(),h=g.concat([f]);e(h,g)}}function onEnd(a){var b=a.animationName;if(b in listeners$1){var c=listeners$1[b],d=c.get,e=c.set,f=a.target,g=d(),h=g.filter(function(a){return a!==f});e(h,g)}}function resolveValue$1(a){return"function"==typeof a?resolveValue$1(a()):isStore(a)?"var(".concat(getProp(a),")"):a}var keyframes$1=createStore(function(a,b){return function(c){for(var d,e=arguments.length,f=Array(1<e?e-1:0),g=1;g<e;g++)f[g-1]=arguments[g];startObserver$1();var h="animation-"+uuid(),i=c.raw.reduce(function(a,b,c){return a+resolveValue$1(f[c-1])+b});return listeners$1[h]={get:a,set:b},b([],[]),(d={},_defineProperty(d,TYPE,KEYFRAMES),_defineProperty(d,CSS,i),_defineProperty(d,"toString",function(){return h}),_defineProperty(d,"get",a),d)}});exports.css=css,exports.derived=derived,exports.fallback=fallback,exports.keyframes=keyframes$1,exports.media=media,exports.query=query,exports.val=val;
