---
id: selenium-testing
title: Selenium Tests
sidebar_label: Selenium Tests
---

This document gives a basic insight on how to start developing *Selenium* tests for applications developed with AWE. Before starting test development, make sure to read the *Selenium Test Development Guide*, specially the *Optimization/Help tips* section. Basic aspects you should know before starting to develop *Selenium* tests, such as general configurations and integration with *Jenkins*, are not treated in this document.

All the contents of this document are explained in a way that it is assumed the reader already knows how to use the tools and commands concerning *Selenium*.

:::tip
It is very important to comment all the tests. **Each block of commands** that is related to the interaction of a component **MUST start with a comment** that indicates what the test is trying to do.
:::

## Basic instructions

Currently our selenium tests definition are based on **Java WebDrivers**. 
These drivers allow the developer to launch a defined browser and actions 
over it to test the user interface.

To develop integration tests with WebDrivers on AWE, just follow the next steps:

- Import `awe-testing` package on your pom dependencies:

  ```xml
  <!-- Test dependencies -->
  <dependency>
    <groupId>com.almis.awe</groupId>
    <artifactId>awe-testing</artifactId>
    <scope>test</scope>
  </dependency>
  ```

- Define integration tests on pom:

  ```xml
  <!-- Spring boot -->
  <plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
      ...
      <execution>
        <id>pre-integration-test</id>
        <configuration>
          <wait>1000</wait>
          <maxAttempts>180</maxAttempts>
        </configuration>
        <goals>
          <goal>start</goal>
        </goals>
      </execution>
      <execution>
        <id>post-integration-test</id>
        <goals>
          <goal>stop</goal>
        </goals>
      </execution>
      ...
    </executions>
  </plugin>
  ```

- Define `failsafe` maven plugin to launch IT (integration) tests:

  ```xml
  <!-- Failsafe -->
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <executions>
      <execution>
        <id>integration-test</id>
        <goals>
          <goal>integration-test</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
  ```

- And it's Done! Just launch it with maven:

  ```
  mvn verify
  ```

### Test definition

To generate a selenium test just extend the `SeleniumUtilities` class on your integration test classes (XxxxxXxxIT.class):

```java
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class WebsocketTestsIT extends SeleniumUtilities {

  /**
   * Log into the application
   * @throws Exception
   */
  @Test
  public void t000_loginTest() throws Exception {
    checkLogin("test", "test", "span.info-text", "Manager (test)");
  }

  /**
   * Log out from the application
   * @throws Exception
   */
  @Test
  public void t999_logoutTest() throws Exception {
    checkLogout(".slogan", "Almis Web Engine");
  }

  /**
   * Tests something
   * @throws Exception Error on test
   */
  @Test
  public void t001_myFirstTest() throws Exception {
    // Title
    setTestTitle("My first test");

    // Test things
    // ...
  }
}
```

### Set test title

Every test should start with a title, just to find where the test starts
in the log file:

```java
// Test title
setTestTitle("My first test");
```

### Log in and log out

We've created two methods to simplify the login and logout actions:

To login the application just call to `checkLogin` method with the following 
parameters:
- **user** - Username
- **password** - Password
- **cssSelector** - CSS selector to find a text once logged into the application
- **text** - Text to find inside the selector node

 ```java
 // Title
 checkLogin("test", "test", "span.info-text", "Manager (test)");
 ```
 
 To logout the application just call to `checkLogout` method with the following 
 parameters:
 - **cssSelector** - CSS selector to find a text on the *signin screen*
 - **text** - Text to find inside the selector node
 
 ```java
 // Title
 checkLogout(".slogan", "Almis Web Engine");
 ```

### Go to a new page

To go to a new page, you need to call the `gotoScreen` method with a list of 
option names corresponding to the menu options you need to click to go to 
the selected screen. i.e. To go to the `sites` screen you need to click first 
on the `tools` menu option: 

```java
// Go to sites screen
gotoScreen("tools", "sites");
```  

### Click on a button 

To click on a button just call the `clickButton` method with the button name as parameter:

```java
// Click "ButSnd" button
clickButton("ButSnd");
```

If the button makes a new screen to load, you can tell the method to wait after the button call:

```java
// Click "ButNew" button and wait the screen to load
clickButton("ButNew", true);
```

If the button is a search button, you can call the `searchAndWait` method to wait the grid to load
(if the button is named `ButSch`):

```java
// Search and wait
searchAndWait();
```

If the button name is another one, just set it as first argument:

```java
// Search and wait
searchAndWait("mySearchButton");
``` 

### Wait for a grid to load

To wait a grid to load, call the `waitForLoadingGrid` method:

```java
// Wait a grid to load
waitForLoadingGrid();
``` 

### Accept a confirm dialog

To confirm a dialog just call the `acceptConfirm` method:

```java
// Confirm a dialog
acceptConfirm();
``` 

### Check and close a message

When the application returns a message, you can verify and close it with the `checkAndCloseMessage` method:

```java
// Accept message
checkAndCloseMessage(messageType);
```

Where **messageType** depends on the message you want to verify. You have the following message types:
* **success** - green message, when all is ok.
* **warning** - yellow message, there is a warning.
* **info** - blue message, a notification to the user.
* **danger** - red message, the application has failed somehow.

### Combo: Click button, accept confirm dialog and close message

There are operations which are usually launched together. 
The combination of clicking a button (confirmation button), accepting a dialog
and closing a success message is one of them. We've created a functionality to do all these
actions in one simple method:

```java
// Store and confirm
clickButtonAndConfirm("ButCnf");
```

- Clicks on "ButCnf" button (or defined one)
- Clicks on accept confirm dialog
- Waits for a **success** message and closes it

## Criteria

The following points describe how to fill the different type of criteria available in AWE screens:

### Input and Textarea

Simply call `writeText` method with the following parameters:
 - **criterionId** - Criterion identifier
 - **text** - Text to write

```java
// Insert text
writeText("criterionId", "textToWrite");
```

### Date

#### Pick a specific date in the datepicker

Call `selectDate` method with the following parameters:
 - **criterionId** - Date criterion identifier
 - **date** - Date to select

```java
// Select a date
selectDate("Cal", "23/10/1978");
```

#### Pick a day from the current month

Call `selectDay` method with the following parameters:
 - **criterionId** - Date criterion identifier
 - **day** - Day to select

```java
// Select a day in current month
selectDay("Cal", 23);
```

#### Pick a month in the month-selector

Call `selectMonth` method with the following parameters:
 - **criterionId** - Date criterion identifier
 - **month** - Month to select

```java
// Select a month in the month selector
selectMonth("Cal", 23);
```

#### Pick a year in the year-selector

Call `selectYear` method with the following parameters:
 - **criterionId** - Date criterion identifier
 - **year** - Year to select

```java
// Select a year in the year selector
selectYear("Cal", 2019);
```

### Time

Same way as [input and textarea](#input-and-textarea):

```java
// Write hour
writeText("Tim", "12:23:41");
```

### Select

To pick a result on a select criterion, call the `selectContain` method:
 - **criterionId** - Criterion identifier
 - **text** - Text to search on the result list

```java
// Select on selector
selectContain("Sta",  "Yes");
```

### Suggest

To use a suggest criterion, call the `suggest` method:
 - **criterionId** - Criterion identifier
 - **text to suggest** - Text to search for
 - **result label** - Text to search on the result list

```java
// Suggest on selector
suggest("Pro", "TS1", "TS1");
```

### Multiple select and suggest 

These two criteria can be tested the same way with the `suggestMultiple` criterion:
 - **criterionId** - Criterion identifier
 - **text to suggest** - Text to search for
 - **result label** - Text to search on the result list

```java
// Suggest
suggestMultiple("CrtOpc", "application-info", "application-info");
```

### Tabs

#### Check active tab

To check if a tab is active, call the `checkText` method:
- **cssSelector** - Selector to find the text node to check 
 - **text** - Text to check

```java
// Check if tab is active
checkText("[criterion-id='" + tabId + "'] li.active a", "Tab text");
```

#### Click on a tab

To click on a tab you can call the `clickTab` method:
 - **tabId** - Tab identifier
 - **tabOption** - Tab option label (locale)
 
```java
// Click on tab
clickTab("TabSelMat", "ENUM_MATRIX_MULTISELECT");
```

### Checkbox and radio button

Click on a checkbox or a radio button the same way with the `clickCheckbox` method:
 - **checkboxRadioId** - Criterion identifier

```java
// Click checkbox or radio button
clickCheckbox("ChkBoxVa1");
```

### Text view

To check if a text view component contains a text it depends on the text-view structure:
- **cssSelector** - Selector to find the text node to check 
- **text** - Text to check

```java
// Check visibility and contents
checkVisibleAndContains("[awe-tag-list='" + textViewId + "'] span", textToCheck);
```

### Verify criteria values

#### Text criteria

To verify text criteria contents, use the `checkCriterionContents` method:
 - **criterionId** - Criterion identifier
 - **text** - Text to match

```java
// Check criterion
checkCriterionContents("Nam", "Inf Changed");
```

#### Select and suggest criteria

To verify select and suggest criteria contents, use the `checkSelectorContents` method:
 - **criterionId** - Criterion identifier
 - **text** - Text to match

```java
// Check criterion
checkSelectContents("Scr", "Usr");
```

## Grid cells

### Input and textarea column

Simply call `writeText` method with the following parameters:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier 
 - **text** - Text to write

```java
// Write on text
writeText("GrdMuo", "Des2", "asdasda");
```

### Date column

#### Pick a specific date in the datepicker in a column

To pick a date on a grid row, call the selectDate method:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **date** - Date to pick

```java
// Click on date
selectDate("GrdEdi", "Dat", "23/10/1978");
```

#### Pick a day from the current month in a column

Call `selectDay` method with the following parameters:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **day** - Day to select

```java
// Select a day in current month
selectDay("GrdEdi", "Dat", 23);
```

### Time column

Same way as [input and textarea column](#input-and-textarea-column):
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **time** - Time to select
 
```java
// Write hour
writeText("gridId", "timeColumn", "12:23:41");
```

### Select column

To pick a result on a select criterion, call the `selectContain` method:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **text** - Text to search on the result list

```java
// Select text
selectContain("GrdScrCnf", "Act", "Yes");
```

### Suggest column

To use a suggest criterion, call the `suggest` method:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **text to suggest** - Text to search for
 - **result label** - Text to search on the result list

```java
// Search for text
suggest("GrdScrCnf", "Atr", "visible", "Visible");
```

### Multiple select and suggest in a column

These two criteria can be tested the same way with the `suggestMultiple` criterion:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier
 - **text to suggest** - Text to search for
 - **result label** - Text to search on the result list

```java
// Suggest
suggestMultiple("gridId", "columnId", "application-info", "application-info");
```

### Checkbox column

Click on a checkbox or a radio button the same way with the `clickCheckbox` method:
 - **gridId** - Grid identifier
 - **columnId** - Column identifier

```java
// Click checkbox on a grid
clickCheckbox("gridId", "columnId");
```

### Save button

To click on a grid save button, call the `saveRow` method.

```java
// Save line
saveRow();
```

If there are some grids in the screen, you need to add the grid identifier to the method:

```java
// Save line
saveRow("myGridIdentifier");
```

### Check a row value

To check if there are some specific texts inside a grid, call the `checkRowContents` method:

```java
// Check row contents
checkRowContents("test", "ADM", "Site changed");
```

You can add as many texts as you want to check.

If you want to check the contents of a specific cell, you can call the `checkCellContents` method:
 - **gridId** - Grid identifier
 - **rowId** - Row identifier
 - **columnId** - Column identifier
 - **text** - Text to match

```java
// Check date on second row
checkCellContents("GrdEdi", "2", "Dat", date);
```

### Click on a row

To click on a row with a defined text, call the `clickRowContents` method:
 - **gridId** - Grid identifier
 - **text** - Text to match

```java
// Click on grid
clickRowContents("GrdEdi", "asphalt");
```

Or if you want to click on a specific cell, you can call the `clickCell` method:
 - **gridId** - Grid identifier
 - **rowId** - Row identifier
 - **columnId** - Column identifier

```java
  // Click on a cell
  clickCell("GrdMuo", "1", "Des2");
```

### Expand or collapse a row

To expand or collapse a treegrid row, we've defined the `clickTreeButton` method:
 - **gridId** - Grid identifier
 - **rowId** - Row identifier
 
```java
// Click on button
clickTreeButton("TreGrdLoaEdi", "Prooperator");
```

### Context menu on a row

To open a context menu on a grid row, just call the `contextMenu` method:
 - **gridId** - Grid identifier
 - **rowId** - Row identifier
 - **columnId** - Column identifier
 
```java
// Context menu
contextMenu("TreGrdLoaEdi", "Progeneral-ModBase", "TreGrdLoaEdi_Nam");
```

### Context menu option

You can click on a context menu option with the `clickContextButton` option.
 - **menuOptions** - Options to click (ordered) in the context menu

```java
// Select context menu option
clickContextButton("CtxTreGrdLoaEdiAddSel", "CtxTreGrdLoaEdiAddChl");
```

## Samples

### Add a new site

```java
/**
 * Add a new site
 * @throws Exception
 */
@Test
public void t001_newSite() throws Exception {
  // Title
  setTestTitle("Add a new site");

  // Go to screen
  gotoScreen("tools", "sites");

  // Click on new button
  clickButton("ButNew", true);

  // Wait for button
  waitForButton("ButCnf");

  // Write on criterion
  writeText("Nam", "Site test");

  // Select last element
  selectLast("Act");

  // Write on criterion
  writeText("Ord", "3");

  // Click on button
  clickButton("ButGrdAdd");

  // Suggest on column selector
  suggest("SitModDbsLst", "IdeMod", "Base", "Base");

  // Suggest on column selector
  suggest("SitModDbsLst", "IdeDbs", "awedb", "awedb");

  // Write on criterion
  writeText("SitModDbsLst", "Order", "3");

  // Save line
  saveRow();

  // Check row values
  checkRowContents("Base", "awedb", "3");

  // Store and confirm
  clickButtonAndConfirm("ButCnf");
  
  // Wait for button
  clickButton("ButRst");

  // Suggest on column selector
  suggest("CrtSit", "Site test", "Site test");

  // Search on grid
  searchAndWait();

  // Click row
  clickRowContents("Site test");

  // Click on button
  clickButton("ButViw", true);

  // Wait for button
  waitForButton("ButBck");
  
  // Check row contents
  checkRowContents("Base", "awedb");
}
```

### Delete a module

```java
/**
 * Delete a module
 * @throws Exception
 */
@Test
public void t056_deleteModule() throws Exception {
  // Title
  setTestTitle("Delete a module");

  // Go to screen
  gotoScreen("tools", "modules");

  // Wait for button
  clickButton("ButRst");

  // Suggest on column selector
  suggest("CrtMod", "Inf", "Inf");

  // Search on grid
  searchAndWait();

  // Click row
  clickRowContents("Inf");

  // Store and confirm
  clickButtonAndConfirm("ButDel");

  // Wait for button
  clickButton("ButRst");

  // Search on grid
  searchAndWait();

  // Click row
  checkRowNotContains("Inf");  
}
```

### Update a database

```java
/**
 * Update a database connection
 * @throws Exception
 */
@Test
public void t033_updateDatabase() throws Exception {
  // Title
  setTestTitle("Update a database connection");

  // Go to screen
  gotoScreen("tools", "databases");

  // Wait for button
  clickButton("ButRst");

  // Suggest on column selector
  suggest("CrtAls", "DBSTest", "DBSTest");

  // Search on grid
  searchAndWait();

  // Click row
  clickRowContents("DBSTest");

  // Click on button
  clickButton("ButUpd", true);

  // Wait for button
  waitForButton("ButCnf");

  // Insert text
  writeText("Als", "DBSTest Changed");

  // Select on selector
  selectContain("Dct",  "Jdbc");

  // Insert text
  writeText("Dbc", "Test");

  // Insert text
  writeText("Des", "This is a database connection update test case");

  // Click on row
  clickRowContents("Site changed");

  // Suggest on column selector
  suggest("SitModDbsLst", "IdeMod", "Test", "Test");

  // Save line
  saveRow();

  // Check row
  checkRowContents("Test");

  // Store and confirm
  clickButtonAndConfirm("ButCnf");

  // Wait for button
  clickButton("ButRst");

  // Suggest on column selector
  suggest("CrtAls", "DBSTest Changed", "DBSTest Changed");

  // Search on grid
  searchAndWait();

  // Click row
  clickRowContents("DBSTest Changed");

  // Click on button
  clickButton("ButViw", true);

  // Wait for button
  waitForButton("ButBck");

  // Check contents
  checkCriterionContents("Als", "DBSTest Changed");

  // Check row contents
  checkRowContents("Test");
}
```
