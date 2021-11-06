---
id: window
title: Window
---

A window is a container with a title bar. It also can be maximized or restored, and it's very useful to sort groups of components in the screen.

<img alt="Window" src={require('@docusaurus/useBaseUrl').default('img/Window.png')} />

## XML skeleton

```xml 
<window id="[window-identifier]" label="[window-label]" style="[window-style]"
        icon="[window-icon]" expandible="[expand-orientation]" maximize="[maximize-window]">
  <tag type="div" style="panel-body">...</tag>
  <tag type="div" style="panel-footer">...</tag>
  ...
  <grid>...</grid>
  ...
  <chart>...</chart>
  ...
</window>
```

## Window structure

| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
|[window](#window-attributes) | **Required** | No | Global node of window. Describes the window attributes |
| [tag](tags.md) | Optional | Yes | A [tag](tags.md) list inside the window, usually with styles like `panel-body` and `panel-footer` |
| [grid](grids.md) | Optional | No | A [grid](grids.md) inside the window  |
| [chart](chart.md) | Optional | No | A [chart](chart.md) inside the window |

> **Note** There are two special styles you can use as tag styles on windows:
> * `panel-body`: A special style to define the content of a window. It adds margins to the content.
> * `panel-footer`: A special style to define the bottom of a window. It is recommended to put buttons inside.
> * `expand-maximize`: A special style usually combined with `panel-body` which expands the content of the window when it is maximized.

## Window attributes

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id          | Optional | String    | Window identifier. For reference purposes |                                          |
| label       | Optional | String    | Window title                    | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)          |
| style       | Optional | String    | Window CSS classes              | **Note:** Here you can use `expand` class to set the window as expandible |
| icon        | Optional | String    | Icon identifier                 | **Note:** You can check all iconset at [FontAwesome](http://fontawesome.io/icons/) |
| expandible  | Optional | String    | How to [expand](layout.md) the window children | `vertical`, `horizontal` |
| maximize    | Optional | Boolean   | Whether to show the maximize icon or not |                                  |

## Examples

### Expandible window with grid (maximizable)

```xml 
<window style="expand" maximize="true" label="SCREEN_TEXT_DATA" icon="list">
  <grid ...>...</grid>
</window>
```

<img alt="expandible window with grid" src={require('@docusaurus/useBaseUrl').default('img/expandible window with grid.png')} />

### Static window with content and buttons zone

```xml 
<window label="SCREEN_TEXT_CRITERIA" icon="filter">
  <tag type="div" style="panel-body">...</tag>
  <tag type="div" style="panel-footer">
    <tag type="div" style="pull-right">...</tag>
  </tag>
</window>
```
<img alt="Static_window_with_buttons_and_panel" src={require('@docusaurus/useBaseUrl').default('img/Static_window_with_buttons_and_panel.png')} />