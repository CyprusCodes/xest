---
id: authorization
title: Authorization Middleware
sidebar_label: Autherization
---

Authorization is the process of verifying what specific applications, files, and data a user has access to.
Once the authentication process has been confirmed, authorization is then used to grant the user permission to access different levels of information and perform specific functions, depending on the rules established for different types of users.

Xest has a ready to be used Authorisation middleware function which allows you to grant different permissions for different user types.

Once a user is authenticated, the user type of the user is checked with the query wrapped in the Authorization middleware function and once the user's type is authenticated for the request, the user can access the data they need and perform specific functions such as adding, deleting or modifying information.

```js
router.post(
  "/register",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);
```

The endpoint **#POST/register** that comes with XEST is a good example of authorization. After the authentication, only user type Admin is authorized to register a new user to the database. According to the project’s requirements more than one user type can be assigned for this task and the roles should be specified when writing the endpoint.
