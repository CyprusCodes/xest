---
id: scheduler
title: Scheduler Module
---

Scheduler module adds a powerful scheduling tool to your application

To activate this module, follow this steps:

- Add **awe scheduler dependencies** to pom.xml descriptor.

```xml
<dependencies>
...
  <dependency>
    <groupId>com.almis.awe</groupId>
    <artifactId>awe-scheduler-spring-boot-starter</artifactId>
  </dependency>
...
</dependencies>
```

- Add the scheduler screens into your `private.xml` file:

```xml
<option name="scheduler" label="MENU_SCHEDULER" icon="clock-o">
  <option name="scheduler-management" label="MENU_SCHEDULER_MANAGEMENT" screen="scheduler-management" icon="cogs"/>
  <option name="scheduler-tasks" label="MENU_SCHEDULER_TASKS" screen="scheduler-tasks" icon="tasks">
    <option name="new-scheduler-task" screen="new-scheduler-task" invisible="true" />
    <option name="update-scheduler-task" screen="update-scheduler-task" invisible="true" />
  </option>
  <option name="scheduler-servers" label="MENU_SCHEDULER_SERVERS" screen="scheduler-server" icon="server">
    <option name="new-scheduler-server" screen="new-scheduler-server" invisible="true" />
    <option name="update-scheduler-server" screen="update-scheduler-server" invisible="true" />
  </option>
  <option name="scheduler-calendars" label="MENU_SCHEDULER_CALENDARS" screen="scheduler-calendars" icon="calendar">
    <option name="new-scheduler-calendar" screen="new-scheduler-calendar" invisible="true" />
    <option name="update-scheduler-calendar" screen="update-scheduler-calendar" invisible="true" />
  </option>
</option>
```

- Add the scheduler module to your `config/library.properties` file:

```properties
# Utilities list
modules.list=...,scheduler,...,awe
module.awe=awe
...
module.scheduler=awe-scheduler
...
```

- Finally, if you are using `flyway`, add the scheduler tables into the migration module:

```properties
awe.database.migration.modules=AWE,...,SCHEDULER,...
```