---
id: info
title: Navigation Bar
---

The navigation bar is used to add visual elements with logic functions in the top zone of application. This part is displayed in all application screens.

You can add `info` elements to show more info and `info-button` elements as buttons with actions. Also, you can put `info-criteria` elements inside info elements as criteria for show more info. 

<img alt="NavBar" src={require('@docusaurus/useBaseUrl').default('img/NavBar.png')} />

## Xml structure

The xml structure of navigation bar component is the following:

```xml
<tag type="div" id="main-navbar-collapse" style="collapse navbar-collapse main-navbar-collapse">
  <tag type="div" style="right clearfix">
    <tag type="ul" style="nav navbar-nav pull-right right-navbar-nav">
      <info id="[id]" icon="[icon]" title="[info-title]">
      ... more info elements
      <info id="[id]" icon="[icon]" title="[info-title]">
      <info-criteria id="[id]" icon="[icon]" title="[info-criteria-title]" component="[component]" initial-load="[initial-load]" 
        target-action="[target-action]" session="module" style="[style]" info-style="[info-style]">
        <dependency/>
      </info-criteria>
      ... more info criteria elements              
    </info>
    <info-button id="[id]" icon="[icon]" title="[button-title]">
      <button-action type="[action-type]" />
      ... more button.action
    </info-button>
    ... more info-button
   </tag>
 </tag>
</tag>
```

## Nabvar structure

| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| [info](#info-attributes) | Optional  | Yes | Graphical element to show information |
| [info-button](#info-button-attributes) | Optional | Yes | Navbar button for execute task. Same as button element in Awe |
| [info-criteria](#info-criteria-attributes) | Optional | Yes | Navbar criteria to get input from the user and send it to the application server (business logic) . Same as criteria element in Awe |

### info attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| `id`          | **Required** | String    | Info element identifier. For reference purposes |  |
| `field`       | Optional     | String    | Name of model attribute to get value of target-action | Ex.: `field="label"` Get label attribute of target-action data result |
| `title`       | Optional     | String    | Info static text show when over | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| `label`       | Optional     | String    | Info text (outside the criterion) |**Note:** You can use [i18n](i18n-internationalization.md) files (locales)  | 
| `style`       | Optional     | String    | Info CSS classes |   | 
| `dropdown-style` | Optional     | String    | Info dropdown box CSS classes |   | 
| `icon`        | Optional     | String    | Icon identifier | **Note:** You can check all iconset at [FontAwesome](http://fontawesome.io/icons/) | 
| `unit`        | Optional     | String    | Info unit. Use it with info icon to show a number as stacked style  |  | 
| `session`     | Optional     | String    | Session variable to load the criterion | Session variable identifier | 
| `value`       | Optional     | String    | Info default value |   | 
| `property`    | Optional     | String    | Property variable to load the criterion | Property variable identifier |  
| `server-action`| Optional     | String    | Server action call | See [server action list](actions.md#server-actions) |  
| `target-action`| Optional     | String    | Target to call on the server | |  



### info-button attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| `title`     | Optional     | String   | Static text show when over button | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| `info-style`| Optional     | String    | Css style of info-button container |  |

> **Note:** info-button element has other attributes as button element. You can see more info [here](button.md#button-attributes).

### info-criteria attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| `title`     | Optional     | String   | Static text show when over criteria | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| `info-style`| Optional     | String    | Css style of info-criteria container | Ex.: `info-style="form-group"` |

> **Note:** info-criteria element has the same attributes as criteria element. You can see more info [here](criteria.md#criteria-attributes).

## Examples

- Navigation bar with some info elements and info button

<img alt="Info-button" src={require('@docusaurus/useBaseUrl').default('img/Info-button.png')} />

```xml
<tag type="div" id="main-navbar-collapse" style="collapse navbar-collapse main-navbar-collapse">
  <tag type="div" style="right clearfix">
   <tag type="ul" style="nav navbar-nav pull-right right-navbar-nav">            
     <info id="ButUsrAct" icon="user" field="Val" server-action="data" target-action="ConUsr"/>
      <info-button id="ButLogOut" icon="sign-out" title="BUTTON_LOGOUT">
        <button-action type="logout" />
      </info-button>
    </tag>
  </tag>
</tag>
```

- Navigation bar with one info with info-criteria elements

<img alt="Info-criteria" src={require('@docusaurus/useBaseUrl').default('img/Info-criteria.png')} />

```xml
<tag type="div" id="main-navbar-collapse" style="collapse navbar-collapse main-navbar-collapse">
  <tag type="div" style="right clearfix">
   <tag type="ul" style="nav navbar-nav pull-right right-navbar-nav">
     <info id="ButUsrAct" icon="user" field="Val" server-action="data" target-action="ConUsr">
       <info-criteria icon="image" title="PARAMETER_THEME" component="select" id="theme" initial-load="query" 
           target-action="ThmSelVal" session="theme" style="col-xs-12 no-label" info-style="form-group">
         <dependency>
           <dependency-element id="theme" />
           <dependency-action type="server" server-action="maintain-silent" target-action="SesVarThm" silent="true" />
           <dependency-action type="change-theme" target="theme" />
         </dependency>
       </info-criteria>
       <info-criteria icon="language" title="PARAMETER_LANGUAGE" component="select" id="language" initial-load="enum" 
          target-action="Lan" session="language" style="col-xs-12 no-label" info-style="form-group">
        <dependency>
          <dependency-element id="language" />
          <dependency-action type="server" server-action="maintain-silent" target-action="SesVarLan" silent="true" />
          <dependency-action type="change-language" target="language" />
        </dependency>
       </info-criteria>
      </info>
    </tag>
  </tag>
</tag>
```

- Info with unit and dependencies

<img alt="Info_unit" src={require('@docusaurus/useBaseUrl').default('img/Info_unit.png')} />

```xml
<info id="Dab" icon="database" unit="3" style="nav-icon-btn-success">
  <dependency source-type="criteria-text" target-type="label" target-action="database" initial="true">
   <dependency-element id="database"/>
  </dependency>
</info>
```