---
id: endpoint-generator
title: Endpoint Generator
sidebar_label: Endpoint Generator
---

# Generating a _Endpoint_

One of the advantages of using **XEST** framework is that you can generate your endpoints from your command line with the following command

```bash
$ xx new
```

Xest CLI will take you through a survey to generate your endpoint.

```sh
What would you like to generate? (Use keyboard arrow keys)

// highlight-next-line
▶️ endpoint
▶️ query
▶️ migrations
▶️ seed
```

You can choose which one you would like to generate with the arrow keys, in this case we will be choosing
**GET**

```sh
What type of endpoint will this be?

// highlight-next-line
▶️GET
▶️POST
▶️PUT
▶️DELETE
▶️All of the above
```

After choosing the type of operation you need to choose the table that this endpoint will be based on.

```sh
What will be the main entity for this endpoint?

// highlight-next-line
▶️ users
▶️ user_types
```

After choosing the table you will need to choose if the endpoint should be paginated or not.

```sh
Should GET endpoint be paginated?

▶️ Yes
// highlight-next-line
▶️ No
```

Now You will have to select at least one column from your table to filter by, in this case, let's select user_id.

```sh
Select columns to filter (Must be atleast one filter for GET, PUT, DELETE)
(Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)

// highlight-next-line
◉ user_id
◯ first_name
◯ last_name
◯ email
◯ password
◯ user_type_id
◯ created_at
```

Now let's select the columns that will be included in the response from this endpoint.

```sh
Select columns for response
(Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)

// highlight-start
◉ user_id
◉ first_name
◉ last_name
◉ email
◉ created_at
// highlight-end
◯ password
◯ user_type_id
```

In your `routes.js` file a new route will be created, you can proceed to modify the created controller or add a middleware.

```javascript
// routes.js

// highlight-next-line
router.get("/users", /*- TODO: auth middleware -*/ getUsers);
```

:white_check_mark: **And DONE! Your endpoint has been successfully created.** A new route, controller and action will be created.
