---
id: query-generator
title: Query Generator
sidebar_label: Query Generator
---

# Generating a *Query*

One of the advantages of using **XEST** framework is that you can generate your queries from your command line with the following command

```bash
$ xx new
```

Xest CLI will take you through a survey to generate your query. 

```
What would you like to generate? (Use keyboard arrow keys)

▶️ query
▶️ migrations
▶️ seed
```

You can choose which one you would like to generate with arrows, in this case `query`, which will ask the following question next


```
Choose directory to create a new query file

▶️ database
▶️ src
▶️ test
```

You can choose the directory you want to create your query module. You can expand subdirectories using the right arrow key → on your keyboard. Once you've identified the directory you want to create the query file in, simply press enter to continue.

After choosing the directory, then you need to choose the type of operation

```
What type of operation will this query perform?

▶️ SELECT
▶️ INSERT
▶️ UPDATE
▶️ DELETE
```

After choosing the type of the operation you need to choose the table that this operation will be applied on.

```
Select a table

▶️ users
▶️ user_types
```

Choosing the table lets you decide which columns you want to select as part of this query, and if you want to apply any filtering logic.

Finally, you'll be asked about to give a name to the entity queried. You can leave this as default, if you want to continue with the table name.

```
What is the name of entity queried?

▶️ Default: user_types
```

:white_check_mark: **And DONE! Your query has been successfully created.** You can open the generated query file in your code editor and investigate the output and make further changes if necessary.