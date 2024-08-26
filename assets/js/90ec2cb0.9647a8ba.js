"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8989],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=s(n),d=a,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||o;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6519:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],l={},c=void 0,s={unversionedId:"xxxx",id:"xxxx",isDocsHomePage:!1,title:"xxxx",description:"Sure! Here's a legend for each of the images you provided:",source:"@site/docs/xxxx.md",sourceDirName:".",slug:"/xxxx",permalink:"/docs/xxxx",editUrl:"https://github.com/CyprusCodes/xest/tree/main/documentation/docs/docs/xxxx.md",tags:[],version:"current",frontMatter:{}},p=[],u={toc:p};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Sure! Here's a legend for each of the images you provided:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 1:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"This image shows the terminal output when you run the ",(0,o.kt)("inlineCode",{parentName:"li"},"xx ai")," command. It provides a temporary link (",(0,o.kt)("inlineCode",{parentName:"li"},"https://<unique-subdomain>.loca.lt"),") that you use to connect your Xest project to CMND."))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 2:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},'This image displays the CMND dashboard, specifically the "Connections" section where you can create a new connection using the link provided by ',(0,o.kt)("inlineCode",{parentName:"li"},"xx ai"),"."))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 3:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"This image shows the details you need to enter when creating a new connection in CMND. It includes fields like Integration Name, API Base URL (from the ",(0,o.kt)("inlineCode",{parentName:"li"},"xx ai")," output), and a Token."))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 4:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},'This image shows the "Connections" overview in CMND after successfully connecting to the Xest project. The connection status is "Active," indicating that the integration is working.'))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 5:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},'This image shows the "Conversations" section in CMND where you can use tools like ',(0,o.kt)("inlineCode",{parentName:"li"},"get_list_of_database_tables"),". It demonstrates the output after running a tool command, showing a list of database tables."))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Image 6:")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"This image provides a close-up view of the list of available tools that can be used with the Xest project integration in CMND. Each tool is listed with a checkbox indicating that it's available for use.")))),(0,o.kt)("p",null,"These legends provide a quick reference to understand what each image is illustrating in the context of using ",(0,o.kt)("inlineCode",{parentName:"p"},"xx ai")," with CMND."))}m.isMDXComponent=!0}}]);