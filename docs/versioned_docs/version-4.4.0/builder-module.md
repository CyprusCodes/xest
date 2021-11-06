---
id: builder
title: Builder Module
sidebar_label: Builder Module
---

Builder module is a set of Java utilities designed to cover some functionalities:

- Make easier the developer task of sending actions to the frontend.
- Allow to define dynamic screens in Java instead of XML files.

##  **Configuration**

Add the following dependency into your maven `pom.xml` file:

```xml
<dependency>
  <groupId>com.almis.awe</groupId>
  <artifactId>awe-builder-spring-boot-starter</artifactId>
</dependency>
```

And there you go!

##  **Client action builders**

Client action builders help the developer in the task of sending specific client actions to the frontend. 

####  **`screen` action builder**

This action makes the application to move to another screen.

Usage:

```java
serviceData.addClientAction(new ScreenActionBuilder("another-screen-option").build());
```

This sample creates a client action which will try to navigate to the option defined as `another-screen-option`.

####  **`redirect` action builder**

This action makes the application to redirect to another URL.

Usage:

```java
serviceData.addClientAction(new RedirectActionBuilder("http://go.to.another.url").build());
```

This sample creates a client action which will try to navigate to the URL `http://go.to.another.url`.

####  **`redirect-screen` action builder**

This action makes the application to redirect a specific screen to another URL.

Usage:

```java
serviceData.addClientAction(new RedirectScreenActionBuilder("specific-screen", "http://go.to.another.url").build());
```

This sample creates a client action which will try to navigate to the URL `http://go.to.another.url` if the
current screen is `specific-screen` (useful for dynamic-generated screens).

####  **`fill` action builder**

This action sends a list of data to a component:

Usage:

```java
DataList dataList = new DataList();
// ...
serviceData.addClientAction(new FillActionBuilder("my-grid", dataList).build());
```

This sample sends `dataList` to `"my-grid"` component.

####  **`select` action builder**

This action sends a list of selected values to a component.

Usage:

```java
List<String> values = new ArrayList();
// ...
serviceData.addClientAction(new SelectActionBuilder("my-select", values).build());
```

Alternate usage:

```java
serviceData.addClientAction(new SelectActionBuilder("my-select", value1, value2, ... valueN).build());
```

This sample sends a list of selected values to `"my-select"` component.

####  **`filter` action builder**

This action calls a component to reload itself:

Usage:

```java
serviceData.addClientAction(new FilterActionBuilder("my-grid").build());
```

This sample tells `"my-grid"` component to reload its data.

####  **`update-controller` action builder**

This action triggers a change of attribute inside a component:

Usage:

```java
// ...
serviceData.addClientAction(new UpdateControllerActionBuilder("my-select", "optional", false).build());
```

This sample changes the `optional` attribute on `"my-select"` component to `false`.

####  **`message` action builder**

This action allows sending a message to the user. Message type can be one of `OK`, `WARNING`, `ERROR` or `INFO`.

Usage:

```java
serviceData.addClientAction(new MessageActionBuilder(AnswerType.OK, "message title", "message description").build());
```

This sample sends a message to the frontend.

####  **`dialog` action builder**

This action opens a modal window in the screen.

Usage:

```java
serviceData.addClientAction(new DialogActionBuilder("my-dialog").build());
```

This sample opens the modal screen named `"my-dialog"`.

####  **`confirm` action builder**

This action opens a modal window with a button to confirm or cancel action.

Usage:

```java
serviceData.addClientAction(new ConfirmActionBuilder("messageId").build());
```

This sample opens a modal confirm dialog using the `message` tag defined as `message-id`.

An alternate usage of this builder is the following one:

```java
serviceData.addClientAction(new ConfirmActionBuilder("message title", "message description").build());
```

Instead of using a defined `message` tag, this action uses the `title` and `description` parameter defined on it.

####  **`get-file` action builder**

This action asks a file to be downloaded.

Usage:

```java
FileData fileData = new FileData();
//...
serviceData.addClientAction(new DownloadActionBuilder(fileData).build());
```

This sample try to download the file defined in the `fileData` bean.

###  **CSS action builders**

####  **`add-class` action builder**

This action search for a CSS class in the screen and if it finds it, adds some CSS classes to the element.

Usage:

```java
serviceData.addClientAction(new AddCssClassActionBuilder(".selector", "class1", "class2", "class3").build());
```

This sample search for the `.selector` CSS selector, and adds the "class1", "class2" and "class3" classes into the element if found.

####  **`remove-class` action builder**

This action search for a CSS class in the screen and if it finds it, removes some CSS classes from the element.

Usage:

```java
serviceData.addClientAction(new RemoveCssClassActionBuilder(".selector", "class1", "class2", "class3").build());
```

This sample search for the `.selector` CSS selector, and removes the "class1", "class2" and "class3" classes from the element if found.

###  **Grid action builders**

####  **`add-columns` action builder**

This action adds some columns on a grid.

Usage:

```java
List<Column> columnList = new ArrayList<>();
//...
serviceData.addClientAction(new AddColumnsActionBuilder("my-grid", columnList).build());
```

This sample adds a list of columns on the `"my-grid"` grid.

####  **`replace-columns` action builder**

This action **replaces all columns on the grid** with the defined column list.

Usage:

```java
List<Column> columnList = new ArrayList<>();
//...
serviceData.addClientAction(new ReplaceColumnsActionBuilder("my-grid", columnList).build());
```

This sample replaces all columns on the `"my-grid"` grid.

####  **`show-columns` action builder**

This action show some columns on a grid.

Usage:

```java
List<String> columnIdList = new ArrayList<>();
//...
serviceData.addClientAction(new ShowColumnsActionBuilder("my-grid", columnIdList).build());
```

Alternate usage:

```java
serviceData.addClientAction(new ShowColumnsActionBuilder("my-grid", "column1", "column2", ... "columnN").build());
```

####  **`hide-columns` action builder**

This action hide some columns on a grid.

Usage:

```java
List<String> columnIdList = new ArrayList<>();
//...
serviceData.addClientAction(new HideColumnsActionBuilder("my-grid", columnIdList).build());
```

Alternate usage:

```java
serviceData.addClientAction(new HideColumnsActionBuilder("my-grid", "column1", "column2", ... "columnN").build());
```

#### **`add-row` action builder**

This action adds a row to the grid. Depending on selected row you can decide where to add the new row:

- `TOP`: As the first line of the grid.
- `BOTTOM`: As the last line of the grid (default).
- `UP`: Over the selected row.
- `DOWN`: Below the selected row.

Usage:

```java
Map<String, Object> rowData = new HashMap<>();
//...
serviceData.addClientAction(new AddRowActionBuilder(RowPosition.TOP, "my-grid", rowData).build());
```

Alternate usage:

```java
ObjectNode rowData = JsonNodeFactory.instance.objectNode();
//...
serviceData.addClientAction(new AddRowActionBuilder(RowPosition.DOWN, "my-grid", rowData).build());
```

#### **`copy-row` action builder**

This action copies a row to the grid. Depending on selected row you can decide where to add the new row:

- `TOP`: As the first line of the grid.
- `BOTTOM`: As the last line of the grid (default).
- `UP`: Over the selected row.
- `DOWN`: Below the selected row.

Usage:

```java
serviceData.addClientAction(new CopyRowActionBuilder(RowPosition.TOP, "my-grid").build());
```

You also can define the row you want to copy from:

```java
serviceData.addClientAction(new CopyRowActionBuilder(RowPosition.BOTTOM, "my-grid", "my-row").build());
```

#### **`update-row` action builder**

This action updates the selected row.

Usage:

```java
Map<String, Object> rowData = new HashMap<>();
//...
serviceData.addClientAction(new UpdateRowActionBuilder("my-grid", rowData).build());
```

Alternate usage:

```java
ObjectNode rowData = JsonNodeFactory.instance.objectNode();
//...
serviceData.addClientAction(new UpdateRowActionBuilder("my-grid", rowData).build());
```

You also can define the row you want to update:

```java
serviceData.addClientAction(new DeleteRowActionBuilder("my-grid", "my-row", rowData).build());
```

#### **`delete-row` action builder**

This action deletes the selected row.

Usage:

```java
serviceData.addClientAction(new DeleteRowActionBuilder("my-grid").build());
```

You also can define the row you want to delete:

```java
serviceData.addClientAction(new DeleteRowActionBuilder("my-grid", "my-row").build());
```

#### **`select-all-rows` action builder**

This action selects all rows in the grid.

Usage:

```java
serviceData.addClientAction(new SelectAllRowsActionBuilder("my-grid").build());
```

#### **`unselect-all-rows` action builder**

This action unselects all rows in the grid.

Usage:

```java
serviceData.addClientAction(new UnselectAllRowsActionBuilder("my-grid").build());
```


####  **`update-cell` action builder**

This action updates a grid cell data.

Usage:

```java
ComponentAddress address = new ComponentAddress("view", "component", "row", "column");
CellData cellData = new CellData(value);
//...
serviceData.addClientAction(new UpdateCellActionBuilder("my-grid", cellData).build());
```

This sample changes the cell `column` at row `row` on `component` grid with `cellData` value.

This builder also allows to define data as `JsonNode` instead of `CellData`:

```java
ComponentAddress address = new ComponentAddress("view", "component", "row", "column");
ObjectNode nodeData = JsonNodeFactory.instance.objectNode();
nodeData.put("icon", "fa-empire");
nodeData.put("style", "text-danger");
nodeData.put("value", "fa-empire");
//...
serviceData.addClientAction(new UpdateCellActionBuilder(address, nodeData).build());
```

###  **Chart action builders**

####  **`add-chart-series` action builder**

This action allows to add series to a chart

Usage:

```java
List<ChartSerie> serieList = new ArrayList<>();
//...
serviceData.addClientAction(new AddChartSeriesActionBuilder("my-chart", serieList).build());
```

Alternate usage:

```java
serviceData.addClientAction(new AddChartSeriesActionBuilder("my-chart", serie1, serie2, ... serieN).build());
```

This sample adds a list of series on the `"my-chart"` chart.

####  **`replace-chart-series` action builder**

This action allows to **replace all series** from a chart

Usage:

```java
List<ChartSerie> serieList = new ArrayList<>();
//...
serviceData.addClientAction(new ReplaceChartSeriesActionBuilder("my-chart", serieList).build());
```

Alternate usage:

```java
serviceData.addClientAction(new ReplaceChartSeriesActionBuilder("my-chart", serie1, serie2, ... serieN).build());
```

This sample replaces all series on the `"my-chart"` chart.

####  **`remove-chart-series` action builder**

This action allows to remove some series from a chart.

Usage:

```java
List<ChartSerie> serieList = new ArrayList<>();
//...
serviceData.addClientAction(new RemoveChartSeriesActionBuilder("my-chart", serieList).build());
```

Alternate usage:

```java
serviceData.addClientAction(new RemoveChartSeriesActionBuilder("my-chart", serie1, serie2, ... serieN).build());
```


This sample remove all series defined on serieList from the `"my-chart"` chart.

####  **`add-points` action builder**

This action sends a list of serie data to a chart:

Usage:

```java
DataList dataList = new DataList();
// ...
serviceData.addClientAction(new AddPointsActionBuilder("my-chart", dataList).build());
```

This sample sends `dataList` points to `"my-chart"` component.
 
> **Note:** Each datalist column name must match a chart serie id.

##  **Screen builders**

This set of builders is designed to generate java-defined screens instead of defining them in XML format.

### **Screen builder**

The screen builder is the main builder in this set. It allows the developer to generate dinamically an 
XML Screen structure:

```java
ScreenBuilder builder = new ScreenBuilder()
  .setId(UUID.randomUUID().toString())
  .addTag(new TagBuilder()
    .setSource("buttons")
    .setLabel("LABEL")
    .setStyle("expand")
    .setType("div")
    .addChart(new ChartBuilder()
      .setStockChart(true)
      .setAutoload(true)
      .setId("chart1")
      .setAutorefresh(5)
      .setEnableDataLabels(true)
      .setFormatDataLabels("formatDataLabels")
      .setIconLoading(IconLoading.CIRCLEBAR)
      .setStacking(Stacking.PERCENT)
      .setInverted(true)
      .setMax(45)
      .setTheme("chartTheme")
      .setVisible(false)
      .setSubtitle("SUBTITLE")
      .setChartType(ChartType.BUBBLE)
      .setZoomType(ChartAxis.Y_AXIS)
      .setChartLegend(new ChartLegendBuilder()
        .setChartLayout(ChartLayout.HORIZONTAL)
        .setAlign(Align.CENTER)
        .setEnabled(true)
        .setFloating(true)
        .setBorderWidth(2))
      .setChartTooltip(new ChartTooltipBuilder()
        .setCrosshairs(ChartAxis.ALL)
        .setEnabled(true)
        .setNumberDecimals(4)
        .setPointFormat("pointFormat")
        .setPrefix("pre")
        .setSuffix("post")
        .setDateFormat("yyyymmdd")
        .setShared(true))
      .addChartParameter(new ChartParameterBuilder()
        .setDataType(DataType.DOUBLE)
        .setName("parameterName")
        .setValue("0.1213"))
      .addChartSerieList(new ChartSerieBuilder()
        .setDrillDown(true)
        .setColor("red")
        .setXAxis("xAxis")
        .setYAxis("yAxis")
        .setXValue("x")
        .setYValue("y")
        .setZValue("z")
        .setDrillDownSerie("drilldownSerie"))
      .addContextButton(new ContextButtonBuilder()
        .setButtonType(ButtonType.BUTTON)
        .setValue("value")
        .setIcon("icon")
        .setSize("sm")
        .setLabel("LABEL"))
      .addContextSeparator(new ContextSeparatorBuilder())
      .addDependency(new DependencyBuilder()
        .setFormule("formule")
        .setInitial(true)
        .setInvert(true)
        .setLabel("LABEL")
        .setServerAction(ServerAction.CONTROL)
        .setSourceType(SourceType.QUERY)
        .setTargetType(TargetType.ATTRIBUTE)
        .setType(DependencyType.AND)
        .setValue("value")
        .addDependencyAction((DependencyActionBuilder) new DependencyActionBuilder()
          .setServerAction(ServerAction.GET_SERVER_FILE)
          .setTargetAction("TargetAction")
          .setTarget("target")
          .setAsynchronous(true)
          .setContext("context")
          .setType(Action.ADD_ROW)
          .setSilent(true)
          .setValue("value"))
        .addDependencyElement(new DependencyElementBuilder()
          .setAlias("alias")
          .setId("id")
          .setCancel(false)
          .setView(com.almis.awe.builder.enumerates.View.REPORT)
          .setAttribute(Attribute.CURRENT_ROW_VALUE)
          .setColumn("column")
          .setCondition(Condition.EQUALS)
          .setAttribute2(Attribute.EDITABLE)
          .setColumn2("column2")
          .setEvent(Event.AFTER_ADD_ROW)
          .setId2("id2")))
      .addAxis(new AxisBuilder()
        .setFormatterFunction(FormatterFunction.FORMAT_CURRENCY_MAGNITUDE)
        .setType(AxisDataType.CATEGORY))
      .addAxis(new AxisBuilder()
        .setAllowDecimal(true))
      .setChartType(ChartType.BUBBLE)));

Screen screen = builder.build();
```

This builder has also a method that generates a client action ready to store the newly generated screen
in the system and access into it:

```java
ServiceData serviceData = builder
  .setMenuType("public")
  .buildClientAction(getElements());
```

This method generates a [screen client action](#screen-action-builder) in the `public` menu 
pointing to the screen generated within the builder.

### **Component builders**

For each component designed in AWE you have a `builder` to define its behaviour:

- `TagBuilder`: Builds a `<tag>` component.
- `WindowBuilder`: Builds a `<window>` component.
- `DialogBuilder`: Builds a `<dialog>` component.
- `IncludeBuilder`: Builds a `<include>` component.
- `MenuContainerBuilder`: Builds a `<menu-container>` component.
- `MessageBuilder`: Builds a `<message>` component.
- `PivotTableBuilder`: Builds a `<pivot-table>` component.
- `ResizableBuilder`: Builds a `<resizable>` component.
- `TagListBuilder`: Builds a `<tag-list>` component.
- `ViewBuilder`: Builds a `<view>` component.
- `WidgetBuilder` and `WidgetParameterBuilder`: Builds a `<widget>` component.
- `InfoBuilder`: Builds a `<info>` component.
- `TabBuilder` and `TabContainerBuilder`: Builds a `<tab>` component.
- `WizardBuilder` and `WizardPanelBuilder`: Builds a `<wizard>` component.
- `ButtonBuilder` and `ButtonActionBuilders`: Builds `<button>` components.
- `ContextButtonBuilder` and `ContextSeparatorBuilder`: Builds `<context-button>` components.
- `DependencyBuilder`, `DependencyActionBuilder` and `DependencyElementBuilder`: Builds `<dependency>` components.

### **Criteria builders**

There is a builder for each criteria type defined on AWE:

- `ButtonCheckboxCriteriaBuilder`: Builds a `<criteria>` component with `button-checkbox` component.
- `ButtonRadioCriteriaBuilder`: Builds a `<criteria>` component with `button-radio` component.
- `CalendarCriteriaBuilder`: Builds a `<criteria>` component with `date` component.
- `CheckboxCriteriaBuilder`: Builds a `<criteria>` component with `checkbox` component.
- `ColorpickerCriteriaBuilder`: Builds a `<criteria>` component with `color` component.
- `FilteredCalendarCriteriaBuilder`: Builds a `<criteria>` component with `filtered-calendar` component.
- `HiddenCriteriaBuilder`: Builds a `<criteria>` component with `hidden` component.
- `MarkdownCriteriaBuilder`: Builds a `<criteria>` component with `markdown-editor` component.
- `NumericCriteriaBuilder`: Builds a `<criteria>` component with `numeric` component.
- `PasswordCriteriaBuilder`: Builds a `<criteria>` component with `password` component.
- `RadioCriteriaBuilder`: Builds a `<criteria>` component with `radio` component.
- `SelectCriteriaBuilder`: Builds a `<criteria>` component with `select` component.
- `SelectMultipleCriteriaBuilder`: Builds a `<criteria>` component with `select-multiple` component.
- `SuggestCriteriaBuilder`: Builds a `<criteria>` component with `suggest` component.
- `SuggestMultipleCriteriaBuilder`: Builds a `<criteria>` component with `suggest-multiple` component.
- `TextareaCriteriaBuilder`: Builds a `<criteria>` component with `textarea` component.
- `TextCriteriaBuilder`: Builds a `<criteria>` component with `text` component.
- `TextViewCriteriaBuilder`: Builds a `<criteria>` component with `text-view` component.
- `TimeCriteriaBuilder`: Builds a `<criteria>` component with `time` component.
- `UploaderCriteriaBuilder`: Builds a `<criteria>` component with `uploader` component.

### **Grid and column builders**

There are a couple of builders for grid elements:

- `GridBuilder`: Builds a `<grid>` component.
- `GroupHeaderBuilder`: Builds a `<group-header>` component.

And a builder for each column type:

- `CalendarColumnBuilder`: Builds a column with `date` component.
- `CheckboxColumnBuilder`: Builds a column with `checkbox` component.
- `ColorpickerColumnBuilder`: Builds a column with `color` component.
- `FilteredCalendarColumnBuilder`: Builds a column with `filtered-calendar` component.
- `MarkdownColumnBuilder`: Builds a column with `markdown-editor` component.
- `NumericColumnBuilder`: Builds a column with `numeric` component.
- `PasswordColumnBuilder`: Builds a column with `password` component.
- `SelectColumnBuilder`: Builds a column with `select` component.
- `SelectMultipleColumnBuilder`: Builds a column with `select-multiple` component.
- `SuggestColumnBuilder`: Builds a column with `suggest` component.
- `SuggestMultipleColumnBuilder`: Builds a column with `suggest-multiple` component.
- `TextareaColumnBuilder`: Builds a column with `textarea` component.
- `TextColumnBuilder`: Builds a column with `text` component.
- `TextViewColumnBuilder`: Builds a column with `text-view` component.
- `TimeColumnBuilder`: Builds a column with `time` component.
- `UploaderColumnBuilder`: Builds a column with `uploader` component.
- `IconColumnBuilder`: Builds a column with `icon` component.
- `ImageColumnBuilder`: Builds a column with `image` component.
- `ProgressColumnBuilder`: Builds a column with `progress` component.

### **Chart builders**

There are also a list of builders for chart components:

- `AxisBuilder`: Builds chart axis data.
- `ChartBuilder`: Builds a chart component.
- `ChartLegendBuilder`: Builds chart legend data.
- `ChartParameterBuilder`: Builds chart parameter data.
- `ChartSerieBuilder`: Builds chart serie data.
- `ChartTooltipBuilder`: Builds chart tooltip data.
