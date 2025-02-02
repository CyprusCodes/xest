"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[3331],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,y=d["".concat(l,".").concat(m)]||d[m]||p[m]||i;return r?n.createElement(y,a(a({ref:t},u),{},{components:r})):n.createElement(y,a({ref:t},u))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7731:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>a,metadata:()=>s,toc:()=>l,default:()=>u});var n=r(7462),o=(r(7294),r(3905));const i={id:"xest-103",title:"XEST-103 CRUD Operations",sidebar_label:"XEST-103 CRUD Operations"},a=void 0,s={unversionedId:"training/xest-103",id:"training/xest-103",isDocsHomePage:!1,title:"XEST-103 CRUD Operations",description:"alt_text",source:"@site/docs/training/xest-103.md",sourceDirName:"training",slug:"/training/xest-103",permalink:"/docs/training/xest-103",editUrl:"https://github.com/CyprusCodes/xest/tree/main/documentation/docs/docs/training/xest-103.md",tags:[],version:"current",frontMatter:{id:"xest-103",title:"XEST-103 CRUD Operations",sidebar_label:"XEST-103 CRUD Operations"},sidebar:"training",previous:{title:"XEST-102 MUSIC API",permalink:"/docs/training/xest-102"},next:{title:"XEST-104 CRUD For Artists Table",permalink:"/docs/training/xest-104"}},l=[{value:"Endpoints",id:"endpoints",children:[],level:3},{value:"Query Function, Action, Controller",id:"query-function-action-controller",children:[],level:3}],c={toc:l};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://minio.cypruscodes.com/beckend-new-chapter/1.png",alt:"alt_text",title:"crud"})),(0,o.kt)("p",null,"In order to read/create/update/delete an artist you need 3 things;"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Controller"),(0,o.kt)("li",{parentName:"ol"},"Actions"),(0,o.kt)("li",{parentName:"ol"},"Query functions")),(0,o.kt)("h3",{id:"endpoints"},"Endpoints"),(0,o.kt)("p",null,"Have a look at the folder structure you should be creating;"),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://minio.cypruscodes.com/beckend-new-chapter/4.png",alt:"alt_text",title:"structure"})),(0,o.kt)("p",null,"In the app folder, you can see routers.js file where you will be writing your endpoints."),(0,o.kt)("h3",{id:"query-function-action-controller"},"Query Function, Action, Controller"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Start by writing the query for inserting an artist in your ",(0,o.kt)("inlineCode",{parentName:"li"},"src/actions/artists/createArtist/queries/insertArtist.js"))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const { submitQuery, getInsertId } = require("~root/lib/database");\n\nconst insertArtist = ({ name, genre }) => submitQuery`\n    INSERT INTO Artists(name, genre)\n    VALUE(${name}, ${genre});\n`;\n\nmodule.exports = getInsertId(insertArtist);\n')),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"Followed by that you need to write your action in your ",(0,o.kt)("inlineCode",{parentName:"li"},"src/actions/artists/createArtist/index.js"))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const insertArtist = require("./queries/insertArtist");\n\nconst createArtist = async ({ name, genre }) => {\n  const artistId = await insertArtist({ name, genre });\n  return { artistId };\n};\n\nmodule.exports = createArtist;\n')),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"Start by writing a post function in your ",(0,o.kt)("inlineCode",{parentName:"li"},"src/app/controllers/Artists/postArtist/index.js")," file which should look like the following")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const handleAPIError = require("~root/utils/handleAPIError");\nconst createArtist = require("~root/actions/artists/createArtist");\n\nconst postArtist = async (req, res) => {\n  const { name, genre } = req.body;\n\n  try {\n    const { artistId } = await createArtist({ name, genre });\n\n    res.status(201).send({\n      artistId\n    });\n  } catch (err) {\n    handleAPIError(res, err);\n  }\n};\n\nmodule.exports = postArtist;\n')),(0,o.kt)("p",null,"In this file, if the createArtist function works, you get 201 status code and get your artistId however if you have an error, you will get an API error accordingly. (these api errors will come from your constants folder; HttpStatusCodes.js file, feel free to go and check the relevant file.)"),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"Then add the following;")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'router.post("/artists", postArtist);\n')),(0,o.kt)("p",null,"route to your ",(0,o.kt)("inlineCode",{parentName:"p"},"src/app/routes.js")," after defining and requiring the function at the top of the file."),(0,o.kt)("p",null,"In these 3 files you can see that you have created a query first - used that query in your actions and use that action in your controller by importing each other."))}u.isMDXComponent=!0}}]);