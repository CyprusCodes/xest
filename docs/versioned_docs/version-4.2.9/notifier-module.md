---
id: notifier
title: Notifier Module
---

The notifier module allows your users to subscribe to notifications in your application.

## Steps to use it

To use this module, the following steps are necessary:

- Add **awe notifier dependencies** to pom.xml descriptor.

```xml
<dependencies>
...
  <dependency>
    <groupId>com.almis.awe</groupId>
    <artifactId>awe-notifier-spring-boot-starter</artifactId>
  </dependency>
...
</dependencies>
```

- Add the notifier screens into your `private.xml` file:

```xml
<option name="user-settings" screen="user-settings" invisible="true"/>
<option name="notifier" label="MENU_NOTIFIER" icon="flash">
  <option name="subscriptions" screen="subscriptions" label="MENU_NOTIFIER_SUBSCRIPTIONS" icon="ticket">
    <option name="new-subscription" screen="new-subscription" invisible="true" />
    <option name="update-subscription" screen="update-subscription" invisible="true" />
  </option>
  <option name="notifications" screen="notifications" label="MENU_NOTIFIER_NOTIFICATIONS" icon="bell" />
</option>
```

- Include the notifier tool into the `home_navbar.xml` file:

```xml
<tag type="ul" style="nav navbar-nav pull-right right-navbar-nav">
  ...
  <include target-screen="notification-panel" target-source="notification-panel"/>
  ...
</tag>
...
<info id="ButUsrAct" icon="user" initial-load="query" target-action="connectedUser">
  ...
  <include target-screen="notification-panel" target-source="user-settings"/>
  ...
</info>
```

- Add the notifier module to your `config/library.properties` file:

```properties
# Utilities list
modules.list=...,notifier,...,awe
module.awe=awe
...
module.notifier=awe-notifier
...
```

- Finally, if you are using `flyway`, add the notifier tables into the migration module:

```properties
awe.database.migration.modules=AWE,...,NOTIFIER,...
```