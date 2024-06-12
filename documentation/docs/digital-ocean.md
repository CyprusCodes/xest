---
id: digital-ocean
title: Deploy Xest API Project to Digital Ocean
sidebar_label: Digital Ocean
---

**Step 1:** Create a Digital Ocean account, here: [digital ocean](https://cloud.digitalocean.com/registrations/new).

To deploy a Xest Project to Digital Ocean, Run: 

```
xx deploy
```

Xest CLI will give you options. Choose Digital Ocean

```
Starting deployment...
? Select the deployment platform (Use arrow keys)
❯ Digital Ocean
  AWS
```
This will automatically create a deployment folder named  **.do** folder with 2 files
1. app.yaml
```
name: project_name
services:
- environment_slug: node-js
  github:
    branch: your_deployment_branch
    deploy_on_push: true
    repo: github_profile/project
  name: project_name
```

2. deploy.template.yaml
```
spec:
  name: project_name
  services:
  - environment_slug: node-js
    git:
      branch: your_deployment_branch
      repo_clone_url: https://github.com/github_profile/project.git
    name: project_name
```
**The file will automatically autocomplete the necessary information for deployment, including your repository and app name.**

**Step 2:** Create a Digital Ocean account, here: [digital ocean](https://cloud.digitalocean.com/login).

**Step 3:** Once your account is created, create a new project (or use the one created for you as default).

<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo" 
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/create_new_project.webp')}
/>

**Step 4:** Create a new Database, on the Database Space, Choose MySQL as Database type, give your database cluster a name, and select your project.

<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo" 
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/creating_a_database_cluster.webp')}
/>

<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/creating_a_database_cluster_2.webp')}
/>

**Step 5:** Finish your database configuration and copy your connection details, it should look like this:

```
username = doadmin
password = *****************************
host = xxxxxxxxxxx.ondigitalocean.com
port = your_port
database = database_name
sslmode = REQUIRED
```

**Step 6:** Go to App Platform and Create a new App, I will advise you to push your project on GitHub, it will be easy for the deployment.
Choose your repository and the main branch you want to use.

<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/app_reation_in_DO.webp')}
/>

**Step 7:** In your Environment Variables add your connection details like this:

```
DB_NAME=database_name

DB_USER=doadmin

DB_PASSWORD=**************

sslmode=REQUIRED

DB_HOST=xxxxxxxxxx.ondigitalocean.com

DB_PORT=your_port

APP_ENVIRONMENT=PRODUCTION

JWT_SECRET=SUPER_DUPER_SECRET

PASSWORD_SALT=SECRET_SALT
```

Once finished, you will have something like this:
<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/showing_that_the_app_has_been_created.webp')}
/>

**Step 8:** Create your droplet, and remember to choose your project on the project input.

<img style={{ margin: "20px 20px", }} 
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/screen_for_creating_a_droplet_on_d_o.webp')}
/>

With This Your Digital Ocean is ready to deploy your Xest API project.