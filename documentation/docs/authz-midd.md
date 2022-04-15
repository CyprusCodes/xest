---
id: authz-midd
title: Autherisation Middleware
sidebar_label: Autherisation Middleware
---

Autherisation middleware uses **jwt** token, which is jsonwebtoken.

Once a user is logged in to your API, each subsequent request will include the JWT, to allow user to access services, routes and resources which are limited to that assigned token.
