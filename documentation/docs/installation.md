---
id: installation
title: Installation
sidebar_label: Installation
---

You should install the XEST framework first then start on working in your project.

To install XEST framework;

```bash
$ npm install xest -g
```

After installing the XEST framework globally to your computer, you can now create your API directory.

## Create Your API Directory

In order to create your API directory you need to do the following commmand:

```bash
$ xx [project-name]
```

With one simple command, you will be installing all the necessary packages, utils and middlewares created for you.
and creating your api. Have a look at the created directory. Type;

```bash
$ cd project-name
```

&&

```bash
$ xx run
```

to begin.

The project-name directory will be created, node modules and a few other boilerplate files will be installed, and a src/ directory will be created and populated with several core files, forming a new API-directory with the following setup;

```js
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

Docker.compose.yml is our config file that will speak to our database. When you run your application, at the start time your config files will be read. Only thing left for you now is to view your created database on your SQL Workbench where you can query, design, & edit databases. Set a new connection with the given details on the .yml file!

.sql files are your configuration files as well, you will create your tables at database-schema.sql, a schema sets out the structure of how data will be stored in our database and insert data in seed-data.sql.
