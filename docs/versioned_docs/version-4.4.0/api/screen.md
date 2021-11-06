---
id: screen
title: Screen Element
---

The `screen` is the container tag for all screen components. In this tag you have to define the JSP `template` the screen is going to render, the screen title (`label`), and some other features like the `target`, which is a list of queries to launch that will fill the criteria values.

## XML skeleton

The basic structure of a screen XML is the next one:

```xml
<screen template="[template]" label="[screen-title-literal]" keep-criteria="[keep-criteria]" 
 target="[query-targets]" onload="[manintain-onload]" onunload="[maintain-onunload]"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:noNamespaceSchemaLocation="[schema-location]">
  <tag source="[source1]">...</tag>
  <tag source="[source2]">...</tag>
</screen>
```

## Screen structure

For easier development of graphics, not all labels are required.

| Element                      | Use          | Multiples instances    | Description                          |
| ---------------------------- | -------------|------------------------|--------------------------------------|
| [screen](#screen-attributes) | **Required** | No                     | Screen container                     |
| [tag](tags.md)               | Optional     | Yes                    | Source descriptors                   |

## Screen attributes

Screen element has the following attributes:

| Attribute     | Use          | Type    | Description                   |   Values                                    |
| ------------- | ------------ | ------- | ----------------------------- |---------------------------------------------|
| template      | **Required** | String  | Template which the xml is going to render | `full`, `window`           |
| label         | Optional     | String  | Title of the screen        | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)   |
| keep-criteria | Optional     | Boolean | Stores the screen data to show it whenever user returns to the screen (only inputs data, not grids or charts data) | Default value is `false` |
| target        | Optional     | String  | Initial queries which initialize all criteria values in the screen. Queries columns must match [criteria](criteria.md) identifiers | [Query](query-definition.md) identifiers, separated by commas `,` |
| onload        | Optional     | String  | Maintain target to launch on screen load | Maintain target identifier       |
| onunload      | Optional     | String  | Maintain target to launch on screen unload | Maintain target identifier     |
|schema-location| **Required** | String  | Location for XSD files | Example for awe screens: "../../sch/awe/screen.xsd"
