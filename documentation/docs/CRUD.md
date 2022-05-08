---
id: CRUD
title: CRUD Operations with Xest
sidebar_label: CRUD
---

## Crud Operations

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/13.png "crud")

### File Structure

The pattern of Xest file structure is **routes > controllers > actions > queries**. 

In the `src` folder, you will see `app` and `actions` folders. In the app folder, you will have controller functions, which can be assumed as the brain of the software.

**Router**: The routing mechanism controls which controller receives which requests.

**Controller**: The brains of the application that controls how data is displayed. Controllers are responsible for validating incoming request formats and returning valid responses to the client.

**Action**: This is where all the actions takes place which talk to the database. You will write most of your queries underneath this directory. Actions can be used by a number of different controllers, or anywhere in your application as necessary.

**Query**: This is a SQL query file which uses `submitQuery` and other relevant [database helpers](https://xestjs.com/docs/query-interface) to talk to the database. Query files can be used directly from anywhere in your application or they can be wrapped in action modules.

### Naming Conventions

Xest recommends naming your controller/action/query files depending on the type of CRUD operation you are performing.

| Context      | Controller | Action      | Query       |
| ----------- | ----------- | ----------- | ----------- |
| Creating something      | post       | create | insert |
| Reading some data      | get       | fetch | select |
| Updating some data      | put       | modify | update |
| Deleting some data      | delete       | remove | delete |


### Create

In order to _create_ something within the API e.g user, you need to use *post* for controller, *create* for actions, and *insert* for the query function.

### Read

In order to _read_ something within the API e.g user, you need to use *get* for controller, *fetch* for actions, and *select* for the query function.

### Update

In order to _update_ something within the API e.g user, you need to use *put* for controller, *modify* for actions, and *update* for the query function.

### Delete

In order to _delete_ something within the API e.g user, you need to use *delete* for controller, *remove* for actions, and *delete* for the query function.
