---
id: chart
title: Charts
---

AWE uses [Highcharts](http://www.highcharts.com/) library for chart development. This javascript library allows build many types of dynamic graphics easily, quickly and flexibly. It has no dependencies on any other library. It´s compatible with most current browsers and has high performance.

## Browser compatibility

| Brand               | Version supported  |
| ------------------- | ------------------ |
| Internet Explorer   | 6.0+               | 
| Firefox             | 2.0+               | 
| Chrome              | 1.0+               | 
| Safari	          | 4.0+               | 
| iOS (Safari)        | 9.0+               | 
| Android Browser     | 2.0+               | 

> **Note:** Highcharts is open source library for **non comercial applications**. For commercial purposes, you must *purchase* a license to use it.

# Chart concepts

To get to grasp with how **Highcharts** works it is important to understand the various parts or concepts of a chart.
Below is an image and a description of the main concepts in a chart.

<img alt="understanding_highcharts" src={require('@docusaurus/useBaseUrl').default('img/understanding_highcharts.png')} />

* **Title:** Is the text that will be presented at the top of a chart. Also you can put a subtitle element to describe in more detail the graphic.

See [chart](#chart-element) for more information in XML structure.

* **Series:** Is one or more series of data presented on a chart.

See [series](#serie-element) for more information in XML structure.

* **Tooltip:** When hovering over a series or a point on the chart you can get a tooltip that describes the values on that perticular part of the chart.

See [tooltip](#tooltip) for more information in XML structure.

* **Legend:** The legend show the data series in the graph and allows for enabling and disabling one or more series.

See [legend](#legend-element) for more information in XML structure.

* **Axis:** The x and y-axis of the chart, can also use multiple axes for different dataseries. Most chart types, like the typical cartesian types line and column, have axes.

See [axis](#axis-element) for more information in XML structure.

### Highstock concepts

Highstock is based on Highcharts, meaning it has all the core functionality of Highcharts, plus some additional features. It recommends using highgraphics type when you want to show the evolution lot of data over time. Example: when you want show the changes of spot currency pair over a period of time.

<img alt="understanding_highstock" src={require('@docusaurus/useBaseUrl').default('img/understanding_highstock.png')} />

* **Navigator:** Allows you to fine tune the range of the chart which is displayed.

* **Range selector:** Allows you to quickly select a range to be shown on the chart or specify the exact interval to be shown.

* **Scrollbar:** Allows scrolling on the chart.

* **Crosshair:** Shows a line following the tooltip of a chart to better read results of the x-axis. This functionality can be found in the Tooltip option. Crosshairs can also be used in Highcharts, but are not enabled by default.

# XML skeleton

The basic chart structure is the next one:

```xml
<chart id="[Chart Id]" label="[Chart title]" subtitle="[Chart subtitle]" type="[Type chart]" initial-load="[Initial load]" target-action="[Action]">
  <chart-legend layout="[Layout]" align="[Align]" verticalAlign="[Vertical align]" />
  <x-axis label="[Label X-Axis]" type="[Type axis]"/>
  <y-axis label="[Label Y-Axis]"/>
  <chart-tooltip suffix="[Suffix value]" number-decimals="[Decimal numbers]"/>
  <chart-serie id="[Serie ID]" x-value="[X-Values]" y-value="[Y-value]" label="[Serie label]" />
  <chart-parameter type="[Type parameter]" name="[Name parameter]">
    <chart-parameter type="[Type paramter]" name="[Name parameter]" value="[Parameter value]"/>
  </chart-parameter>
</chart>
```

## Global chart structure

For easier development of graphics, not all labels are required.


| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
|[chart](#chart-element) | **Required** | No | Global node of chart. Generically describes the graph. Title, type, what query generates it, ...|
| [chart legend](#legend-element) | Optional | No | Describes the legend of chart|
| [chart tooltip](#tooltip-element) | Optional | No | The tooltip appears when hovering over a point in a series. By default the tooltip shows the values of the point and the name of the series  |
| [x-axis](#axis-element) | **Required** | No | Describes the X-axis of chart|
| [y-axis](#axis-element) | **Required** | Yes| Describes the Y-axis of chart. It is possible to have multiple axes and linking them with different data series |
| [chart serie](#serie-element) | **Required** | Yes | A series is a set of data.  It's represented as list of arrays with two values,  _[[x1,y1], [x2,y2]]_. Each array is a point in the serie represented by axis|
| [chart parameter](#chart-parameter-element) | Optional  | Yes | Are extra parameters for overwrite the chart structure |

### Chart element

Chart element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Chart identifier                        |                                                    |
| label | Optional| String | Is the title of chart                     | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)          |
| subtitle | Optional | String | Is the subtitle of chart               | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)          |
| type | **Required** | String | Type of chart | line, spline, column, column_3d, area, areaspline, arearange, areasplinerange, pie, pie_3d, donut, donut_3d, semicircle, mixed |
| stock-chart | Optional | Boolean | Flag to indicate a stock type chart | true or false |
| theme | Optional | String | Is the name of chart theme | **Note:** It must be exist the name of chart style |
| inverted | Optional | Boolean | Whether to invert the axes so that the x axis is vertical and y axis is horizontal. When true, the x axis is reversed by default. | true or false |
| stacking | Optional | String | Whether to stack the values of each series on top of each other | normal or percent |
| enable-data-labels | Optional | Boolean | Whether to defer displaying the data labels until the initial series animation has finished. | Defaults to true |
| format-data-labels | Optional | String | Use to format string for the data label. | Ex. Point y with 3 decimals `format-data-labels="{y:.3f}"` |
| zoom-type | Optional | String | Decides in what dimensions the user can zoom by dragging the mouse | xAxis, yAxis or all |
| initial-load | **Required** | String | For load the chart when the screen is generated | **Note:** Only can have the 'query' value |
| target-action | **Required** | String | Is the name of query to load chart |  |
| max | Optional  | Number | Number of points to be shown | **Note:** 0 stands for all elements |
| icon-loading | Optional    | String    | Set the loading icon | `spinner` (default), `square`, `circles`, `carpet`, `dots`, `folding`, `squarebar`, `circlebar`, `cubes`, `icon`, `custom`, `none` |

### Axis element
Axis element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| label | Optional | String | Is the name of axis | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| label-format | Optional | String | A format string for the axis label | Defaults to {value} Ex.: Add unit to axis `label-format = "{value} ºC"` |
| formatter-function | Optional | String | Javascript function to format axis labels. | **Note:** See [this](#axis-function-formatter) for more info. |
| label-rotation | Optional | Number | Rotation of the labels in degrees | Defaults to 0  |
| type | Optional | String | The type of axis. | Can be one of "linear", "logarithmic", "datetime" or "category". Defaults to linear |
| tick-interval | Optional | Number | The interval of the tick marks in axis units | **Note:** Note that datetime axes are based on milliseconds, so for example an interval of one day is expressed as 24 * 3600 * 1000. For more information read [this](http://api.highcharts.com/highcharts#xAxis.tickInterval) |
| allow-decimal | Optional | Boolean | Whether to allow decimals in this axis' ticks. When counting integers, like persons or hits on a web page, decimals must be avoided in the axis tick labels | Defaults to "true" |
| opposite | Optional | Boolean | Whether to display the axis on the opposite side of the normal. The normal is on the left side for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively  | Defaults to "false" |

### Axis function formatter

The list of functions formatter are:

- `formatCurrencyMagnitude`: function to format a currency number with its maginute.


Ex.:

300 to 300

100000 to 100K

1234 to 1.23K

12000000 to 12M

     

### Legend element
Legend element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| label | Optional | String | Is the title of legend | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| enabled | Optional | Boolean | For enabled or disabled the legend in the chart | Defaults to "true" |
| border-width | Optional | Number | The width of the drawn border around the legend | Default to "0" |
| layout | Optional | String | The layout of the legend items | Can be one of "horizontal" or "vertical". Defaults to "horizontal" |
| align | Optional | String | The horizontal alignment of the legend box within the chart area | Can be one of "left", "center" or "right". Defaults to "center" |
| verticalAlign | Optional | String | The vertical alignment of the legend box | Can be one of "top", "midle" or "bottom". Defaults to "bottom" |
| floating | Optional | Boolean | When the legend is floating, the plot area ignores it and is allowed to be placed below it | Can be one of "true" or "false". Defaults to "false" |

### Tooltip element
Tooltip element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| enabled | Optional | Boolean | For enabled or disabled the tooltip in the chart | Defaults to "true" |
| crosshairs | Optional | String | Display crosshairs to connect the points with their corresponding axis values | Can be one of "xAxis", yAxis or "all". |
| number-decimals | Optional | Number | Format tooltip value setting the number of decimals | |
| suffix | Optional | String | Format tooltip value adding a suffix string | Ex.: `suffix = " ºC"`|
| prefix | Optional | String | Format tooltip value adding a prefix string | Ex.: `prefix = "Temp. "`|
| point-format | Optional | String | The HTML of the point's line in the tooltip. Variables are enclosed by curly brackets | Ex.: `point-format = '{series.name}: <b>{point.y}</b><br/>'` Fore more info, read [this](http://api.highcharts.com/highcharts#tooltip.pointFormat)|
| date-format | Optional | String | For series on a datetime axes, the date format in the tooltip's header will by default be guessed based on the closest data points. This member gives the default string representations used for each unit | Ex.: `date-format = "%Y-%m-%d"` Fore more info, read [this](http://api.highcharts.com/highcharts#tooltip.date)|
| shared | Optional | Boolean| Shared tooltip for multiple series of chart | Defaults to "false"|

### Serie element
Serie element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Serie identifier |  |
| label | Optional | String | Is the name of serie. This value is shown in legend | **Note:** You can use [i18n](i18n-internationalization.md) files (locales)|
| type | Optional | String | Type of serie | line, spline, column, pie, area, areasplin, bar or scatter **Note:** If there are several series of different type, you should set the type attribute of chart element to "mixed" |
| color | Optional | String | Is used to set a color for serie | **Note:** You can use name of colors or hexadecimal code. Ex.: `color = "red"` or `color = "#BF0B23"` |
| x-value | **Required** | String | Defines the value of the point on the x axis. It corresponds to the `alias` attribute of the field in the query  |  |
| y-value | **Required** | String | Defines the value of the point on the y axis. It corresponds to the `alias` attribute of the field in the query  |  |
| z-value | Optional  | String | Defines the value of the point on the z axis. It corresponds to the `alias` attribute of the field in the query  |  |
| x-axis | Optional | Number | When using dual or multiple x axes, this number defines which xAxis the particular series is connected to. It refers to either the axis id | Default value is 0 |
| y-axis | Optional | Number | When using dual or multiple y axes, this number defines which yAxis the particular series is connected to. It refers to either the axis id | Default value is 0 |
| drilldown-serie | Optional | String | Is the serie Id of drilldown serie | **Note:** View [this](#drill-down-chart) example |
| drilldown | Optional | Boolean | Flag to indicate if the serie is used in a subchart | "true" or "false" |

### Chart parameter element
It used for overwrite values in chart elements. It has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| type | **Required** | String | Type of chart parameter | Can be one of "string", "integer", "long", "float", "double", "boolean", "array", "object" or "null". |
| name | **Required** | String | Name of chart parameter |  |
| value | Optional | String | Value of chart parameter |  |


# Series and queries concepts

In this section, it explains how works the integration between series of graphics and query engine of Awe. You have to consider the serie concept in highcharts. The series are represented as list of arrays with two values,  _[[x1,y1], [x2,y2]]_. Each array is a point in the serie represented by axis.

Therefore, you must set the values of x and y for point in a serie.  For this, exist the serie attributtes `x-value` and `y-value`.

This attributes corresponds to the `alias` attribute of the field in the query. Let's see the following example:

* **XML code of chart element**

```xml
<chart id="ChrBarTst" label="CHART_2" type="column_3d" initial-load="query" target-action="TstChrThrDatSrc">
  <x-axis label="SCREEN_TEXT_CHART_AXIS_DATES" type="datetime"/>
  <y-axis label="Temperaturas (ºC)"/>
  <chart-serie id="serie2-1" x-value="dates" y-value="serie1" type="column" label="SCREEN_TEXT_CHART_SERIE_1" />
  <chart-serie id="serie2-2" x-value="dates" y-value="serie2" type="column" label="SCREEN_TEXT_CHART_SERIE_2" />
  <chart-serie id="serie2-3" x-value="dates" y-value="serie3" type="column" label="SCREEN_TEXT_CHART_SERIE_3" />
</chart>
```

* **Query code to load chart**

``` xml
  <!-- GET THREE DATA SERIES WITH DATES -->
  <query id="TstChrThrDatSrc" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" transform="DATE_MS" function="TRUNCDATE" alias="dates"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" `alias="serie1"` transform="NUMBER"/>
    <computed format="(parseInt(Math.random()*10,10)+1)+2" eval="true" alias="serie2" transform="NUMBER"/>
    <computed format="((parseInt(Math.random()*10,10)+1)*2)-4" eval="true" alias="serie3" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
  </query>
```

In this example, you can see the attribute `x-value = "dates"` of  chart serie is equal to attribute `alias` in field element and the attribute `y-value = "serie1"` is equal to alias in the query.

> **Note:** If the axis type is **datetime**, highchart library expects you to do a transform to format date as long value. A JavaScript date timestamp (milliseconds since Jan 1st 1970). Awe provides **transform = "DATE_MS"**.


# Examples

You can see a lot of chart examples in **[highcharts demo page](http://www.highcharts.com/demo)**

Next, it shown examples build with the AWE chart engine:

## Line chart

<img alt="Chart_line" src={require('@docusaurus/useBaseUrl').default('img/Chart_line.png')} />

* **Line chart XML**

``` xml
<window label="SCREEN_TEXT_LINE_CHART" maximize="true" icon="line-chart" style="expand">
   <chart id="ChrLinTst" label="SCREEN_TEXT_LINE_CHART" type="line" theme="dark-unica" initial-load="query" target-action="TstChrTwoSrc" zoom-type="xAxis" max="30" >
     <chart-legend label="Leyenda" verticalAlign="middle" align="right" border-width="1"/>
     <x-axis label="Fechas" type="datetime"/>
     <y-axis label="Temperaturas (ºC)"/>
     <chart-tooltip crosshairs="xAxis" suffix=" ºC" number-decimals="1"/>
     <chart-serie id="serie-1" x-value="dates" y-value="serie1" label="Serie 1" color="#0080FF"/>
     <chart-serie id="serie-2" x-value="dates" y-value="serie2" label="Serie 2" color="#81DAF5"/>
     <context-button id="CtxLinTstRef" label="BUTTON_RELOAD" icon="refresh">
       <button-action type="server" server-action="data" target-action="TstChrTwoSrc" target="ChrLinTst"/>
     </context-button>
   </chart>
</window>
```

* **Query XML**

``` xml
  <!-- GET TWO DATA SERIES -->
  <query id="TstChrTwoSrc" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" function="TRUNCDATE" alias="dates" transform="DATE_MS"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="parseInt(Math.random()*10,10)+2" eval="true" alias="serie2" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
  </query>
```

## Area chart

<img alt="Chart_area" src={require('@docusaurus/useBaseUrl').default('img/Chart_area.png')} />

* **Area chart XML**

``` xml
<window label="SCREEN_TEXT_AREA_CHART" maximize="true" icon="area-chart" style="expand">        
  <chart id="ChrAreTst" label="Grafico 5" type="areasplin" initial-load="query" target-action="TstChrTwoSrcLab" max="16">
    <chart-legend align="right" verticalAlign="top" floating="true"/>
    <x-axis label="Fechas" type="datetime">
    <chart-parameter type="object" name="dateTimeLabelFormats">
      <chart-parameter type="string" name="day" value="%Y-%m-%d"/>
    </chart-parameter>    
    <y-axis label="Temperaturas (ºC)"/>
    <chart-tooltip suffix=" ºC" number-decimals="3"/>
    <chart-serie id="serie1" x-value="dates" y-value="serie1" label="Serie 1" />
    <chart-serie id="serie2" x-value="dates" y-value="serie2" label="Serie 2" />
  </chart>
</window>
```

* **Query XML**

``` xml
  <!-- GET TWO DATA SERIES WITH A LABEL -->
  <query id="TstChrTwoSrcLab" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" function="TRUNCDATE" alias="dates" transform="DATE_MS"/>
    <computed format="parseInt(Math.random()*10,10)+2" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" alias="serie2" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
    <where>
      <and>
        <filter field="HISdat" condition=">=" variable="MinDat"/>
      </and>
    </where>
    <variable id="MinDat" type="DATE" value="14/05/2013" />
  </query>
```

## Bar chart

<img alt="Chart_bar" src={require('@docusaurus/useBaseUrl').default('img/Chart_bar.png')} />

* **Bar chart XML**

``` xml
<window label="SCREEN_TEXT_BAR_CHART_HORIZONTAL" maximize="true" icon="bar-chart" style="expand">       
  <chart id="ChrBarHorTst" label="Grafico 3" type="column" enable-data-labels="true" format-data-labels="{y:.3f}"    inverted="true" initial-load="query" target-action="TstChrThrDatSrcHor" max="3">
   <chart-legend layout="vertical" align="right" verticalAlign="middle" border-width="1"/>
   <x-axis label="SCREEN_TEXT_CHART_AXIS_DATES" type="datetime" tick-interval="259200"/>
   <y-axis label="Temperaturas (ºC)" tick-interval="1" label-format="{value} ºC"/>
   <chart-tooltip suffix=" ºC" number-decimals="3" date-format="%Y-%m-%d"/>
   <chart-serie id="serie1" x-value="dates" y-value="serie1" label="Serie 1" />
   <chart-serie id="serie2" x-value="dates" y-value="serie2" label="Serie 2" />
  </chart>
```

* **Query XML**

``` xml
  <!-- GET THREE DATA SERIES WITH DATES (horizontal) -->
  <query id="TstChrThrDatSrcHor" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" transform="DATE_MS" function="TRUNCDATE" alias="dates"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="(parseInt(Math.random()*10,10)+1)+2" eval="true" alias="serie2" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
  </query>
```

## Donut 3D chart

<img alt="Chart_donut" src={require('@docusaurus/useBaseUrl').default('img/Chart_donut.png')} />

* **3D donut chart XML**

``` xml
<window label="SCREEN_TEXT_DONUT_CHART" icon="pie-chart" maximize="true" style="expand">
  <chart id="ChrDonutTst" label="Grafico 7" type="donut_3d" initial-load="query" target-action="TstChrPieSrc" max="5">
    <chart-legend enabled="true"/>
    <x-axis label="Themes"/>
    <y-axis label="Percent (%)"/>
    <chart-tooltip suffix=" %" number-decimals="2"/>
    <chart-serie id="serie1" x-value="names" y-value="serie1" label="Themes" />
  </chart>
 </window>
```

* **Query XML**

``` xml
 <query id="TstChrPieSrc" distinct="true">
  <table id="AweThm"/>
  <field id="Nam" alias="names"/>
  <computed format="parseInt(Math.random()*100,10)" eval="true" alias="serie1" transform="NUMBER"/>
 </query>
```

## Column 3D chart

<img alt="Chart_3d_column" src={require('@docusaurus/useBaseUrl').default('img/Chart_3d_column.png')} />

* **3D column chart XML**

``` xml
 <window label="SCREEN_TEXT_BAR_CHART" maximize="true" icon="bar-chart" style="expand">      
   <chart id="ChrBarTst" label="Grafico 2" subtitle="Subtitulo grafico 2" type="column_3d" stacking="normal" initial-load="query" target-action="TstChrThrDatSrc" max="21">
     <chart-legend layout="vertical" align="right" verticalAlign="middle" />
     <x-axis label="SCREEN_TEXT_CHART_AXIS_DATES" type="datetime"/>
     <y-axis label="Temperaturas (ºC)"/>
     <chart-tooltip crosshairs="xAxis" suffix=" ºC" number-decimals="3"/>
     <chart-serie id="serie2-1" x-value="dates" y-value="serie1" type="column" label="SCREEN_TEXT_CHART_SERIE_1" />
     <chart-serie id="serie2-2" x-value="dates" y-value="serie2" type="column" label="SCREEN_TEXT_CHART_SERIE_2" />
     <chart-serie id="serie2-3" x-value="dates" y-value="serie3" type="column" label="SCREEN_TEXT_CHART_SERIE_3" />
    </chart>
  </window>

```

* **Query XML**

``` xml
  <!-- GET THREE DATA SERIES WITH DATES -->
  <query id="TstChrThrDatSrc" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" transform="DATE_MS" function="TRUNCDATE" alias="dates"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="(parseInt(Math.random()*10,10)+1)+2" eval="true" alias="serie2" transform="NUMBER"/>
    <computed format="((parseInt(Math.random()*10,10)+1)*2)-4" eval="true" alias="serie3" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
  </query>
```

## Stock chart

<img alt="Chart_stock" src={require('@docusaurus/useBaseUrl').default('img/Chart_stock.png')} />

* **Stock chart XML**

``` xml
<window label="SCREEN_TEXT_STOCK_CHART" maximize="true" icon="line-chart" style="expand">        
   <chart id="ChrStockTst" label="Grafico 4" stock-chart="true" zoom-type="xAxis" type="line" initial-load="query" target-action="TstChrThrDatSrcHor">
     <x-axis label="Fechas" type="datetime"/>
     <y-axis label="Temperaturas (ºC)" label-format="{value} ºC"/>
     <chart-tooltip suffix=" ºC" number-decimals="2"/>
     <chart-serie id="serie1" x-value="dates" y-value="serie1" label="Serie 1" />
   </chart>
 </window>

```

* **Query XML**

``` xml
  <!-- GET THREE DATA SERIES WITH DATES (horizontal) -->
  <query id="TstChrThrDatSrcHor" distinct="true">
    <table id="HISAweDbs"/>
    <field id="HISdat" transform="DATE_MS" function="TRUNCDATE" alias="dates"/>
    <computed format="(1/(parseInt(Math.random()*10,10)+1))*10" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="(parseInt(Math.random()*10,10)+1)+2" eval="true" alias="serie2" transform="NUMBER"/>
    <order-by field="dates" type="ASC"/>
  </query>
```

## Drill down chart

<img alt="Chart_drilldown" src={require('@docusaurus/useBaseUrl').default('img/Chart_drilldown.png')} />

* **Drill down chart XML**

``` xml
<window label="SCREEN_TEXT_PIE_CHART" maximize="true" icon="pie-chart" style="expand">        
  <chart id="ChrPieTst" label="Grafico 6" type="pie" initial-load="query"  enable-data-labels="true" format-data-labels="&lt;b&gt;{point.name}&lt;/b&gt;: {point.percentage:.1f} %" target-action="TstChrPieDrillSrc" max="5">
    <chart-legend enabled="true"/>
    <x-axis label="Themes"/>
    <y-axis label="Percent (%)"/>
    <chart-tooltip suffix=" %" number-decimals="2"/>
    <chart-serie id="serie1" x-value="names" y-value="serie1" label="Themes" drilldown-serie="serie1_1"/>
    <chart-serie id="serie1_1" drilldown="true" x-value="names" y-value="subserie1" label="SubThemes"/>
  </chart>
</window>

```

* **Query XML**

``` xml
  <!-- GET PIE DATA -->
  <query id="TstChrPieDrillSrc" distinct="true">
    <table id="AweThm"/>
    <field id="Nam" alias="names"/>
    <computed format="parseInt(Math.random()*100,10)" eval="true" alias="serie1" transform="NUMBER"/>
    <computed format="(parseInt(Math.random()*100,10))+2" eval="true" alias="subserie1" transform="NUMBER"/>
  </query> 
```

## Semicircle chart

<img alt="Chart_semicircle" src={require('@docusaurus/useBaseUrl').default('img/Chart_semicircle.png')} />

* **Semicircle chart XML**

``` xml
<window label="SCREEN_TEXT_SEMICIRCLE_CHART" icon="pie-chart" maximize="true" style="expand">
   <chart id="ChrSemiCircleTst" label="Grafico 8" type="semicircle" theme="gray" enable-data-labels="true" initial-load="query" target-action="TstChrPieSrc" max="5">
     <chart-legend enabled="true"/>
     <x-axis label="Themes"/>
     <y-axis label="Percent (%)"/>
     <chart-tooltip suffix=" %" number-decimals="2"/>
     <chart-serie id="serie1" x-value="names" y-value="serie1" label="Themes" />
     <chart-parameter type="object" name="title">
       <chart-parameter type="string" name="align" value="center"/>
       <chart-parameter type="string" name="verticalAlign" value="middle"/>
       <chart-parameter type="integer" name="y" value="50"/>
     </chart-parameter>
     <chart-parameter type="object" name="plotOptions">
       <chart-parameter type="object" name="pie">
       <chart-parameter type="object" name="dataLabels">
          <chart-parameter type="boolean" name="enabled" value="true"/>
          <chart-parameter type="integer" name="distance" value="-50"/>
          <chart-parameter type="object" name="style">
            <chart-parameter type="string" name="fontWeight" value="bold"/>
            <chart-parameter type="string" name="color" value="white"/>
            <chart-parameter type="string" name="textShadow" value="0px 1px 2px black"/>
          </chart-parameter>
        </chart-parameter>
       </chart-parameter>
      </chart-parameter>
    </chart>
 </window>
```

* **Query XML**

``` xml
  <query id="TstChrPieSrc" distinct="true">
    <table id="AweThm"/>
    <field id="Nam" alias="names"/>
    <computed format="parseInt(Math.random()*100,10)" eval="true" alias="serie1" transform="NUMBER"/>
  </query>
```


# Chart themes

AWE charts engine and Highcharts library allow to change style easily.

There are some themes by default. Just to have setting the attribute `theme` in chart element with the name of theme.

The available theme list is:

-   dark-unica
-   dark-green
-   dark-blue
-   gray
-   grid

## Creating your own theme

Here is simple example to show the process:

```javascript
/**
 * Dark theme for Highcharts JS
 */

Highcharts.theme["your-theme"] = {
colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },

    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }   
    }
};

```

> **Note:** You must add the new file name into **scripts.xml** file on your project.


# Advanced chart concepts

In this section it explain advanced concepts about AWE chart engine:

## Overwrite highchart attributes

The chart widget in Highcharts library are based on Json language. With `<chart-parameter>` element, you can add and overwrite highchart api attributes to change the behaviour of chart.

> **Note:** Highchart API is available [here](http://api.highcharts.com/highcharts)

* **Example:** Change format of labels in xAxis:

```xml
  <x-axis label="Fechas" type="datetime">
    <chart-parameter type="object" name="dateTimeLabelFormats">
      <chart-parameter type="string" name="day" value="%Y-%m-%d"/>
    </chart-parameter>
  </x-axis>
```

* **Example:** Change title position in a chart:

```xml
   <chart-parameter type="object" name="title">
     <chart-parameter type="string" name="align" value="center"/>
     <chart-parameter type="string" name="verticalAlign" value="middle"/>
     <chart-parameter type="integer" name="y" value="50"/>
   </chart-parameter>
```

* **Example:** Change plot options to modify the style of chart:

```xml
<chart-parameter type="object" name="plotOptions">
    <chart-parameter type="object" name="pie">
       <chart-parameter type="object" name="dataLabels">
         <chart-parameter type="boolean" name="enabled" value="true"/>
         <chart-parameter type="integer" name="distance" value="-50"/>
         <chart-parameter type="object" name="style">
          <chart-parameter type="string" name="fontWeight" value="bold"/>
          <chart-parameter type="string" name="color" value="white"/>
          <chart-parameter type="string" name="textShadow" value="0px 1px 2px black"/>
          </chart-parameter>
        </chart-parameter>
     </chart-parameter>
  </chart-parameter>
```

# Chart render service

Highcharts has an export server which allows you to generate high quality charts on the server side:

https://www.highcharts.com/docs/export-module/setting-up-the-server

We have developed a new render service which allows you to generate charts in `SVG` format using this export server and 
AWE charts.

## Defining charts

Defining a chart to be generated on server is similar to defining a chart to be shown on a browser. 

You define a screen and inside the chart, as shown before. 
This screen can be or not in the application, it doesn't matter.

The charts defined for server generation doesn't need `server-action` and `target-action` attributes, as
data sources are going to be passed as parameters.

## Usage

There is a new service designed to generate charts in server side, called `ChartService`.
This service has two methods which allows the developer to generate charts using a single datasource or multiple datasources:

### Render a chart with a single `DataList`

Render chart method (with a single `DataList`) generates a chart using only one 
DataList as datasource.

```java
public String renderChart(String screenName, String chartName, DataList data) throws AWException
```

* `screenName` is the name of the screen file where chart is
* `chartName` is the `id` of the chart to be generated
* `data` is the source `DataList`

This method will return a chart in SVG+XML format (or AWException if there is an error).

### Render a chart with multiple `DataList`

Render chart method (with a map of `DataList`) generates a chart using multiples datalists.

```java
public String renderChart(String screenName, String chartName, Map<String, DataList> datasources) throws AWException
```

* `screenName` is the name of the screen file where chart is
* `chartName` is the `id` of the chart to be generated
* `datasources` is a map of String and DataList which will contain all data sources.

This method will return a chart in SVG+XML format (or AWException if there is an error).

One of the data must be called `main`, and will be the default one, the rest will match a parameter `datasource` defined
on the serie which should pick the data. For example, this serie would pick the DataList inside the `detail` map key:

```xml
<chart-serie id="data" x-value="name" y-value="value"/>
<chart-serie id="detail" x-value="name" y-value="value">
  <chart-parameter type="string" name="datasource" value="detail"/>
</chart-serie>
```

the corresponding map for this serie should be:

```java
Map<String, DataList> datasources = new HashMap<>();
datasources.put("main", mainDataList);
datasources.put("detail", detailDataList);
```

The first serie (`data`) will pick the data defined on `main` key 
and the second serie (`detail`) will pick the data defined on `detail` key

## Render server

You can configure the render server on `application.properties` file updating the `highcharts.server.url` property:

```properties
################################################
# Chart properties
################################################
highcharts.server.url=http://export.highcharts.com
```

The default export server is pointing to Highcharts export server: `http://export.highcharts.com`