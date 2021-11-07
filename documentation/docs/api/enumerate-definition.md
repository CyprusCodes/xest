---
id: enumerate
title: Enumerate definition
sidebar_label: Enumerate definition
---

Enumerated components are structures to define `label` - `value` lists. They are useful i.e. for translations.

:::info
**Note:** All enumerateds are defined in the `Enumerated.xml` file at **global folder**. View [project structure](../guides/project-structure.md#global-folder)  for more info.
:::

## Enumerated XML structure

Its structure is the next one:

```xml
<enumerated
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation = "https://aweframework.gitlab.io/awe/docs/schemas/enumerated.xsd">

  <group id="[Group Id]">
    <option label="[Option label]"  value="[Option value]" />
    <option label="[Option label]"  value="[Option value]" />
    ... more <option>
  </group>

  ... more <group>
</enumerated>
```

### Enumerated structure


| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| enumerated  | **Required** | No| Root node of the enumerated structure |
| [group](#group-element) | **Required** | Yes | Used to group the options of the enumerated |
| [option](#option-element) | **Required** | Yes | Define each of the `key` - `values` of a group of options |

### Group element

Group element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Group identifier                        | **Note:**  The id name must be unique              |

### Option element

Option element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| label | **Required** | String | The label of the option              | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)              |
| value | **Required** | String | The value of the option| **Note:**  The id name must be unique              |


## Examples

Several examples of enumerated groups:

```xml
<!-- Enumerated YES (0) | NO (1) -->
<group id="Es1Es0">
  <option label="ENUM_NO"  value="0" />
  <option label="ENUM_YES" value="1" />
</group>
```

```xml
<!-- LANGUAGES -->
<group id="LanUsr">
  <option label="ENUM_LAN_ES" value="ESP"/>
  <option label="ENUM_LAN_EN" value="ENG"/>
  <option label="ENUM_LAN_FR" value="FRA"/>
</group>
```

