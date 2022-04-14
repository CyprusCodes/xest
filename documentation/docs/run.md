---
id: run
title: Running a Project
sidebar_label: Running a project
---

# Running The Project

To run the project within `Xest` framework;

```
$ xx run
```

Which should start the docker, set up the database schema and start the project giving the following output;

```
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

- If your project didn't start or gives an error like this

  `Docker is currently not running. Please start Docker and repeat xx run again.`

  restart your `Docker`.

### Stop the project

If at any point you want to stop the project, such in case of updating the `seed-data.sql`, you can do with going into your `terminal` and pressing `ctrl + c`.

This will stop your `docker`, API and the MYSQL container.
