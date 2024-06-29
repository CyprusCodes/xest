---
id: aws-deployment
title: Deploy Xest API Project to AWS ElasticBeanstalk
sidebar_label: AWS Deployment
---

**Step 1:** Create an Amazon Web Services account, here: [aws](https://link.com).

To deploy a Xest Project to AWS, Run: 

```
xx deploy
```

Xest CLI will give you options. Choose AWS

```
Starting deployment...
? Select the deployment platform (Use arrow keys)
 Digital Ocean
❯  AWS
```

# setting up a new public hosted zone on Route 53
# setting up a ACM wildcard certificate
# setting up an IAM user with Admin Access and getting creds
# setting the credentials on CircleCI project settings
