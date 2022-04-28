"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6402],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||i;return n?r.createElement(f,a(a({ref:t},u),{},{components:n})):r.createElement(f,a({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8420:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],s={id:"awe-103",title:"XEST-103 CRUD Operations",sidebar_label:"XEST-103 CRUD Operations"},l=void 0,c={unversionedId:"training/awe-103",id:"training/awe-103",isDocsHomePage:!1,title:"XEST-103 CRUD Operations",description:"alt_text",source:"@site/docs/training/awe-103.md",sourceDirName:"training",slug:"/training/awe-103",permalink:"/docs/training/awe-103",editUrl:"https://github.com/CyprusCodes/xest/tree/main/documentation/docs/docs/training/awe-103.md",tags:[],version:"current",frontMatter:{id:"awe-103",title:"XEST-103 CRUD Operations",sidebar_label:"XEST-103 CRUD Operations"},sidebar:"training",previous:{title:"XEST-102 MUSIC API",permalink:"/docs/training/awe-102"},next:{title:"XEST-104 CRUD For Artists Table",permalink:"/docs/training/awe-104"}},u=[{value:"Endpoints",id:"endpoints",children:[],level:3},{value:"Query Function, Action, Controller",id:"query-function-action-controller",children:[],level:3}],p={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("img",{parentName:"p",src:"https://minio.cypruscodes.com/beckend-new-chapter/1.png",alt:"alt_text",title:"crud"})),(0,i.kt)("p",null,"In order to read/create/update/delete an artist you need 3 things;"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Controller"),(0,i.kt)("li",{parentName:"ol"},"Actions"),(0,i.kt)("li",{parentName:"ol"},"Query functions")),(0,i.kt)("h3",{id:"endpoints"},"Endpoints"),(0,i.kt)("p",null,"Have a look at the folder structure you should be creating;"),(0,i.kt)("p",null,(0,i.kt)("img",{parentName:"p",src:"https://minio.cypruscodes.com/beckend-new-chapter/4.png",alt:"alt_text",title:"structure"})),(0,i.kt)("p",null,"In the app folder, you can see routers.js file where you will be writing your endpoints."),(0,i.kt)("h3",{id:"query-function-action-controller"},"Query Function, Action, Controller"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Start by writing the query for inserting an artist in your ",(0,i.kt)("inlineCode",{parentName:"li"},"src/actions/artists/createArtist/queries/insertArtist.js"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'const { submitQuery, getInsertId } = require("~root/lib/database");\n\nconst insertArtist = ({ name, genre }) => submitQuery`\n    INSERT INTO Artists(name, genre)\n    VALUE(${name}, ${genre});\n`;\n\nmodule.exports = getInsertId(insertArtist);\n')),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"Followed by that you need to write your action in your ",(0,i.kt)("inlineCode",{parentName:"li"},"src/actions/artists/createArtist/index.js"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'const insertArtist = require("./queries/insertArtist");\n\nconst createArtist = async ({ name, genre }) => {\n  const artistId = await insertArtist({ name, genre });\n  return { artistId };\n};\n\nmodule.exports = createArtist;\n')),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"Start by writing a post function in your ",(0,i.kt)("inlineCode",{parentName:"li"},"src/app/controllers/Artists/postArtist/index.js")," file which should look like the following")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'const handleAPIError = require("~root/utils/handleAPIError");\nconst createArtist = require("~root/actions/artists/createArtist");\n\nconst postArtist = async (req, res) => {\n  const { name, genre } = req.body;\n\n  try {\n    const { artistId } = await createArtist({ name, genre });\n\n    res.status(201).send({\n      artistId\n    });\n  } catch (err) {\n    handleAPIError(res, err);\n  }\n};\n\nmodule.exports = postArtist;\n')),(0,i.kt)("p",null,"In this file, if the createArtist function works, you get 201 status code and get your artistId however if you have an error, you will get an API error accordingly. (these api errors will come from your constants folder; HttpStatusCodes.js file, feel free to go and check the relevant file.)"),(0,i.kt)("ol",{start:4},(0,i.kt)("li",{parentName:"ol"},"Then add the following;")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'router.post("/artists", postArtist);\n')),(0,i.kt)("p",null,"route to your ",(0,i.kt)("inlineCode",{parentName:"p"},"src/app/routes.js")," after defining and requiring the function at the top of the file."),(0,i.kt)("p",null,"In these 3 files you can see that you have created a query first - used that query in your actions and use that action in your controller by importing each other."))}d.isMDXComponent=!0}}]);