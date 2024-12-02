"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[632],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return k}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),p=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=p(n),k=r,m=d["".concat(i,".").concat(k)]||d[k]||c[k]||l;return n?a.createElement(m,o(o({ref:t},u),{},{components:n})):a.createElement(m,o({ref:t},u))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var p=2;p<l;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7722:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return i},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=["components"],s={id:"installation-ubuntu",title:"Installation on Ubuntu",sidebar_label:"Installation - Ubuntu"},i=void 0,p={unversionedId:"installation-ubuntu",id:"installation-ubuntu",isDocsHomePage:!1,title:"Installation on Ubuntu",description:"1. Install NVM (Node Version Manager)",source:"@site/docs/installation-ubuntu.md",sourceDirName:".",slug:"/installation-ubuntu",permalink:"/docs/installation-ubuntu",editUrl:"https://github.com/CyprusCodes/xest/tree/main/documentation/docs/docs/installation-ubuntu.md",tags:[],version:"current",frontMatter:{id:"installation-ubuntu",title:"Installation on Ubuntu",sidebar_label:"Installation - Ubuntu"},sidebar:"docs",previous:{title:"Installation - Mac",permalink:"/docs/installation-mac"},next:{title:"Routing",permalink:"/docs/routing"}},u=[{value:"1. Install NVM (Node Version Manager)",id:"1-install-nvm-node-version-manager",children:[],level:3},{value:"<strong>2. Install Docker</strong>",id:"2-install-docker",children:[{value:"<strong>Using Snap</strong>",id:"using-snap",children:[],level:3}],level:2},{value:"<strong>Verify Installations</strong>",id:"verify-installations",children:[],level:2},{value:"<strong>3. Install Docker Compose</strong>",id:"3-install-docker-compose",children:[{value:"<strong>Using Snap</strong>",id:"using-snap-1",children:[],level:3}],level:2},{value:"<strong>Verify Installations</strong>",id:"verify-installations-1",children:[{value:"4. <strong>Allow Managing Docker as a Non-Root User</strong>",id:"4-allow-managing-docker-as-a-non-root-user",children:[],level:3},{value:"5. <strong>Install Xest</strong>",id:"5-install-xest",children:[],level:3}],level:2},{value:"Bootstrapping Your API",id:"bootstrapping-your-api",children:[],level:2}],c={toc:u};function d(e){var t=e.components,n=(0,r.Z)(e,o);return(0,l.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("br",null),(0,l.kt)("h3",{id:"1-install-nvm-node-version-manager"},"1. Install NVM (Node Version Manager)"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Update your package list:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"}," sudo apt update\n")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Install NVM:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash\n")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: Replace v0.35.3 with the latest version if necessary.")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Verify the installation:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"nvm --version\n")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Install the latest version of Node.js using NVM:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"nvm install node\n")),(0,l.kt)("br",null),(0,l.kt)("h2",{id:"2-install-docker"},(0,l.kt)("strong",{parentName:"h2"},"2. Install Docker")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Update System Packages:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt-get update\nsudo apt-get install -y ca-certificates curl gnupg\n"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Add Docker's Official GPG Key:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"sudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nsudo chmod a+r /etc/apt/keyrings/docker.gpg\n"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Set Up Docker Repository:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'echo \\\n"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\\n$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n'))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Install Docker:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt-get update\nsudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin\n"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Verify Docker Installation:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"docker --version\n")))),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"using-snap"},(0,l.kt)("strong",{parentName:"h3"},"Using Snap")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Install Docker using Snap:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"sudo snap install docker\n")),(0,l.kt)("p",{parentName:"li"},"This installs the Snap version of Docker, typically updated to version ",(0,l.kt)("inlineCode",{parentName:"p"},"27.2.0")," or later."))),(0,l.kt)("h2",{id:"verify-installations"},(0,l.kt)("strong",{parentName:"h2"},"Verify Installations")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Check Docker version:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"docker --version\n")),(0,l.kt)("br",null),(0,l.kt)("h2",{id:"3-install-docker-compose"},(0,l.kt)("strong",{parentName:"h2"},"3. Install Docker Compose")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Download the Latest Version of Docker Compose:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"mkdir -p ~/.docker/cli-plugins/\ncurl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-$(uname -m) -o ~/.docker/cli-plugins/docker-compose\n"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Set Executable Permissions:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"chmod +x ~/.docker/cli-plugins/docker-compose\n"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Verify Docker Compose Installation:")),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"docker compose version\n")))),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"using-snap-1"},(0,l.kt)("strong",{parentName:"h3"},"Using Snap")),(0,l.kt)("p",null,"To install Docker Compose directly using Apt, you can use the following command:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt install docker-compose\n")),(0,l.kt)("hr",null),(0,l.kt)("h2",{id:"verify-installations-1"},(0,l.kt)("strong",{parentName:"h2"},"Verify Installations")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Check Docker Compose version:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"docker-compose --version\n")),(0,l.kt)("br",null),(0,l.kt)("h3",{id:"4-allow-managing-docker-as-a-non-root-user"},"4. ",(0,l.kt)("strong",{parentName:"h3"},"Allow Managing Docker as a Non-Root User")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Add your user to the Docker group:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"sudo usermod -aG docker $USER\n")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Log out and log back in")," for the changes to take effect, or run:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"newgrp docker\n")),(0,l.kt)("br",null),(0,l.kt)("h3",{id:"5-install-xest"},"5. ",(0,l.kt)("strong",{parentName:"h3"},"Install Xest")),(0,l.kt)("br",null),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Install Xest globally using NPM:"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"npm install -g xest\n")),(0,l.kt)("p",null,"After installing the XEST CLI globally, you can now bootstrap your API."),(0,l.kt)("h2",{id:"bootstrapping-your-api"},"Bootstrapping Your API"),(0,l.kt)("p",null,"In order to create your API, you need to run the following commmand:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"xx [project-name]\n")),(0,l.kt)("p",null,"With one simple command, you will be installing all the necessary packages, utils, middlewares and required modules will be created for you. Have a look at the created directory."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"cd project-name\n")),(0,l.kt)("p",null,"to start your Xest API, run"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"xx run\n")),(0,l.kt)("p",null,"Et voila! You're ready to Xest :)"),(0,l.kt)("p",null,"The project-name directory will be created, node modules and a few other boilerplate files will be installed, and a src/ directory will be created and populated with several core files, forming a new API-directory with the following setup;"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 index.js\n\u251c\u2500\u2500 package-lock.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 node_modules\n\u251c\u2500\u2500 migrations\n\u251c\u2500\u2500 test\n\u251c\u2500\u2500 .env\n\u251c\u2500\u2500 .eslintignore\n\u251c\u2500\u2500 .eslintrc\n\u251c\u2500\u2500 .gitattributes\n\u251c\u2500\u2500 database.json\n\u251c\u2500\u2500 jsconfig.json\n\u251c\u2500\u2500 Makefile\n\u251c\u2500\u2500 database\n\u2502 \u251c\u2500\u2500 database-schema.sql\n\u2502 \u2514\u2500\u2500 seed-data.sql\n\u2502 \u2514\u2500\u2500 docker-compose.yml\n\u2502 \u2514\u2500\u2500 test-database.json\n\u2514\u2500\u2500 src\n")),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"docker-compose.yml")," is our local development environment configuration. When you run your application, a MySQL container will be started for you. You can connect to the local database instance by using the credentials listed in the ",(0,l.kt)("inlineCode",{parentName:"p"},"docker-compose.yml")," file."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"database-schema.sql")," is where you will define your database schema. It will be a series of CREATE TABLE statements which is used to populate your local development database."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"seed-data.sql")," will contain the test data that you want to insert into your database whilst developing or testing your application locally."))}d.isMDXComponent=!0}}]);