---
id: tags
title: Tag
---

Tags are basically HTML elements. They can be used to separate the different parts of the screen we want to generate.

The structure of a tag is the following:

```xml
<tag type="[type]" label="[label]" style="[style]" source="[source]" expandible="[expand-direction]">...</tag>
```

There is a special tag which only contains text defined like the next one:

```xml
<tag><text>[text]</text></tag>
```

## Tag attributes

| Attribute     | Use          | Type    | Description                   |   Values                                    |
| ------------- | ------------ | ------- | ----------------------------- |---------------------------------------------|
| source        | Optional     | String  | Template source to link to    | `buttons`, `center`, etc                    |
| type          | Optional     | String  | HTML tag type                 | `div`, `span`, `p`, etc                   |
| label         | Optional     | String  | Text inside the tag           | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)   |
| style         | Optional     | String | Css class or classes to apply to the element |  |
| id            | Optional     | String | Tag identifier. Useful for external references |                                      |
| expandible    | Optional     | String | How to [expand](layout.md) the tag children | `vertical`, `horizontal` |

> **Note:** If the *type* is not defined, the **tag** element will not generate any HTML code. This is very useful to define source links (`<tag source="center">...</tag>`)

