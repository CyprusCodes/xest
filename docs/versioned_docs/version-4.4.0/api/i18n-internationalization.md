---
id: i18n-internationalization
Title: I18N (Internationalization)
sidebar_label: I18N (Internationalization)
---

AWE implements a i18n system for internationalization of web applications. For this reason, AWE uses locale files containing literals in different languages.

Also you can add `CDATA` tag inside local in **markdown** language to show rich text. Very useful when you want to show a lot of formatting information. For example in the help screen application. You can view all markdown syntax in [this](https://wiki.almis.com/help/markdown/markdown) page.

:::info
**Note:** All locales are defined in the `Locale-[Country code].xml` files at **locale folder**. The country codes must be two capital letters.  View [project structure](../guides/project-structure.md#global-folder)  for more info.
:::

## Locales XML structure

The full locale structure is the next one:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<locales xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://aweframework.gitlab.io/awe/docs/schemas/locale.xsd">
  <locale name="[locale-name]" value=[locale-value]" />
    <![CDATA[ Markdown content ]]>
  <locale name="[locale-name]" value=[locale-value]">
  </local>
  ... (More <locale>)
</locales>
```

### Locales structure


| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| locales| **Required** | No | Root node of locales structure |
| [locale](#locale-element) | **Required** | Yes | Used to define a locale translate |


### Locale element

Locale element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| name | **Required** | String | The name of the locale           |   |
| value | Optional | String | The value of the locale, the language translation of the text          | **Note:** You can set values as variables with syntax {0} {1} ...  |
| markdown | Optional  | String | The value of the locale. It will be translated as markdown | |

## Examples

Some examples of locales in different languages:



**File Locale-EN.xml**
```xml
<locales xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://aweframework.gitlab.io/awe/docs/schemas/locale.xsd">
  <locale name="BUTTON_ACCEPT" value="Accept" />
  <locale name="CONFIRM_MESSAGE_DELETE" value="You will delete the selected records. Do you agree?" />
  <locale name="ERROR_MESSAGE_BAD_QUEUE_REQUEST_DEFINITION_FORMAT" value="Bad request definition format for queue {0}" />
  ...
</locales>
```



**File Locale-ES.xml**
```xml
<locales xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://aweframework.gitlab.io/awe/docs/schemas/locale.xsd">
  <locale name="BUTTON_ACCEPT" value="Aceptar" />
  <locale name="CONFIRM_MESSAGE_DELETE" value="Vas a borrar el registro seleccionado. ¿Estás de acuerdo?" />
  <locale name="ERROR_MESSAGE_BAD_QUEUE_REQUEST_DEFINITION_FORMAT" value="El formato de la petición a la cola {0} es erróneo" />
  ...
</locales>
```



**File Locale-FR.xml**
```xml
<locales xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://aweframework.gitlab.io/awe/docs/schemas/locale.xsd">
  <locale name="BUTTON_ACCEPT" value="Accepter" />
  <locale name="CONFIRM_MESSAGE_DELETE" value="Donnees selectionees vont etre effacees. Etes vous d&apos;accord?" />
  <locale name="ERROR_MESSAGE_BAD_QUEUE_REQUEST_DEFINITION_FORMAT" value="Le format du message pour l&apos;envoy à la queue {0} n&apos;a pas été définie" />
  ...
</locales>
```



**Locale example with markdown CDATA used in help text criteria**
```xml
<locale name="HELP_SCREEN_TITLE_SIT">
<![CDATA[
Manage application sites. Here you can view, add, delete and modify all application sites.

A site is defined as a *separated application node*, with it's own databases and modules.
]]>
</locale>
```