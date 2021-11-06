---
id: context-menu
title: Context menu
---

Awe engine allows define context menu inside a grid, criterias or charts. With these menus, you can add functionality to your window.

<img alt="GridContextMenu" src={require('@docusaurus/useBaseUrl').default('img/GridContextMenu.png')} />

## Xml structure

The xml structure of context menus is the following:

```xml
<context-button id="[Id]" label="[label]" icon=[icon]">
  <context-button id="[Id]"  label="[label]" icon=[icon]>
    <button-action type="[action-type]" target="[target]" silent="[silent]" />
  </context-button>
    <context-button id="[Id]"  label="[label]" icon=[icon]>
      <button-action type="[action-type]" target="[target]" silent="[silent]" />
    </context-button>
    <context-separator/>
    <context-button id="[Id]"  label="[label]" icon=[icon]>
      <button-action type="[action-type]" target="[target]" silent="[silent]" />
      ... more button actions
    </context-button>
    <dependencies/>
    .. more context-button
    .. more context-separator
  </context-button>
  .. more context-button
  .. more context-separator
</context-button>
```

## Context menu elements

| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| [context-button](#context-button-attributes) | **Required** | Yes | Context button element of the menu. Defines one element of the context menu |
| [button-action](#button-action-attributes) | **Required** | Yes | Action of the context button. You can define a list of button actions |
| [context-separator](#context-separator-attributes) | Optional | Yes | Separator line of context button list |
| [dependency](dependencies.md) | Optional | Yes | List of dependencies attached to the button |

### Context button attributes

| Name |  Type | Use | Description     | Values |
| ------ | -------| ---------------------- | ----------------------------------|---------------------------------------- |
|`id`| String | **Required** | Context button identifier ||
|`label`| String | **Required** | Label of the context button. | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
|`icon` | String | Optional | Icon name of the context button | **Note:** You can check all iconset at [FontAwesome](http://fontawesome.io/icons/)  |

> **Note:** The context button has the same attributes as button element. You can see more info [here](button.md#button-attributes)

### Button action attributes

> **Note:** You can see all attributes of `button-action ` [here](button.md#button-actions)

### Context separator attributes

| Name |  Type | Use | Description     | Values |
| ------ | -------| ---------------------- | ----------------------------------|---------------------------------------- |
|`name`| String | Optional | Context separator identifier ||

## Examples

- Context menu inside a grid

```xml
<grid id="GrdSta" style="expand" initial-load="query" server-action="data" target-action="QryUniTst" max="30">
  <column label="PARAMETER_TEXT" name="Als" sort-field="Als" align="left" charlength="20" style="separator" />
  <group-header name="GrpHeaCol" label="PARAMETER_TEXT">
    <column label="PARAMETER_TEXT" name="Des" sort-field="Des" align="left" charlength="40" />
    <column label="PARAMETER_TEXT" name="Prg" sort-field="Prg" align="center" charlength="40" 
            component="progress" value="50" server-action="data" target-action="QryChkPrg" />
  </group-header>
  <context-button id="CtxGrdStaAdd" label="BUTTON_NEW" icon="plus-circle" >
    <button-action type="screen" target="matrix_test" />
    <dependency target-type="show" initial="true">
      <dependency-element id="GrdSta" column="Als" attribute="selectedRowValue" condition="!=" value="awemadora02" />
      <dependency-element id="GrdSta" event="select-row" />
    </dependency>
  </context-button>
  <context-button id="CtxGrdStaDel" label="BUTTON_DELETE" icon="trash">
    <button-action type="screen" target="matrix_test" />
    <dependency target-type="show" initial="true">
      <dependency-element id="GrdSta" column="Als" attribute="selectedRowValue" condition="==" value="awemadora02" />
      <dependency-element id="GrdSta" event="select-row" />
    </dependency>
  </context-button>
</grid>
```
