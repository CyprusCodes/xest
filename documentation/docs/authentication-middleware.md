---
id: authentication
title: Authentication Middleware
sidebar_label: Authentication
---

Xest provides a boilerplate middleware function for securing endpoints called Authentication, it helps to verify who the user is and ensures the senders are who they say they are.

JSON Web Tokens- jwt library is used for the authentication middleware function and once a user logs in (POSTs login credentials) JSON Web Token (JWT) will be sent to the user. The request will include a security token provided by jwt library that will allow the user to access routes, services and resources.

These tokens generated will then be sent on every HTTP request, which will allow the server to authenticate the user every time. For integrity, information contained in the token is signed by a private key, owned by the server.

The endpoint **#PUT/edit/user** within XEST is a good example of authentication;

```js
router.put("/edit/user", authentication, putUserDetails);
```

The server's protected routes will check for a valid JWT at the Authorization header, and if it's present, the user will be allowed to access protected resources.
UserId will be encrypted from the token in the header and with this process a user with different userId will not be allowed to edit user’s details.

UserId encrypted from the header will only give access to that specific user to modify user details, to be able to read userId in the contoller function, it should be called as below;

```js
const { userId } = req.user;
```
