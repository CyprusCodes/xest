"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8753],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=u(n),d=a,g=p["".concat(l,".").concat(d)]||p[d]||m[d]||i;return n?r.createElement(g,s(s({ref:t},c),{},{components:n})):r.createElement(g,s({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,s=new Array(i);s[0]=p;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var u=2;u<i;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},3919:function(e,t,n){function r(e){return!0===/^(\w*:|\/\/)/.test(e)}function a(e){return void 0!==e&&!r(e)}n.d(t,{Z:function(){return a},b:function(){return r}})},4996:function(e,t,n){n.d(t,{C:function(){return i},Z:function(){return s}});var r=n(2263),a=n(3919);function i(){var e=(0,r.Z)().siteConfig,t=(e=void 0===e?{}:e).baseUrl,n=void 0===t?"/":t,i=e.url;return{withBaseUrl:function(e,t){return function(e,t,n,r){var i=void 0===r?{}:r,s=i.forcePrependBaseUrl,o=void 0!==s&&s,l=i.absolute,u=void 0!==l&&l;if(!n)return n;if(n.startsWith("#"))return n;if((0,a.b)(n))return n;if(o)return t+n;var c=n.startsWith(t)?n:t+n.replace(/^\//,"");return u?e+c:c}(i,n,e,t)}}}function s(e,t){return void 0===t&&(t={}),(0,i().withBaseUrl)(e,t)}},9027:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return l},default:function(){return p},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return c}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),s=["components"],o={id:"messages",title:"Messages"},l=void 0,u={unversionedId:"api/messages",id:"api/messages",isDocsHomePage:!1,title:"Messages",description:"Message elements are messages to show after execute one action. Usually these message are described in the hidden section of the window.",source:"@site/docs/api/messages.md",sourceDirName:"api",slug:"/api/messages",permalink:"/docs/api/messages",editUrl:"https://github.com/CyprusCodes/xest/tree/main/documentation/docs/docs/api/messages.md",tags:[],version:"current",frontMatter:{id:"messages",title:"Messages"},sidebar:"screens",previous:{title:"Context menu",permalink:"/docs/api/context-menu"},next:{title:"Navigation Bar",permalink:"/docs/api/info"}},c=[{value:"Xml structure",id:"xml-structure",children:[],level:2},{value:"Message attributes",id:"message-attributes",children:[],level:2},{value:"Examples",id:"examples",children:[],level:2}],m={toc:c};function p(e){var t=e.components,o=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},m,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Message elements are messages to show after execute one action. Usually these message are described in the hidden section of the window."),(0,i.kt)("p",null,"This message element is referenced from target attribute in a button action."),(0,i.kt)("img",{alt:"Messages",src:n(4996).Z("img/Messages.png")}),(0,i.kt)("h2",{id:"xml-structure"},"Xml structure"),(0,i.kt)("p",null,"The xml structure of message element is the following:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-xml"},'  <tag source="hidden">\n    <message id="[id]" title="[message-title]" message="[message-text]" />\n    ... more messages ...\n  </tag>\n')),(0,i.kt)("h2",{id:"message-attributes"},"Message attributes"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Name"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Use"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"),(0,i.kt)("th",{parentName:"tr",align:null},"Values"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"id")),(0,i.kt)("td",{parentName:"tr",align:null},"String"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Required")),(0,i.kt)("td",{parentName:"tr",align:null},"Message identifier"),(0,i.kt)("td",{parentName:"tr",align:null})),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"title")),(0,i.kt)("td",{parentName:"tr",align:null},"String"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Required")),(0,i.kt)("td",{parentName:"tr",align:null},"Is the title of message"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Note:")," You can use ",(0,i.kt)("a",{parentName:"td",href:"/docs/api/i18n-internationalization"},"i18n")," files (locales)")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"message")),(0,i.kt)("td",{parentName:"tr",align:null},"String"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Required")),(0,i.kt)("td",{parentName:"tr",align:null},"Content of message"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Note:")," You can use ",(0,i.kt)("a",{parentName:"td",href:"/docs/api/i18n-internationalization"},"i18n")," files (locales)")))),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Show a confirm message before insert new data")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-xml"},'...\n<tag source="hidden">\n  <message id="NewMsg" title="CONFIRM_TITLE_NEW" message="CONFIRM_MESSAGE_NEW" />\n</tag>\n...\n<button button-type="button" label="BUTTON_CONFIRM" icon="save" id="ButCnf" help="HELP_CONFIRM_BUTTON">\n  <button-action type="confirm" target="NewMsg" />\n  <button-action type="server" server-action="maintain" target-action="UsrNew" />\n</button>\n')))}p.isMDXComponent=!0}}]);