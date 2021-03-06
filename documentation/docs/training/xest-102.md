---
id: xest-102
title: XEST-102 MUSIC API 
sidebar_label: XEST-102 MUSIC API 
---

In this tutorial we will learn how to create your first API directory for a MUSIC library.

## Creating Tables

Once you have downloaded the framework and formed your directory, you can start with creating your tables needed for your library.
The easiest way to create your tables is within your `database-schema.sql` file.

Now you should generate your tables. You need 3 tables for this activity;

1. Artists
2. Albums
3. Songs

Lets start with the ARTISTS table.

Your ARTISTS table will consist of **artist_id**, **name** and **genre**, where the **artist_id** will be auto incremented and will be the primary key.

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/8.png "tables")

Once you have created your ARTISTS table, you should stop the API from the terminal and restart it with the following command;

```bash
xx fresh
```


Now you should be able to see your Artist table in your MySQL Workbench or BeeKeeper Studio but it is empty. (If you do not see it, make sure you have no sql syntax error).

Here we are selecting the database that has just been created, then creating an **Artist** table with **id**, **name** and **genre** columns.

The **id** column is configured to be the primary key, and also automatically assigns a number to each new record.

---

### Add DATA To Your Table

In order to add data into your table, you will use seed-data-sql.

Lets insert your favourite three artists into your table.

Since the seed data has been altered you should stop your api and refresh,

so that you will be able to see all the artists you added to the table.