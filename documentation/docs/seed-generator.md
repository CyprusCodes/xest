---
id: seed-generator
title: Seed Generator
sidebar_label: Seed Generator
---

# Generating a *Seed*

One of the advantages of using **XEST** framework is that you can generate your seed data from your command line with;

```
$ xx new
```

This will ask the user several questions like a survey user is able to answer 1 question every time to form their query.

---
:question: What would you like to generate? (Use arrow keys)

:arrow_forward: query

:arrow_forward: migrations

:arrow_forward: seed

You can choose which one you would like to generate with arrows, in this case `seed`, which will ask the following question;

---
:question: Select a table

:arrow_forward: migrations

:arrow_forward: users

:arrow_forward: user_types

Choosing the table lets your seed-data to be entered in the selected table.

In the **XEST** framework there is an option to link two tables, which you can do from your command line after choosing your first table **XEST** framework asks you;

---
:question: Would you like to seed another table? (Y/N)

If you want to seed another table you can type **Y** and press enter, if not type **N** and press enter.

If **Y**, it asks you which table you would like to select, apart from the one selected before.

---

Then asking

:question: How many seed records do you want to create?(1)

This will generate optional seed generators for each column. It will migrate a dummy seed data within your database, which you can test from your MYSQL Workbench or BeeKeeper Studio.

Once happy copy and paste it to the `database/seed-data.sql` file.
