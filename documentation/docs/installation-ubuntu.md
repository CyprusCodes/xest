---
id: installation-ubuntu
title: Installation on Ubuntu
sidebar_label: Installation - Ubuntu
---

<br/>

### 1. Install NVM (Node Version Manager)

- **Update your package list:**

```
 sudo apt update
```

<br/>

- **Install NVM:**

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

_Note: Replace v0.35.3 with the latest version if necessary._

<br/>

- **Verify the installation:**

```
nvm --version
```

<br/>

- **Install the latest version of Node.js using NVM:**

```
nvm install node
```

<br/>

### 2. **Install Docker**

- **Add Docker's official GPG key and repository:**

```
sudo apt-get update sudo apt-get install -y ca-certificates curl sudo install -m 0755 -d /etc/apt/keyrings sudo curl -fsSL [https://download.docker.com/linux/ubuntu/gpg](https://download.docker.com/linux/ubuntu/gpg) -o /etc/apt/keyrings/docker.asc sudo chmod a+r /etc/apt/keyrings/docker.asc
```

<br/>

- **Add the Docker repository to Apt sources:**

```
echo \ "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] [https://download.docker.com/linux/ubuntu](https://download.docker.com/linux/ubuntu) \ $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \ sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<br/>

- **Update your package list:**

```
sudo apt-get update
```

<br/>

- **Install Docker packages:**

```
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

<br/>

### 3. **Install Docker Compose**

<br/>

- **Download and install Docker Compose:**

```
sudo curl -L "[https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname](https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname) -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

<br/>

- **Set the correct permissions:**

```
sudo chmod +x /usr/local/bin/docker-compose
```

<br/>

- **Verify the installation:**

```
docker-compose --version
```

<br/>

### 4. **Allow Managing Docker as a Non-Root User**

<br/>

- **Add your user to the Docker group:**

```
sudo usermod -aG docker $USER
```

<br/>

- **Log out and log back in** for the changes to take effect, or run:

```
newgrp docker
```

<br/>

### 5. **Install Xest**

<br/>

- **Install Xest globally using NPM:**

```
npm install -g xest
```

After installing the XEST CLI globally, you can now bootstrap your API.

## Bootstrapping Your API

In order to create your API, you need to run the following commmand:

```bash
$ xx [project-name]
```

With one simple command, you will be installing all the necessary packages, utils, middlewares and required modules will be created for you. Have a look at the created directory.

```bash
$ cd project-name
```

to start your Xest API, run

```bash
$ xx run
```

Et voila! You're ready to Xest :)

The project-name directory will be created, node modules and a few other boilerplate files will be installed, and a src/ directory will be created and populated with several core files, forming a new API-directory with the following setup;

```
├── README.md
├── index.js
├── package-lock.json
├── package.json
├── node_modules
├── migrations
├── test
├── .env
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── database.json
├── jsconfig.json
├── Makefile
├── database
│ ├── database-schema.sql
│ └── seed-data.sql
│ └── docker-compose.yml
│ └── test-database.json
└── src
```

`docker-compose.yml` is our local development environment configuration. When you run your application, a MySQL container will be started for you. You can connect to the local database instance by using the credentials listed in the `docker-compose.yml` file.

`database-schema.sql` is where you will define your database schema. It will be a series of CREATE TABLE statements which is used to populate your local development database.

`seed-data.sql` will contain the test data that you want to insert into your database whilst developing or testing your application locally.
