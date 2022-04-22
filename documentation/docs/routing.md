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

You will be creating your endpoints according to your business logic in this file. You should define endpoints(links) so that users can use them to operate CRUD on the UI.

```js
router.METHOD(PATH, HANDLER)
```

Where:

- router is an instance of XEST framework.
- METHOD is an HTTP request method, in lowercase.
- PATH is the path on the server.
- HANDLER is the function executed when the route is matched.

Now let's have a look at the example below;

```js
router.get("/user-types", getUserTypes);
```

*/user-types* is the route extention of the URL when the request has been sent to that URL.

*getUserType* is the function that does the job to get the user types.

These routing methods specify a callback function (sometimes called “handler functions”) called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

### Routing Methods

- `router.get`
- `router.post`
- `router.put`
- `router.delete`
