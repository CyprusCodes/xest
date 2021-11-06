---
id: criteria
title: Criteria
---

Criteria elements are window components which can get input from the user and send it to the application server (business logic).

<img alt="Criteria" src={require('@docusaurus/useBaseUrl').default('img/Criteria.png')} />

## How does it work

Internally, a criterion has 2 basic attributes to manage the information to send to the server and the information to show to the user:

* **selected:** The selected values of the criterion. These values **will** be sent to the server.
* **values:** The available values of the criterion. These values **will _not_** be sent to the server. It's a list of *values* and *labels* that will be shown to the user to choose from.

### Priorities

The **selected** values can be fulfilled in several ways. Here is a priority list with those ways:

1. **variable** - These are the values sent from another screen
2. **screen target** - The values returned by the screen target are the most priority of the list
3. **`initial-load="value"`** - The query-retrieved values follow the screen target values
4. **session** - Session-stored values
5. **property** - Property-stored values
6. **value** - Static values defined on value attribute

## XML skeleton

```xml 
<criteria id="[identifier]" component="[component]" label="[label]" placeholder="[placeholder]" style="[classes]"
          initial-load="[initial-load]" server-action="[server-action]" target-action="[target-action]" 
          variable="[variable]" value="[value]" session="[session]" property="[property]"
          validation="[validation]" readonly="[read-only]" size="[size]" unit="[unit]" icon="[icon]"  
          printable="[printable]" help="[help]" help-image="[help-image]" 
          optional="[optional]" area-rows="[area-rows]" number-format="[number-format]" capitalize="[capitalize]"
          strict="[strict]" checked="[checked]" group="[group]" show-slider="[slider]" destination="[destination]">
  <dependency... />
</criteria>
```

## Criteria structure

| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| [criteria](#general-attributes) | **Required** | No | Global node of criteria. Defines the criterion attributes |
| [dependency](dependencies.md) | Optional | Yes | List of dependencies attached to the criterion |

### General attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| id          | **Required** | String    | Criterion identifier. For reference purposes |                                   |
| component   | **Required** | String    | Criterion type              | See [components](#components)                      |
| label       | Optional     | String    | Criterion text (outside the criterion) | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| placeholder | Optional     | String    | Criterion text (inside the criterion) | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| style       | Optional     | String    | Criterion CSS classes       | See [Bootstrap positioning](http://getbootstrap.com/css/#grid-example-basic) for criteria sizing |
| initial-load | Optional   | String    | Server action call to load the criterion data (launched at window generation) | `enum` (for [enumerated](enumerate-definition.md)), `query` (for [query call](query-definition.md) loading the **[values](#how-does-it-work)** part of the criterion) or `value` (for [query call](query-definition.md) loading the **[selected](#how-does-it-work)** part of the criterion)  |
| server-action | Optional   | String    | Server action call          | See [server action list](actions.md#server-actions)   |
| target-action | Optional   | String    | Target to call on the server|                                                    |
| max | Optional   | Integer | Max number of values | **Note:** Default value is set in property `var.def.rpp` in file base.properties |
| autoload | Optional   | Boolean | Launch target-action when the screen has been initialized | **Note:** Default value is `false` |
| autorefresh| Optional   | Integer | Launch the target-action every X seconds | **Note:** The value is in seconds |
| variable    | Optional     | String    | Parameter to fill the criterion value | **Identifier** of a criterion in the **previous screen** |
| value       | Optional     | String    | Criterion default value     |                                                    |
| session     | Optional     | String    | Session variable to load the criterion | Session variable identifier             |
| property    | Optional     | String    | Property variable to load the criterion | Property variable identifier           |
| validation  | Optional     | String    | Validation rules            | See [validation](../guides/validation-guide.md) |
| readonly    | Optional     | Boolean   | Set criterion as readonly   | Default value is `false`                           |
| size        | Optional     | String    | Criterion size              | `sm` (default), `md` or `lg`.                      |
| unit        | Optional     | String    | Criterion unit text         | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| icon        | Optional     | String    | Icon identifier             | **Note:** You can check all iconset at [FontAwesome](http://fontawesome.io/icons/) |
| printable   | Optional     | String    | Check if criterion is printable | `true`, `false`, `excel`, `all`, `tab`         |
| help        | Optional     | String    | Help text for the criterion | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| help-image  | Optional     | String    | Help image for the criterion | This **must** be a image path |
| left-label  | Optional     | Integer   | Put the label on the left **and** give it a size in chars | Default value is empty (label is on top instead of left). If defined, the value must be a number of chars for the label |

### Specific attributes

| Attribute     | Criterion                        | Type      |  Description                |   Values                    |
| ------------- | -------------------------------- | --------- | --------------------------- | --------------------------- |
| optional      | [Select](#select-criterion)      | Boolean   | Allow selecting a empty value | Default value is `false`  |
| area-rows     | [Textarea](#textarea-criterion)  | Integer   | Number of rows of the textarea | Default value is `3` |
| number-format | [Numeric](#numeric-criterion)    | String    | Format of the number | See [autonumeric plugin](http://www.decorplanit.com/plugin/) |
| capitalize    | [Select](#select-criterion), [Suggest](#suggest-criterion) | Boolean   | Put the first letter of the options in uppercase and the others in lowercase | Default value is `false` |
| strict        | [Suggest](#suggest-criterion)    | Boolean   | Allow the user only to select the list values | Default value is `true` |
| check-target | [Suggest](#suggest-criterion)    | String | Target action to be launched if label is not defined at suggest initialization | Default value is the defined at `target-action` |
| checked       | [Checkbox](#checkbox-criterion), [Radio](#radio-button-criterion) | Boolean   | Mark the criterion as checked initially | Default value is `false` |
| group         | [Checkbox](#checkbox-criterion), [Radio](#radio-button-criterion)  | String    | Group of the criterion (for validation and management purposes) | |
| show-slider   | [Numeric](#numeric-criterion)  | Boolean    | Used to show the graphic component slider | **Note:** Only apply in numeric criteria |
| destination   | [Uploader](#uploader-criterion)  | String | Destination relative folder to upload the file |   |
| show-weekends | [Date](#date-criterion) | Boolean    | For enable or disable the weekend days | Default value is `true`  |
| show-future-dates| [Date](#date-criterion) | Boolean | For enable or disable the future days after date value selected | Default value is `true` |
| date-format| [Date](#date-criterion) | String | To set the format of the date you want to show | Default value is `dd/MM/yyyy`. **Note:** See the format in the following [link](https://bootstrap-datepicker.readthedocs.org/en/latest/options.html)  |
| date-show-today-button| [Date](#date-criterion) | Boolean | To show or not the button to select today date | Default value is `true` |
| date-view-mode| [Date](#date-criterion) | String | Select 'days', 'months' or 'years' to set the minimum magnitude to be shown | Default value is `days` |

## Components

### Text criterion

Basic text input.

<img alt="textCriterion" src={require('@docusaurus/useBaseUrl').default('img/textCriterion.png')} />

### Password criterion

Basic text input, but the written characters are not shown to the user.

<img alt="Password" src={require('@docusaurus/useBaseUrl').default('img/Password.png')} />

### Textarea criterion

Criterion which allows the user to insert a large text and newlines.

<img alt="Textarea" src={require('@docusaurus/useBaseUrl').default('img/Textarea.png')} />

### Hidden criterion

Hidden criterion. It is useful to send static values to a query or as a formula element. 

### Numeric criterion

Criterion which allows to insert formatted numbers.

<img alt="numericCriterion" src={require('@docusaurus/useBaseUrl').default('img/numericCriterion.png')} />

Numeric criterion with slider enabled

<img alt="Numeric_slider" src={require('@docusaurus/useBaseUrl').default('img/Numeric_slider.png')} />

#### Number format attribute

This attribute is used to format the numeric criterion and the slider. It is specified in json object format.

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| min         | Optional | Number    | The minimum possible value | Ex: `{min: 5}`                                          |
| max         | Optional | Number    | The maximum possible value     | Ex: `{max: 5}`                                          |
| aSign       | Optional | String    | Desired currency symbol  | Ex: `{aSign: ' €'}`                                       |
| pSign       | Optional | String    | Controls the placement of the currency symbol | pSign: 'p' to prefix or pSign: 's' to suffix (**default**) |
| aPad        | Optional | Boolean    | Controls padding of the decimal places | **true** always pads the decimal with zeros or **false**  (**default**) to no padding |
| precision   | Optional | Number    | Number of decimals |  **Note:** The thousand & decimal separators can not be the same |
| step        | Optional | Number    | Slider increment step | Ex: `{step: 5}`                                       |
| ticks       | Optional | Array    | Used to define the values of ticks in slider. Tick marks are indicators to denote special values in the range. This option overwrites min and max options | Ex: `{ticks: [-1000, -500, 0, 500, 1000]}` |
| ticks_labels| Optional | Array    | Defines the labels below the tick marks. Accepts HTML input | Ex: `{ticks_labels: ['-$1000', '-$500', '$0', '$500', '$1000']}` |

> **Note:** You can view all autonumeric attributes [here](http://www.decorplanit.com/plugin/) and the slider attributes [here](https://github.com/seiyria/bootstrap-slider#options)

#### Number format examples

```xml
number-format="{min: 0, max: 100, step: 0.01, precision: 2, aSign:' £', pSign:'s', aPad:true}"
---
number-format="{min: -1000, max: 1000, step: 10, precision: 2, aSign:' $', pSign:'s', aPad:true,  
ticks: [-1000, -500, 0, 500, 1000], ticks_labels: ['-$1000', '-$500', '$0', '$500', '$1000']}"
```

### Date criterion

Allows to select a date with a calendar.

<img alt="dateCriteron" src={require('@docusaurus/useBaseUrl').default('img/dateCriteron.png')} />

### Time criterion

Allows to select a time with a time picker.

<img alt="TimeCriterion" src={require('@docusaurus/useBaseUrl').default('img/TimeCriterion.png')} />

### Filtered date criterion

Allows to select a date with a calendar from a list of filtered dates. 

<img alt="FilteredDate.ong" src={require('@docusaurus/useBaseUrl').default('img/FilteredDate.ong.png')} />

### Select criterion

Shows a list and allows the user to select one element. 

<img alt="Select" src={require('@docusaurus/useBaseUrl').default('img/Select.png')} />

### Suggest criterion

Allows the user to search a value by typing some characters of the seek value. 

<img alt="Suggest" src={require('@docusaurus/useBaseUrl').default('img/Suggest.png')} />

> **Note:** The *typed* text is sent to the server as `suggest` parameter, but only when the query is used to fill in the options. Otherwise, suggest's id should be used as usual.

### Select VS Suggest

| Select   		| Suggest          |
| ----------- | ------------ |
| The list of values is "fixed"         | The list can change every time you interact with the component 		 | 
| The list is loaded when you enter into the window        | The list is loaded when you interact with the component	 |
| Filtered in the client       | Can be filtered in client and server		 |
| You have to use it when the list of values is small and with fixed number of values.       | It can be used with both small and large lists		 |
| Use attribute "max"=0        | Use attribute "max" to limit the data returned by the server.		 |
|    | You must use the variable "suggest" to filter.		 |
| Not used when there are interrelationships between criteria        | Mandatory use when there are interrelationships with other criteria.		 |

### Multiple select criterion

Shows a list and allows the user to select some elements.

<img alt="Multiselect" src={require('@docusaurus/useBaseUrl').default('img/Multiselect.png')} />

### Multiple suggest criterion

Allows the user to search some values by typing some characters of the seek values. 

<img alt="Multisuggest" src={require('@docusaurus/useBaseUrl').default('img/Multisuggest.png')} />

> **Note:** The *typed* text is sent to the server as `suggest` parameter.

### Checkbox criterion

Shows a checkbox. It sends a `1` (or the value defined in the **[value](#general-attributes)** attribute) if it's checked or `0` if it is unchecked. 

<img alt="Checkboxes" src={require('@docusaurus/useBaseUrl').default('img/Checkboxes.png')} />

### Radio button criterion

Shows a radio button. It is mono-selection. It sends the **[value](#general-attributes)** attribute of the selected element between all the radio buttons with the same **[group](#specific-attributes)** attribute.

<img alt="Radios" src={require('@docusaurus/useBaseUrl').default('img/Radios.png')} />

> **Note:** If we want a radio button group to be required, all the radio buttons that are inside the group must have validation="required"

### Button checkbox criterion (line)

Similar to a [checkbox](#checkbox-criterion) but it has a button appearance. It sends a `1` (or the value defined in the **[value](#general-attributes)** attribute) if it's checked or `0` if it is unchecked. 

<img alt="ButtonCheckbox" src={require('@docusaurus/useBaseUrl').default('img/ButtonCheckbox.png')} />

### Radio button criterion (line)

Similar to a [radio button](#radio-button-criterion) but it has a button appearance. It is mono-selection. It sends the **[value](#general-attributes)** attribute of the selected element between all the radio buttons with the same **[group](#specific-attributes)** attribute.

<img alt="ButtonRadio" src={require('@docusaurus/useBaseUrl').default('img/ButtonRadio.png')} />

### Color criterion

Color criterion. It is useful to get color hexadecimal value with a color picker widget. 

<img alt="ColorPicker" src={require('@docusaurus/useBaseUrl').default('img/ColorPicker.png')} />

### Uploader criterion

Criterion useful to send files to the server. Once uploaded, the files can be managed by the server processes

<img alt="UploaderCriterion" src={require('@docusaurus/useBaseUrl').default('img/UploaderCriterion.png')} />

### Text view criterion

This criterion simply shows a text, which can be retrieved from a variable, a parameter, a query or even loaded with dependencies.

<img alt="TextView" src={require('@docusaurus/useBaseUrl').default('img/TextView.png')} />

## Examples

### Multiple suggest with icon 

```xml
<criteria label="PARAMETER_USER" component="suggest-multiple" id="..." icon="user" initial-load="query" target-action="..."    
          style="col-xs-12 col-sm-6 col-lg-3"/>
```

<img alt="SuggestWithIcon" src={require('@docusaurus/useBaseUrl').default('img/SuggestWithIcon.png')} />

### Radio button group

```xml
<criteria component="radio" label="PARAMETER_RADIO_1" id="RadBox1" group="RadBox" variable="RadBox" 
          value="Radio1" style="col-xs-6 col-sm-2 col-lg-1 no-label" validation="required" checked="true"/>
<criteria component="radio" label="PARAMETER_RADIO_2" id="RadBox2" group="RadBox" variable="RadBox" 
          value="Radio2" style="col-xs-6 col-sm-2 col-lg-1 no-label" readonly="true"/>
<criteria component="radio" label="PARAMETER_RADIO_3" id="RadBox3" group="RadBox" variable="RadBox" 
          value="Radio3" style="col-xs-6 col-sm-2 col-lg-1 no-label"/>
```

<img alt="Radios" src={require('@docusaurus/useBaseUrl').default('img/Radios.png')} />

### Required text without label, with placeholder and with icon

```xml
<criteria placeholder="SCREEN_TEXT_USER" component="text" icon="user" id="user" validation="required" 
          style="col-xs-6 col-sm-4 col-md-2"/>
```

<img alt="UserName" src={require('@docusaurus/useBaseUrl').default('img/UserName.png')} />

### Select multiple with two preselected values

```xml
<criteria component="select-multiple" id="user" label="PARAMETER_USER" icon="user" initial-load="query" 
          target-action="..." style="col-xs-12 col-sm-6 col-lg-3" value="1, 2" validation="required"/>
```

<img alt="SelectMultiplePreselected" src={require('@docusaurus/useBaseUrl').default('img/SelectMultiplePreselected.png')} />

### Color criterion sample

```xml
<criteria label="PARAMETER_COLOR" id="Col" variable="Col" component="color" 
          style="col-xs-6 col-sm-3 col-lg-2" value="#d5db89" />

```

<img alt="ColorPicker2" src={require('@docusaurus/useBaseUrl').default('img/ColorPicker2.png')} />

### Uploader criterion sample

```xml
<criteria label="PARAMETER_UPLOADER" id="Upl" component="uploader" validation="required" 
          style="col-xs-12 col-sm-6 col-lg-4" destination="testModule">
```

<img alt="UploaderCriterion2" src={require('@docusaurus/useBaseUrl').default('img/UploaderCriterion2.png')} />