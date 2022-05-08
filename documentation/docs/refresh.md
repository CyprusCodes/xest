---
id: refresh
title: Refreshing the Database
sidebar_label: Refreshing the Database
---

# Refreshing the project

From time to time, you might need to make changes to your database architecture by modifying the `database-schema.sql` or you might want to update your test data by modifying the `seed-data.sql`. After making such changes, you'll need to refresh the state of your MySQL database container with the following command.

```bash
$ xx fresh
```

This will restart the Xest API project and re-initialize your MySQL docker container from the ground up.
