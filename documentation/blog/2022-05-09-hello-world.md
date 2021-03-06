---
title: Hello world
author: Ersel Aker
author_title: Software Engineer, Entrepreneur
author_url: https://github.com/ersel
author_image_url: https://pbs.twimg.com/profile_images/1196181489723031555/nQd1zqg3_400x400.jpg
tags: [xest, hello-world]
---

<img style={{ width: "50%", margin: "10% 25%", padding: "50" }} 
    alt="Xest Logo" 
    src={require('@docusaurus/useBaseUrl').default('img/xest-icon.png')}
/>

It's always a great feeling to see an idea to see the light of day after a long ardous journey of taking it from conception to concrete reality.

I've been building Xest for the best part of last 3 years. It was conceived at [JustFulfil, an ecommerce fulfiment startup](https://www.justfulfil.com/) I've founded in 2019. I started pulling together best parts of the Nodejs ecosystem available, also built bespoke tools and utilities around it. These utilities ranged from database query helpers, testing infrastructure, local dev environment, email template rendering, serverless functions with rolling deployments, async task scheduling systems, and many others as the company's needs grew over time. 

JustFulfil was a bootstrapped startup with a small engineering team of only 3 people including me. Engineers working alongside me were my previous students from [ManchesterCodes coding bootcamp](https://www.manchestercodes.com/), although capable and smart; they were new to building production services. 

These circumstances heavily influenced the design decisions went into building our API architecture. I wanted to build something that enabled developers to get up and running quickly, and become productive from Day 1. I didn't concern myself with engineering fancies such as type safety, clean code, or any other malarkey you can find in an extreme programming workshop. My concerns were 
1. are we building fast enough?
2. whether what we built is working reliably?

Since its inception, I've used Xest with my other consulting clients. We also started to teach it to our students at Cyprus in the past year. It is currently serving tens of thousands of API requests per day across multiple companies.

Enough story time, let me give you a technical overview of what Xest is and what it is currently capable of doing.

Xest is an opinionated Express API boilerplate. It comes pre-configured with:

+ managing your local development workflow with Docker
+ testing your API endpoints
+ managing database migrations
+ communicating with your database through SQL query helpers/decorators

Xest also ships with its own CLI util available under the alias `xx`. Xest CLI is now capable of generating CRUD queries, database migrations, seed data for your tables. I am planning to add full endpoint and endpoint schema generators soon.

In near future, Xest will be integrated with AWS Fargate, AWS Lambda and as a datastore it'll be leveraging the [PlanetScale platform](https://planetscale.com/) -- so keep watching this space! :rocket:

You can get up and running with Xest straight away by installing the Xest CLI to bootstrap an API.

```
npm i xest -g
xx my-test-api
cd my-test-api 
xx run
```

Feel free to give it a go and let me know what you think :)

Until next time,
E

