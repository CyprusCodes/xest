---
id: mysql
title: MySQL
sidebar_label: MySQL
---

# MySQL

Xest framework uses *MySQL* within *Docker*. This means you don't need to install MySQL separately to your development machine.

When you start your Xest project with `xx run` or `xx fresh` commands, your database is automaticaly architectured and populated with the seed data using `database-schema.sql` and `seed-data.sql` files.

## Xest VSCode MySQL Plugin
Xest ships with built-in helpers to construct MySQL queries using JavaScript ES6 template literals. We have also built a VSCode extension to support syntax highlighting within these blocks. You can download and [install the plugin from here.](https://github.com/ersel/vscode-mysql-tagged-templates/blob/master/vscode-mysql-tagged-templates-0.0.26.vsix?raw=true)

<img alt="Install VSCode MySQL extension" src={require('@docusaurus/useBaseUrl').default('img/install-vsix.gif')} height="400px" />

## Database Management Tools

Even though you do not need to download MySQL, in order to architect your database we suggest you download either [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or [BeeKeeper Studio](https://www.beekeeperstudio.io/get) database management applications.
