# Xest Framework

![xest-logo](https://user-images.githubusercontent.com/1476886/147765281-e871657c-37a8-495d-b08b-c5dccf6334c3.png)

# To install globally

`npm i xest -g`

# To install on Ubuntu

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

# Quick Start

### After installing xest framework globally; you can create your api with one simple command

`xx <app-name-goes-here>`

The above command will create your new api project then install requied packages and start your database.
Please note in the project directory you will find many usefull utils, packages and middlewares.

You can start building your costum database architecturefrom `database-schema.sql`. Please remember to alter your `seed-schema.sql` accordingly to match with your database. This will automatically write your mock data into database in the following steps.

#### Now you are ready to start writing your endpoints.

Please note xest framework has already got a few endpoints prepared for you to get you going. just start looking for users in the route.js file and follow upto query to get the idea.

## Run the project.

`xx run`

## Refresh your database & Run the project

`xx fresh`

# Using the xest CLI to build your endpoints

Xest framework gives you the flexibility to write your routes, controllers actions and query by using cli.
It will aitomaticaly create the

## Building your sql query

Start building your queries by writing the following command in your cli and pick the required options.

`xx new`

## Building database-schema seed queries

Generate your mock data by writing the following command in your cli and pick the required options.

`xx new` ->seed
