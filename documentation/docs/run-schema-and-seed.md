---
id: run-schema-and-seed
title: Run Schema and Seeds for Deployed Project
sidebar_label: Run Schema and Seed
---

**Step 1:** Copy your connection details from your database configuration (as stated previously in step 5). It should look like this:

```
username = doadmin
password = *****************************
host = xxxxxxxxxxx.ondigitalocean.com
port = your_port
database = database_name
sslmode = REQUIRED
```

**Step 2:** Open your database manager. In this example, we use Beekeeper. Use your connection details to log in. It should look like this:

<img style={{ margin: "20px 20px", }}
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/beekeeper_1.png')}
/>

**Step 3:** Copy your database schemas from your Xest project and run them. It should look like this:

<img style={{ margin: "20px 20px", }}
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/beekeeper_2.png')}
/>


**Step 4:** Copy your seed data from your Xest project and run it. It should look like this::

<img style={{ margin: "20px 20px", }}
    alt="Xest Logo"
    width="70%"
    src={require('@docusaurus/useBaseUrl').default('img/beekeeper_3.png')}
/>