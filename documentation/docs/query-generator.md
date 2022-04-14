---
id: query-generator
title: Query Generator
sidebar_label: Query Generator
---

# Generating a `Query`

One of the advantages of using `Xest` framework is that you can generate your queries from your command line with;

```
$ xx new
```

This will ask the user several questions like a survey user is able to answer 1 question every time to form their query.

`What would you like to generate? (Use arrow keys)`

:arrow_forward: query

:arrow_forward: migrations

:arrow_forward: seed

You can choose which one you would like to generate with arrows, in this case `query`, which will ask the following question;

`Choose directory to create a new query file`

:arrow_forward: database

:arrow_forward: src

:arrow_forward: test

Asking which directory, folder you want to build your `query`.

After choosing the directory, then you need to choose the operation type;

`What type of operation will this query perform?`

:arrow_forward: SELECT

:arrow_forward: INSERT

:arrow_forward: UPDATE

:arrow_forward: DELETE

After choosing the type of the operation you need to choose the table that this operation will take on;

`Select a table`

:arrow_forward: migrations

:arrow_forward: users

:arrow_forward: user_types

Choosing the table lets you decide to select which columns you want to involve in this query, and select the columns to filter.

`What is the name of entity queried? `

:arrow_forward: Default: user_types

:heavy_check_mark: And DONE! Your query has been successfully created.
