---
id: routing
title: Routing
sidebar_label: Routing
---

Routing refers to how an application’s endpoints (URIs) respond to client requests.

```js
└── src
 └── routes.js
```

You define routing using methods that correspond to HTTP methods; for example, route.get() to handle GET requests and route.post to handle POST requests.

You will be creating your endpoints according to your business logic in this file. You should define endpoints so that users can use them to operate CRUD actions.

```js
router.METHOD(PATH, HANDLER)
```

Where:

- router is an instance of Expressjs framework.
- METHOD is an HTTP request method, in lowercase.
- PATH is the path for the endpoint.
- HANDLER is the function executed when the route is matched.

Now let's have a look at the example below;

```js
router.get("/user-types", getUserTypes);
```

`/user-types` is the route extension of the URL

`getUserTypes` is the function that does the job to get the user types.

These routing methods specify a callback function (sometimes called “handler functions”) called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

### Common Routing Methods

- `router.get`
- `router.post`
- `router.put`
- `router.patch`
- `router.delete`

Please refer to [routing section on ExpressJS documentation](https://expressjs.com/en/guide/routing.html) to learn more about how to configure your API endpoints.
