---
id: run
title: Running a Project
sidebar_label: Running a project
---

# Running The Project

To run a Xest API project, run the following command in the project directory

```bash
$ xx run
```

Which should start the MySQL docker container, set up the database schema, populate the database with seed data, and start the nodejs server process giving the following output:

```bash
Creating network "database_default" with the default driver
Creating volume "database_vol-project-name-db" with default driver
Creating project-name-mysql-db ...
Creating project-name-mysql-db ... done
Waiting for MySQL Container to become ready. This should only take a few seconds.
Setting up your database schema.
Populating database with seed data.
mysql: [Warning] Using a password on the command line interface can be insecure.
mysql: [Warning] Using a password on the command line interface can be insecure.
Starting project-name API project

> project-name@1.0.0 dev
> nodemon app.js

[nodemon] 1.19.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js index.js`
[INFO] API listening on port 3001!
```

If everything goes well, you should see a message saying `API listening on port 3001!`

:::caution

If you see a warning in your terminal saying **Docker is currently not running.** You'll need to start the Docker application on your computer and run `xx start` again.

:::

### Stopping the Xest API

If at any point you want to stop the project, you can do it by going to your terminal and pressing **ctrl + c** keys.

This will stop your Nodejs API and the MySQL docker container.
