---
id: CRUD
title: CRUD Operations with Xest
sidebar_label: CRUD
---

## Crud Operations

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/13.png "crud")

### File Structure

The pattern of Xest file structure is actions > controllers > routes.js, it's much easier to understand and apply to any web application.
With this convention,several developers can simultaneously work on the application.

In the `src` folder, you will see `app` and `actions` folders. In the app folder, you will have controller functions, which can be assumed as the brain of the software.

`Action`: Where all the action takes place to talk to the database.

`Controller`: The brains of the application that controls how data is displayed. Controllers are responsible for handling incoming requests and returning responses to the client.

A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests. Frequently, each controller has more than one route, and different routes can perform different actions.

The controller is a UI-level abstraction. Its responsibilities are to ensure request data is valid and be able to choose which result for an API should be returned.

Controller activities may be summarized as follows:

- Gathering input
- Executing the request-related action method
- Preparing view data/response
- Handling Error

In well-factored apps, it doesn't directly include data access or business logic. Instead, the controller delegates to services handling these responsibilities.

`Actions` folder inside `src` is where you can talk to the database, so it’s where the actions take place.

---

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/1.png "crud")

### Create

In order to _create_ something within the API e.g user, you need to use `post` for controller, `create` for actions, and `insert` for the query function.

### Read

In order to _read_ something within the API e.g user, you need to use `get` for controller, `fetch` for actions, and `select` for the query function.

### Update

In order to _update_ something within the API e.g user, you need to use `put` for controller, `modify` for actions, and `update` for the query function.

### Delete

In order to _delete_ something within the API e.g user, you need to use `delete` for controller, `remove` for actions, and `delete` for the query function.
