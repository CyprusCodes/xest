---
id: installation
title: Installation
sidebar_label: Installation
---

You should install the XEST CLI first then start working on your project.

To install XEST CLI;

```bash
$ npm install xest -g
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
