---
id: use-mysql
title: Uses MySQL
sidebar_label: Uses MySQL
---

### Uses of MySQL with Xest

In this framework docker runs MySQL server in a container, when the following command is run on your terminal/command line interface;

```
$ xx run
```

## Set up a new connection with MySQL Workbench

If you want to manage, design, alter your database data you can set up a connection with Workbench, in which the details you need are stored under `docker-compose.yml` file. All the necessary information that you need to create the connection between your project and MYSQL Workbench is given within this file.

In order to write and read data from a table, that table needs to exist. Luckily **Xest** framework already have a script that connects to our database server before our app runs.
