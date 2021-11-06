---
id: developer-tools
title: DevTools Module
sidebar_label: DevTools Module
---

This module has some very useful management tools to manage server resources: 
- [Literals manager](#literals-manager)
- [File manager](#file-manager)
- [SQL extractor](#sql-extractor)

To use this module, follow these steps:

- Add **awe tools dependencies** to pom.xml descriptor.

```xml
<dependencies>
...
  <dependency>
    <groupId>com.almis.awe</groupId>
    <artifactId>awe-tools-spring-boot-starter</artifactId>
  </dependency>
...
</dependencies>
```

- Add the tools module to your `config/library.properties` file:

```properties
# Utilities list
modules.list=...,tools,...,awe
module.awe=awe
...
module.tools=awe-tools
...
```

## `Literals manager`
The *Literal Manager* is a tool that helps managing existing literals in an application. All the available actions and modifications are stored both in memory and in the multiple XML-s. This way, it is not necessary to restart the *Tomcat* server whenever a change is made. Developer will just have to refresh the page in order to display all the changes.

<img alt="lit-man" src={require('@docusaurus/useBaseUrl').default('img/lit-man.png')} />

### Features

1. Search for existing literals.
2. Create new literals.
3. Modify existing literals.
4. Translate literals automatically to other languages.
5. Delete literals.

### Searching existing literals

<img alt="search-lite" src={require('@docusaurus/useBaseUrl').default('img/search-lite.png')} />

You can search by code or literal. The default search language is the same as the application default language, but it can be configured to search by any other *installed* language. By clicking on the search button next to the textfield, all the results appear in the left grid. In order to manage these literals, it is enough to click on any of them to display the details and translations of the chosen word.

### Deleting literals

<img alt="lit-list" src={require('@docusaurus/useBaseUrl').default('img/lit-list.png')} />

This process is completed by selecting the literal that has to be deleted and clicking the delete button.

### Creating literals

<img alt="new-lit" src={require('@docusaurus/useBaseUrl').default('img/new-lit.png')} />

New literals can be created by clicking on the *New* button. A modal view will appear with two inputs, the first one for the literal *code* and the second one to the literal contend in the default or chosen language. The tool generates the translations for all the other existing languages automatically.

### Modifying literals

<img alt="translation-list" src={require('@docusaurus/useBaseUrl').default('img/translation-list.png')} />

In order to modify existing literals, a literal must be chosen from the list displayed on the left grid. The content of the literal appears in the Text / Markdown editor. Markdown is a markup language with plain text formatting syntax designed so that it can be converted to HTML and many other formats. This makes possible to add styles in a simple way.

### Translating literals

#### Text

<img alt="text-trans" src={require('@docusaurus/useBaseUrl').default('img/text-trans.png')} />

#### Markdown

<img alt="markdown-trans" src={require('@docusaurus/useBaseUrl').default('img/markdown-trans.png')} />

Select the origin language in the markdown editor, then select the destination language and click on the translate button. Voilà!

### Launch

To use it, put a link to these windows somewhere in your project menu `public.xml` or `private.xml`.

Example:

``` XML
  <option name="developer" label="MENU_DEVELOPER" icon="paint-brush">
    <option name="path-manager"  label="MENU_PATH" screen="path-manager" icon="italic"/>
    <option name="local-manager" label="MENU_LANGUAGES" screen="local-manager" icon="language"/>
  </option>
```

- Add the directory of your XML files using path window inside developer menu.

<img alt="path" src={require('@docusaurus/useBaseUrl').default('img/path.png')} />

- The specified directory must have these folders

<img alt="folders" src={require('@docusaurus/useBaseUrl').default('img/folders.png')} />

- Example of AWE directory in a local machine

<img alt="path" src={require('@docusaurus/useBaseUrl').default('img/path.png')} />

* This tool is only intended to be used in local machines.

## `SQL Extractor`
SQL Extractor is a tool to execute SQL queries directly over the application database

<img alt="SQL Extractor" src={require('@docusaurus/useBaseUrl').default('img/SQL_Extractor.png')} />


- Add the tools module screens into your `private.xml` file:

```xml
<option name="sql-extractor" label="MENU_SQL_EXTRACTOR" screen="sqlExtractor" icon="database"/>
```

### Run SQL queries with the database in use.

"SQL Extractor can only execute queries. If you want to insert, update or delete call AWE team"


### Save query strings in files.

Choose file name without extension. SQL Extractor will save it in .txt for you. We can only save a query per file. This file will be automatically created in your home directory. "c:/users/{user}/aweFiles/"

<img alt="save_query" src={require('@docusaurus/useBaseUrl').default('img/save_query.png')} />

### Load querie strings from file to relaunch it.

Load files from your home directory "c:/users/{user}/aweFiles/"

<img alt="load_query" src={require('@docusaurus/useBaseUrl').default('img/load_query.png')} />

### READ MODE AND WRITE MODE

By default sqlExtractor screen is in "Read" mode so you can only execute "select" statements. There is a hidden parameter in the screen called "sqlType" that has by default "R", for "Read Mode".

&lt;criteria id="sqlType" component="hidden" value="R" /&gt;


In order to allow some users or profiles to execute statements to modify the database (insert, delete, drop, update) you must change the "sqlType" hidden parameter value to "W" (Write mode) for the sqlExtractor screen in the Screen configuration option.

:::tip

If you want to change the functionality you must overwrite the service as follows:

```XML
  <service id="selectExtract">
    <java classname="com.almis.{project}.services.controller.SqlExtractorController" method="extractData" >
      <service-parameter name="select"   type="STRING"/>
    </java>
  </service>
```

And add your own SqlExtractorController.java and SqlExtractorManager.java thats overwrite the AWE methods.
:::

### Example:

They must start with select(1)

```sql
select(1) INSERT INTO x (columns,...) VALUES (y,...)
```

## `File Manager`

With the file manager you can move, copy, rename, remove, zip, unzip, download and upload files... 

<img alt="filemanager" src={require('@docusaurus/useBaseUrl').default('img/filemanager.gif')} />

To use this tool, follow these steps (after adding the dependency):


- Add the tools module screens into your `private.xml` file:

```xml
<option name="file-manager" label="MENU_TEST_FILEMANAGER" screen="filemanager-test" icon="folder"/>
```

- Create **new screen** with the widget awe-file-manager like `filemanager.xml`
```xml
<screen template="full" label="MENU_TEST_FILEMANAGER"
        xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
        xsi:noNamespaceSchemaLocation='../../sch/awe/screen.xsd'>
  <tag source="center">
      <widget type="awe-file-manager" id="file-manager" style="expand"/>
  </tag>
</screen>
```

- Add this screen as **new menu option** with your own locale and the option file-manager
```xml
    <option name="filemanager-test" label="MENU_TEST_FILEMANAGER" screen="filemanager-test" icon="folder" />
    <option name="file-manager" screen="file-manager" invisible="true"/>
```