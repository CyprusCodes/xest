---
id: layout
title: Layout
---

AWE layout service helps the developer to position the screen layers taking advantage of all the screen size. There are two ways of 'expanding' the layout:
* **[Vertically](#vertical-layout):** With the `expandible="vertical"` attribute the **direct children** with a `expand` style will increase in height to fit the container size. All children without the `expand` class will keep their height.
* **[Horizontally](#horizontal-layout):** With the `expandible="horizontal"` attribute the **direct children** with a `expand` style will increase in width to fit the container size. All children without the `expand` class will keep their width.

### Special expansion

There are some special styles which can be used to expand the layout slightly different than with the standard `expand` style:
* `expand-2x`: Expands the tag with double size compared to a single `expand`.
* `expand-3x`: Expands the tag with triple size compared to a single `expand`.
* `expand-maximize`: Expands the layout of the tag **only** when the *parent* [window](window.md) is maximized.

## Vertical layout

In the following samples you can see an element with the `expandible="vertical"` attribute. Red boxes are children without the `expand` style, and blue boxes are children with the `expand` style:

### Two expandible children and one static child
<img alt="Layout vertical 1" src={require('@docusaurus/useBaseUrl').default('img/Layout_vertical_1.png')} />

### One expandible child and some static children
<img alt="Layout vertical 2" src={require('@docusaurus/useBaseUrl').default('img/Layout_vertical_2_1.png')} />

## Horizontal layout

In the following samples you can see an element with the `expandible="horizontal"` attribute. Red boxes are children without the `expand` style, and blue boxes are children with the `expand` style:

### Two expandible children and one static child
<img alt="Layout horizontal" src={require('@docusaurus/useBaseUrl').default('img/Layout_horizontal.png')} />

#### One expandible child and some static children
<img alt="Layout horizontal 2" src={require('@docusaurus/useBaseUrl').default('img/Layout_horizontal_2.png')} />

## Combined layout

To design an application screen you can combine the usage of vertical and horizontal layouts with expandible and not expandible children:

<img alt="Combined layout" src={require('@docusaurus/useBaseUrl').default('img/Combined_layout.png')} />

<img alt="Combined layout 2" src={require('@docusaurus/useBaseUrl').default('img/Combined_layout_2.png')} />

<img alt="Combined layout 3" src={require('@docusaurus/useBaseUrl').default('img/Combined_layout_3.png')} />