---
id: menu
title: Menu definition
sidebar_label: Menu definition
---

Navigation menu for an AWE application is defined in XML files. The two menu XML files are:
* **public.xml:** Contains the public screens (those who can be accessed without log into the system).
* **private.xml:** Screens inside the log protection

:::info
**Note:** All menu XML descriptors are defined at **menu folder**. View [project structure](../guides/project-structure.md#menu-folder) for more info.
:::

## Menu structure

The menu files must have the following skeleton:

```xml
<menu screen="[initial-screen]" context="[default-context]" default-action="[default-action]">
</menu>
```

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| screen | **Required**| String | Is the default screen that will be showed at beginning |  |
| context| Optional | String | Is the context where all the options will be launched (if an specific context is not defined) |   See [contexts](#contexts) |
| default-action | Optional | String | Is the action that all the options will call (if an specific action is not defined) |  |

There is a new tag too to define the position, and the menu type inside a screen: menu-container:

```xml
<menu-container type="[orientation]"/>
```

Where [orientation] can be vertical or horizontal. Another way to change the menu type is selecting the initial menu screen in private.xml file: 

```xml
<menu screen="HomHor"…
```

For horizontal menu

```xml
<menu screen="HomVer"…
```

For vertical menu

### Contexts

The [context](#menu-structure) attribute defines **where** are the options defined inside the menu going to be launched. There are several defined context which can be used depending on the menu type:

| Context path          | Menu     | Description                                                 |
| --------------------- | -------- | ----------------------------------------------------------- |
| `screen`              | public   | Useful for a single login page without menu                 |
| `screen/public/home`  | public   | This context is used when the main page must have a menu. In this case the parameter `screen.configuration.home` must **not** be empty, as this will be the screen showed inside the menu. The menu container initial screen will be the one defined on the menu screen attribute |
| `screen/private/home` | private  | This context will be used when logging on application. In this case the parameter `screen.configuration.information` must **not** be empty, as this will be the screen showed inside the private menu (when the user and the profile haven't any initial screen definition). The menu container initial screen will be the one defined on the menu screen attribute   |

## Options structure

This is a set of options skeleton code:

```xml
<option module="[module]" name="[Option name]" label="[Option label] icon="[Icon option]">
  <option name="[Option name]" label="[Option label]" screen="[Screen name]"/>
  ---
</option>
---
<option/>
```

Inside the tools option there are a set of options, some of them are 'invisible'. It is necessary to define all the screen the user can access, because if a screen is not defined in the menu it will not be accessible to any user. Also, you can add options inside options, making a multilevel menu.

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| name | **Required**| String | Is the option name, which is used in the profile files and AweScrRes to restrict an option access. If a parent option is restricted, all children are restricted too|  |
| screen | Optional | String | Describes the screen that will be accessed when the user clicks on the option |  |
| label | Optional | String | Is a literal which contains the option name | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| module | Optional | String | Defines the module name. Now you can set different menu options for each module | These module names must be configured in table AweMod and it must be the session variable module |
| separator| Optional | Boolean | If set to true, the option is converted into a separator line | Default value is `false`|
| icon | Optional | String | Defines an icon which will be shown before the option label | You can view the whole icon list [here](http://fortawesome.github.io/Font-Awesome/icons/) |

## Examples

```xml
<menu screen="home_horizontal" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:noNamespaceSchemaLocation = "../../sch/menu.xsd" context="screen/home" default-action="screen">
  <option name="information" screen="info" invisible="true" />
  <option module="Inf" name="information_restricted" screen="info" invisible="true" />
  <option module="Inf Changed" name="information_restricted_changed" screen="info" invisible="true" />
  <option name="tools" label="MENU_TOOLS" icon="wrench">    
    <option name="themes" label="MENU_TOOLS_THEMES" screen="Thm" icon="picture-o"/>
    <option name="new_theme" screen="ThmNew" invisible="true" />
    <option name="update_theme" screen="ThmUpd" invisible="true" />
    <option name="view_theme" screen="ThmViw" invisible="true" />
    <option name="security" label="MENU_TOOLS_SECURITY" icon="unlock-alt">
      <option name="screen_access" label="MENU_TOOLS_SCREENS_ACCESS" screen="ScrAccRes" icon="eye-slash"/>
      <option name="encrypt_tools" label="MENU_TOOLS_SCREEN_ENCRYPT" screen="ScrEncTxt" icon="lock"/>
    </option>    
  </option>
  <option name="HlpSep" separator="true"/>
  <option name="help" label="MENU_HELP" icon="question-circle">
    <option name="user_help" label="MENU_USER_HELP" screen="Hlp" icon="question"/>
    <option name="application_help" label="MENU_HELP_APPLICATION" screen="AppHlp" icon="question"/>
    <option name="application_info" label="MENU_APP_INF" screen="ViwAppInf" icon="info"/>
  </option>
</menu>
```