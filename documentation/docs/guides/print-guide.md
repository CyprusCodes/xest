---
id: print-engine
title: Print engine
sidebar_label: Print engine
---

AWE has a generic printing engine in order to print the content of a screen. This printing engine allows printing the content of a screen in pdf, excel and doc formats.

## Printing a screen

For printing a screen we need to include the generic AWE printing dialog in the screen we want to print: 

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

The second step is to add a print button, that opens the dialog we have included: 

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

Once we have followed these two steps we are ready to print the screen. If we click in "Print" button the following dialog will be shown and we'll be able to select the printing options and generate the document we want:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

## Configure title

By default, the title of a printed report is generated with the pattern "report title : report subtitle", being the
report title and subtitle the label of the tabcontainer, window, grid or whatever we have in the screen.

If we have the following screen:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

If we print it without any configuration, as mentioned before, the title with be generated with the screen title (Bond cash blotter) and the tabcontainer title (Detail blotter):

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

If we need to set a different subtitle for the first `tabcontainer`, we just need to define the `label` attribute with a
locale:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

The screen does not change but if we print it we'll see the title is different:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

Furthermore, we could have another case in which we'd need to remove the main title from the report and generate the
report just with the subreport title. For doing this, we just need to set an empty value to the `label` attribute of the
screen:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

As we can see in the following picture, this will set the title composed with the subtitle we have previously configured for the tabcontainer:

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />

## Configure printing data

For AWE 3.2 and upper versions, the printing engine prints the content of the screen the user is viewing currently. It takes the data from the client side and sends it to the printing engine. 

This can be a issue in some cases. For example, if a grid pagination is delegated to the server-side (load-all="false"). This is meant to retrieve 30 rows of the entire query to the client to avoid performance issues. How to solve this problem if we want to print all the results of the query? There are two options:

1. Change pagination to local-pagination (load-all="true"). This is meant to retrieve all the query results to the client, so we can print all. 
:::caution
In some cases, this will lead to a serious performance issue. Specially if the query returns a big amount of rows. It has to be taken into consideration.
:::

2. The second options is to execute the query of the grid again when printing the screen. The difference in this case is that the data of the database might be modified and the data the user is viewing in the screen and the data being printed could be different. For using this solution we need to add an additional hidden criterion to our screen: 

<img alt="image" src={require('@docusaurus/useBaseUrl').default('img/image.png')} />
