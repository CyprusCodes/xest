---
id: database-migration
title: Database migration
---

AWE uses [Flyway](https://flywaydb.org/) as default tool for database script version control.

<img alt="flyway-logo" src={require('@docusaurus/useBaseUrl').default('img/flyway-logo.png')} />

Aside from using it internally to manage the `AWE database model`, you can manage your own scripts or use any other external tool.

# **Get started**

To automatically run Flyway database migrations on AWE startup, add `spring.flyway.enabled=true` properties in your configuration. Typically, migrations are from scripts in the form `<MODULE>_V<VERSION>__<NAME>.sql` (with `<VERSION>` an underscore-separated version, such as ‘1.1’ or ‘2_1’).

```properties
spring.flyway.enabled=true
```

By default, they are located in the folder `classpath:db/migration/{vendor}`, but you can modify that location by setting `spring.flyway.locations`. This is a comma-separated list of one or more classpath: or filesystem: locations. For example, the following configuration would search for scripts in both the default classpath location and the `/opt/migration` directory:

```properties
spring.flyway.locations=classpath:db/migration/{vendor},filesystem:/opt/migration
```

Rather than using `db/migration`, the preceding configuration sets the folder to use according to the type of the database (such as db/migration/mysql for MySQL). The list of supported databases is available in `DatabaseDriver`.

AWE framework customizes the *Flyway migration process* to manage multiple modules. By default, the initial module is called *AWE* but you can add the modules you need to run scripts. For example, if you need to use `AWE scheduler module` and you have that sql scripts in your applications, you need configure like this:

```properties
# List of modules to migrate. 
awe.database.migration.modules=AWE,SCHEDULER,APP
```

> **Note:** remeber call your sql scripts with the same name as the configured module. Ex.: `APP_V1.0__Init_schema.sql`