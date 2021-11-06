---
id: maintain
title: Maintain definition
sidebar_label: Maintain definition
---

The maintain engine is used to do operations that don't return data. These operations are valid for updating data in the server. They **only return** the result of proccess, if operation has been **ok** or if there has been a **problem** while doing the operation.

There are several types of maintain operations: insert, update, delete and multiple operations. Also a maintain operation can call a service to do the job (send email, print a report, ...).

You can put as many operations as you want inside a target. I.e. an insert operation followed by two update operations.

<img alt="Maintain engine" src={require('@docusaurus/useBaseUrl').default('img/Maintain_engine.png')}/>

:::info
**Note:** All maintains are defined in the `Maintain.xml` file at **global folder**. View [project structure](../guides/project-structure.md#global-folder) for more info.
:::

## Maintain

This section describes how the operations are made with AWE maintain engine.

### XML maintain structure

The simple maintain structure is the next one:

```xml
<target name="[target_name]" public="[public]">
  <[OPERATION] multiple="[multiple]" audit="[audit_table]">
    <table id="[table_name]" schema="[schema_name]"/>
    <field id="[field_name]" table="[table_name]" variable="[field_variable_name]" sequence="[sequence_name]"/>
    ... (more fields)
    <where>
      <and>
        <filter left-field="[Field id]" condition="[Condition]" right-variable="[Variable]"/>
        ... (more filters)
        <filter left-field="[Field id]" condition="[Condition]" right-variable="[Variable]"/>
      </and>
    </where>
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" list="[variable_list]"/>
    <variable id="[variable_name]" type="[variable_type]" value="[static_value]" />
    <variable id="[variable_name]" type="[variable_type]" session="[session_variable]"/>
    ... (more variables)

  </[OPERATION]>
</target>

```

> *Note:* [OPERATION] can be any of the following values: `insert`, `delete`, `update`, `multiple`, `commit`, `send-email`, `queue`, `serve` or `retrieve-data`.

### Maintain element

For easier development of maintain, not all elements are required.

| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| [target](#target-element) | **Required** | No | It describe the name of operation  |
| [insert](#insert) | Optional | Yes | Is used to do insert operations in database  |
| [update](#update) | Optional | Yes | Is used to do update operations in database  |
| [delete](#delete) | Optional | Yes | Is used to do delete operations in database  |
| [multiple](#multiple)| Optional | Yes | Is used to do multiples operations (insert, delete or update) in database at **once **|
| [commit](#commit)| Optional | Yes | Is used to do commit in database and store the changes  |
| [serve](#service-maintain)| Optional | Yes | Is used to do operations with services (Java or Web services) |
| [queue](#queue)| Optional | Yes | Is used to do operations with queues  |
| [send-email](#send-email)| Optional | Yes | Send an e-mails  |
| [retrieve-data](#retrieve-data)| Optional | Yes | Retrieve data from SQL, services, enumerated or queues |
| [table](#table-element)| Optional | No | Describes the table over the changes are done  |
| [where](#where-element)| Optional | No | Defines the conditions that must be met to perform the operation. Is the `where` sql clause  |
| [field](#field-element)| Optional | Yes|  It describes the **columns** of table over operate it  |
| [constant](#constant-element)| Optional | Yes| Constant field to update the table |
| [operation](#operation-element)| Optional | Yes| Operation field to update the table  |
| [variable](#variable-element)| Optional | Yes | Are parameters passed to maintains |

#### Target element

Target element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| name | **Required** | String | Maintain identifier                   | **Note:**  The name name must be unique            |
| public| Optional | Boolean |To set a query as launchable out of session (without being logged) | By default is `false`|                 
| label | Optional  | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 
| exclusive| Optional  | Boolean | To restrict the concurrently execution  of target | set this attribute to `true` if you don't want the target to be executed concurrently (some users at the same time)|

#### Table element

Table element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Name of table | **Note:** Is the real table name in data base            |
| schema | Optional | String | Use to set user owner of table | **Note:** Is the real schema (user) of table in data base         |

#### Where element

The element where has the following structure:

```xml
<target name="maintain">
...
  <where>
  <and>
    <filter left-field="[Filter field]" left-table="[Filter table]" condition="[Condition]" right-variable="[Variable]" optional="[Filter Optional]"/>
    <filter left-field="[Field 1]" left-table="[Filter table]" condition="[Condition]" 
      right-field="[Field 2]" right-table="[Table 2]" ignorecase="[Ignorecase]" trim="[Trim]"/>
    <filter left-field="[Field]" left-table="[Filter table]" condition="[Condition]" right-query="[Subquery]"/>
      <or>
       ... (more filters or filter groups)
      </or>
      ... (more filters or filter groups)
  </and>
  <or>
    ... (more filters or filter groups)
  </or>
 </where>
 ...
</target>
```

> **Note:** There are available two operators for link filters. `<and>` and `<or>`

#### Filter element

Filter element behaviour is the same as [query filter element](./query-definition.md#filter-element).

#### Field element

Field element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Name of field |  **Note:** Is the real column name of table in data base            |
| table | Optional | String | Table name of field |  |
| alias | Optional | String | Alias of field. It used to describe the field |  |
| sequence | Optional | String | Name of sequence to insert from `AweKey table`| **Note:** Only apply in `insert` maintains.  It's mandatory to define a new variable without name to use it and assign it to the variable attribute |
| key | Optional | Boolean | If field is a table key, this value must be set as `true` | **Note:** Only apply in `multiple` maintains |
| audit | Optional | Boolean | **ONLY** record this field on the audit table. **Note:** If this attribute is set to `true` this field will **NOT** be recorded on the table | Default value is `false` |
| variable | Optional | String | Used to set the input field with one variable value |  |
| query | Optional | String | Is the query identifier to do a subquery  | **Note:** The query id must exist |
| function | Optional | String | To apply sql function to field|The possible values are defined in [field functions](query-definition.md#field-functions) |
| cast  | Optional | String | Change the field format | The possible values are `STRING`, `INTEGER`, `LONG`, `FLOAT` and `DOUBLE` |

#### Constant element

The *constant* element has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Name of field |  **Note:** Is the real column name of table in data base            |
| table | Optional | String | Table name of field |  |
| function | Optional | String | To apply sql function to field|The possible values are defined in [field functions](query-definition.md#field-functions) |
| cast  | Optional | String | Change the field format | The possible values are `STRING`, `INTEGER`, `LONG`, `FLOAT` and `DOUBLE` |
| value | Required | String | A static value to be used as field value |  |
| type | Optional | String | Type of the value | The possible values are available [here](#variable-types) |

#### Operation element

The *operation* element allows to define operation between fields and will be resolved as SQL clauses:

```xml
<operation operator="[operator]" alias="[alias]">
  <constant value="[constant value]" />
  <field id="[field name]" table="[field table]" />
  ...
</field>
```

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Name of field |  **Note:** Is the real column name of table in data base            |
| table | Optional | String | Table name of field |  |
| operator    | Required | String    | Operator of the operation       | See [operator attribute](query-definition.md#operator-attribute)      |
| function | Optional | String | To apply sql function to field|The possible values are defined in [field functions](query-definition.md#field-functions) |
| cast  | Optional | String | Change the field format | The possible values are `STRING`, `INTEGER`, `LONG`, `FLOAT` and `DOUBLE` |

#### Variable element

Variable element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required** | String | Is the identifier name of variable | **Note**: The id must be unique |
| type | **Required** | String | Describe the type of variable |  Can be __STRING__, __INTEGER__, etc. |
| name | Optional | String | Name of a variable | The variable is the name of a criterion defined in the screen |
| optional | Optional  | Boolean | Setting this attribute to `true` will avoid an error in case of variable value can't be retrieved | Default value is `false` |
| value | Optional  | String | Value |           |
| property | Optional  | String | Name of property |           |
| session| Optional  | String | Name of session variable |        |

## **Sql maintain**

### **Insert**

Insert element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| multiple| Optional | Boolean| If `true` this operation will be launched as many times as defined list variable values are, if `audit` this operation will be audited as many times as defined list variable values are | `true`, `false` or `audit`         |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 
| audit | Optional | String | The name of the audit table where audit values are going to be stored  | **Note:** Audit table must exist        |
| query | Optional | String | Name of a query to retrieve data from an [INSERT INTO SELECT](#insert-into-select) statement  | **Note:** audit table will not be considered for INSERT INTO SELECT statements |

>**Note:** You can view `field` element information [here](#field-element)

The insert maintain structure is the next one:

```xml
<target name="[target_name]" public="[public]">
  <insert multiple="[multiple]" audit="[audit_table]">
    <table id="[table_name]"/>
    <field id="[field_name]" table="[table_name]" variable="[field_variable_name]" sequence="[sequence_name]"/>
    ... (more fields)
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" list="[variable_list]"/>
    <variable id="[variable_name]" type="[variable_type]" value="[static_value]" />
    <variable id="[variable_name]" type="[variable_type]" session="[session_variable]"/>
    ... (more variables)
  </insert>
</target>

```

> **Important:** the name of `sequence` attribute has been exist in AweKey table

### **`INSERT` examples**

```xml
<!-- Insert into AweQue table -->
<target name="QueNew">
   <insert audit="HISAweQue">
      <table id="AweQue"/>
      <field id="IdeAweQue" sequence="JmsKey" variable="IdeAweQue"/>
      <field id="Als" variable="Als"/>
      <field id="Des" variable="Des"/>
      <field id="QueTyp" variable="QueTyp"/>
      <field id="Act" variable="Act"/>
      <variable id="IdeAweQue" type="INTEGER" name="IdeAweQue" />
      <variable id="Als" type="STRING" name="Als" />
      <variable id="Des" type="STRING" name="Des" />
      <variable id="QueTyp" type="STRING" name="QueTyp" />    
      <variable id="Act" type="INTEGER" name="Act" value="1"/>
    </insert>
    <commit/>
    <serve service="RelJmsCon"/>
  </target>
```

```xml
<!-- Insert with historic data -->
<target name="SitNew">
  <insert audit="HISAweSit">
      <table id="AweSit"/>
      <field id="IdeSit" sequence="SitKey" variable="IdeSit"/>
      <field id="Nam" variable="Nam"/>
      <field id="Ord" variable="Ord"/>
      <field id="Act" variable="Act"/>
      <variable id="Nam" type="STRING" name="Nam" />
      <variable id="Ord" type="INTEGER" name="Ord" />
      <variable id="Act" type="INTEGER" name="Act" />
      <variable id="IdeSit" type="INTEGER" name="IdeSit" />
    </insert>
</target>
```

### **Insert into select**

The `INSERT INTO SELECT` statement is another way to make an insert statement, but retrieving data from a subquery. The structure of an `INSERT INTO SELECT` statement is the following:

```xml
<target name="[target_name]" public="[public]">
  <insert query="[query_to_retrieve_data_from]">
    <table id="[table_name]"/>
    <field id="[field_name]"/>
    ... (more fields)
  </insert>
</target>
```

>**Note:** The number of fields defined on `INSERT INTO SELECT` statement and subquery must match.

### **`INSERT INTO SELECT` examples**

```xml
<!-- Insert into select (maintain.xml) -->
<target name="test">
  <insert query="testData">
    <table id="test"/>
    <field id="Nam"/>
    <field id="Ord"/>
  </insert>
</target>

<!-- Query for data retrieving (queries.xml) -->
<query id="testData" distinct="true">
  <table id="AweKey" />
  <field id="KeyNam"/>
  <field id="Act"/>
</query>
```

This will generate the next SQL code:

```sql
INSERT INTO test (Nam, Ord) SELECT DISTINCT KeyNam, Act FROM AweKey
```

### **Update**

Update element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| multiple| Optional | Boolean| If `true` this operation will be launched as many times as defined list variable values are, if `audit` this operation will be audited as many times as defined list variable values are | `true`, `false` or `audit`         |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 
| audit | Optional | String | The name of the audit table where audit values are going to be stored  | **Note:** Audit table must exist |

>**Note:** You can view `where` element information [here](#where-element)

The update maintain structure is the next one:

```xml
<target name="[target_name]" public="[public]">
  <update multiple="[multiple]" audit="[audit_table]">
    <table id="[table_name]"/>
    <field id="[field_name]" table="[table_name]" variable="[field_variable_name]" audit="[audit]"/>
    ... (more fields)
    <where>
      <and>
        <filter left-field="[filter_field]" left-table="[filter_field_table]" condition="[filter_condition]" 
         right-variable="[filter_variable]" ignorecase="[filter_ignore_case]" trim="[filter_trim]"/>
        ... (more filters)
      </and>
    </where>
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" list="[variable_list]"/>
    <variable id="[variable_name]" type="[variable_type]" value="[static_value]" />
    <variable id="[variable_name]" type="[variable_type]" session="[session_variable]"/>
    ... (more variables)
  </update>
</target>

```

### **Update examples**

```xml
<!-- Manage User as logged out -->
<target name="MgrUsrLogOut" public="true">
  <!-- Mark User as logged out -->
  <update>
    <table id="ope"/>
    <field id="l1_con" variable="Con"/>
    <field id="l1_dat" variable="SysDat"/>
    <where>
      <and>
        <filter left-field="l1_nom" condition="eq" right-variable="Usr" ignorecase="true"/>
      </and>
    </where>
    <variable id="Con" type="INTEGER" value="0"/>
    <variable id="SysDat" type="SYSTEM_DATE" />
    <variable id="Usr" type="STRING" session="user" optional="false"/>
  </update>
</target>
```

```xml
<target name="UsrUpd">
  <update>
    <table id="ope"/>
    <field id="l1_act" variable="Sta"/>
    <field id="WebPrn" variable="WebPrn"/>
    <field id="PcPrn" variable="PcPrn"/>
    <field id="EmlAdr" variable="Eml"/>
    <field id="EmlSrv" variable="EmlSrv"/>
    <field id="l1_lan" variable="Lan"/>
    <field id="OpeNam" variable="Nam"/>
    <field id="IdePro" variable="Pro"/>
    <field id="IdeThm" variable="Thm"/>
    <field id="ScrIni" variable="ScrIni"/>
    <field id="Res" variable="Res"/>
    <field id="PwdLck" variable="PwdLck"/>
    <where>
      <and>
        <filter left-field="IdeOpe" condition="eq" right-variable="IdeOpe"/>
      </and>
    </where>
    <variable id="IdeOpe" type="INTEGER" name="IdeOpe" />
    <variable id="Sta" type="INTEGER" name="Sta" />
    <variable id="WebPrn" type="STRINGN" name="WebPrn" />
    <variable id="PcPrn" type="STRINGN" name="PcPrn" />
    <variable id="Eml" type="STRINGN" name="Eml" />
    <variable id="EmlSrv" type="STRINGN" name="EmlSrv" />
    <variable id="Lan" type="STRINGN" name="Lan" />
    <variable id="Nam" type="STRINGN" name="Nam" />
    <variable id="Pro" type="INTEGER" name="Pro" />
    <variable id="Thm" type="INTEGER" name="Thm" />
    <variable id="ScrIni" type="STRING" name="ScrIni" />
    <variable id="Res" type="STRING" name="Res" />
    <variable id="PwdLck" type="INTEGER" name="PwdLck" />
  </update>
</target>
```

### **Delete**

Delete element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| multiple| Optional | Boolean| If `true` this operation will be launched as many times as defined list variable values are, if `audit` this operation will be audited as many times as defined list variable values are | `true`, `false` or `audit`         |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 
| audit | Optional | String | The name of the audit table where audit values are going to be stored  | **Note:** Audit table must exist        |

>**Note:** You can view `where` element information [here](#where-element)

The delete maintain structure is the next one:

```xml
<target name="[target_name]" public="[public]">
  <delete multiple="[multiple]" audit="[audit_table]">
    <table id="[table_name]"/> 
    <field id="[field_name]" table="[table_name]" variable="[field_variable_name]" audit="[audit]"/>
    <where>
      <and>
        <filter left-field="[filter_field]" left-table="[filter_field_table]" condition="[filter_condition]" 
        right-variable="[filter_variable]" ignorecase="[filter_ignore_case]" trim="[filter_trim]"/>
        ... (more filters)
      </and>
    </where>
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" list="[variable_list]"/>
    <variable id="[variable_name]" type="[variable_type]" value="[static_value]" />
    <variable id="[variable_name]" type="[variable_type]" session="[session_variable]"/>
    ... (more variables)
  </delete>
</target>

```

#### **Delete examples**

```xml
<!-- Delete maintain with historic operation -->
<target name="ProDel">
  <delete audit="HISAweModPro">
    <table id="AweModPro"/>
    <field id="IdePro" variable="IdePro" audit="true"/>
    <where>
      <and>
        <filter left-field="IdePro" condition="eq" right-variable="IdePro" />
      </and>
    </where>
    <variable id="IdePro" type="INTEGER" name="IdePro"/>
  </delete>
</target>
```

```xml
<!-- Delete maintain with multiple atributte -->
<target name="UsrDel">
  <delete multiple="true">
    <table id="ope"/>
    <where>
      <and>
        <filter left-field="IdeOpe" condition="eq" right-variable="IdeOpe"/>
      </and>
    </where>
    <variable id="IdeOpe" type="INTEGER" name="IdeOpe"/>
  </delete>
</target>
```

### **Multiple**

The `multiple` maintains are used in `Grid` widget to perform sql operations.

Multiple element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| grid | **Required**| String | Is the grid name where operations are performed |   |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 
| audit | Optional | String | The name of the audit table where audit values are going to be stored  | **Note:** Audit table must exist |

> **IMPORTANT:** It must exist one field with attribute `key="true"` to indicate which field is the table key

#### **Multiple examples**

```xml
<!-- Screen Access Multiple -->
<target name="ScrAccUpd">
  <multiple audit="HISAweScrRes" grid="GrdScrAccLst">
    <table id="AweScrRes"/>
    <field id="IdeAweScrRes" variable="IdeAweScrRes" sequence="ScrResKey" key="true"/>
    <field id="IdePro" variable="IdePro"/>
    <field id="IdeOpe" variable="IdeOpe"/>
    <field id="IdeMod" variable="IdeMod"/>
    <field id="Opt" variable="Opt"/>
    <field id="AccMod" variable="AccMod"/>
    <field id="Act" variable="Act"/>
    <variable id="IdeAweScrRes" type="INTEGER" name="IdeAweScrRes"/>
    <variable id="IdeOpe" type="INTEGER" name="IdeOpe" optional="true"/>
    <variable id="IdePro" type="INTEGER" name="IdePro" optional="true"/>
    <variable id="IdeMod" type="INTEGER" name="IdeMod" optional="true"/>
    <variable id="Opt"  type="STRING" name="Opt" />
    <variable id="AccMod" type="STRING" name="AccMod"/>
    <variable id="Act" type="INTEGER" name="Act" />
  </multiple>
</target>
```

```xml
<!-- AweKey Update Multiple -->
<target name="AweKeyUpd">
  <multiple grid="GrdKeyLst">
    <table id="AweKey"/>
    <field id="KeyNam" variable="KeyNam" key="true"/>
    <field id="KeyVal" variable="KeyVal"/>
    <field id="Act" variable="Act"/>
    <variable id="KeyNam" type="STRING" name="KeyNam"/>
    <variable id="KeyVal" type="INTEGER" name="KeyVal"/>
    <variable id="Act" type="INTEGER" name="Act"/>
  </multiple>
</target>
```

### **Audits**

Audits are managed automatically with AWE, but the audit tables must be created on development time and they need to have at least three key fields:

*  **Audit user** - User who is doing the operation
*  **Audit timestamp** - Date and time of the audit operation
*  **Audit type** - Insert `(I)`, Update `(U)` or Delete `(D)` operation


### **Commit**

The tag `<commit/>` is used into maintain targets to force the **data stored** in the database. Usually, used between different maintenance operations to ensure that the data are correct before proceeding to the next step.

#### **Commit example**

```xml
<!-- Do commit before execute service operation -->
<target name="DbsDel">
  <delete multiple="true" audit="HISAweSitModDbs">
    <table id="AweSitModDbs"/>
    <field id="IdeDbs" variable="IdeDbs" audit="true"/>
    <where>
      <and>
        <filter left-field="IdeDbs" condition="eq" right-variable="IdeDbs" />
      </and>
    </where>
    <variable id="IdeDbs" type="INTEGER" name="IdeDbs"/>
  </delete>
  <delete multiple="true" audit="HISAweDbs">
    <table id="AweDbs"/>
    <field id="IdeDbs" variable="IdeDbs" audit="true" />
    <field id="Als" variable="Als" audit="true" />
    <field id="Des" variable="Des" audit="true" />
    <field id="Dct" variable="Dct" audit="true" />
    <field id="Typ" variable="Typ" audit="true" />
    <field id="Dbt" variable="Dbt" audit="true" />
    <field id="Dbc" variable="Dbc" audit="true" />
    <where>
      <and>
        <filter left-field="IdeDbs" condition="eq" right-variable="IdeDbs" />
      </and>
    </where>
    <variable id="IdeDbs" type="INTEGER" name="IdeDbs" />
    <variable id="Als" type="STRING" name="Als" />
    <variable id="Des" type="STRINGN" name="Des" />
    <variable id="Dct" type="STRING" name="Dct" />
    <variable id="Dbt" type="STRING" name="Dbt" />
    <variable id="Typ" type="STRING" name="Typ" />
    <variable id="Dbc" type="STRING" name="Dbc" />
  </delete>
  <commit/>
  <serve service="RelDbsCon"/>
</target>
```

## Service maintain

Are used to call services (Java or Web services) from maintain operation.

Service maintain has the following xml structure:

```xml
<target name="[target_name]" exclusive="[exclusive]" public="[public]">
  <serve service="[service_name]">
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]"/>
    <variable id="[variable_name]" type="[variable_type]" value="[static_value]"/>
    <variable id="[variable_name]" type="[variable_type]" session="[session_variable]"/>
    ... (more variables)
  </serve>
</target>
```

>**IMPORTANT**: Service maintain must have `<serve>` element. The service name must exist in file `Services.xml`. You can see [services](service-definition.md) for more information.

Serve element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| service | **Required**| String | Service indentifier | **Note:** The service id must exist in `Services.xml` file  |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 

#### **Service maintain examples**

```xml
<!-- Serve example -->
</target>
  <serve service="RelAllScrCfg" />
  <serve service="LoaScrCfgByDbs">
    <variable id="database" type="STRING" session="database"/>
  </serve>
</target>
```

```xml
<!-- Clear profile Cache -->
<target name="ClrCchPrf">
  <serve service="ClrCch">
    <variable id="cache" type="STRING" value="PROFILE"/>
  </serve>
</target>
```

## **Queue maintain**

Are used to send message to Jms queue from maintain operation.

Queue maintain has the following xml structure:

```xml
<target name="[target_name]" >
  <queue name="[Id_queue]">
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" [[list="list"] 
     [session="session_variable"] [value="static_value"] [property="property_value"]]/>
    ... (more variables)
  </queue>
</target>
```

>**IMPORTANT**: Queue maintain must have `<queue>` element. The queue name must exist in file `Queues.xml`. You can see [queues](jms-queues-definition.md) for more information.

Queue element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| name | **Required**| String | Queue indentifier | **Note:** The queue id must exist in `Queues.xml` file  |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 

#### **Queue maintain examples**

```xml
<!-- Test queues -->
<target name="TstQueSndSyn">
  <queue name="TstQueSndSyn">
    <variable id="Usr" type="STRING" name="CrtNam"/>
  </queue>
</target>
```

## **Email maintain**

Are used to send e-mails from maintain operation.

Email maintain has the following xml structure:

```xml
<target name="[target_name]" >
  <send-email name="[Email Id]">
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" [[list="list"] 
     [session="session_variable"] [value="static_value"] [property="property_value"]]/>
    ... (more variables)
  </send-email>
</target>
```

>**IMPORTANT**: Email maintain must have `<send-email>` element. The Email identifier must exist in file `Email.xml`. You can see [email definition](email-definition.md) for more information.

Email element in maintains has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| id | **Required**| String | Email indentifier | **Note:** The email id must exist in `Email.xml` file  |
| label | Optional | String | Is used to set the output message after executing maintenance  | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) | 

#### **Email maintain examples**

```xml
<!-- Send reports by e-mail -->
<target name="SndRep">
  <send-email id="SndRep"/>
</target>
```

## **Include target**

You can add an `include-target` tag to allow reuse defined targets instead of rewriting them.

Include target has the following xml structure:

```xml
<target name="[Target name]" >
  <include-target name="[target-to-include]"/>
</target>
```

>**IMPORTANT**: Include target must have `<include-target>` element. The `[target-to-include]` must exist in any of `Maintain.xml` files.

Include target has the following attributes:

| Attribute   | Use      | Type      |  Description                    |   Values                                           |
| ----------- | ---------|-----------|---------------------------------|----------------------------------------------------|
| name | **Required**| String | Target identifier | **Note:** The target name must exist in `Maintain.xml` file  |

#### **Include target examples**

```xml
<!-- Test insert -->
<target name="testInsert">
  <insert>
    <table id="HISAweMod" />
    <field id="HISope" variable="User" />
    <field id="HISdat" variable="Date" />
    <field id="HISact" variable="Action" />
    <field id="Nam" variable="Nam" />
    <field id="IdeThm" variable="Thm" />
    <field id="ScrIni" variable="Scr" />
    <field id="Act" variable="Act" />
    <variable id="Nam" type="STRING" value="testIncludeTarget" />
    <variable id="Thm" type="INTEGER" value="1" />
    <variable id="Scr" type="STRING" value="testIncludeTarget" />
    <variable id="Act" type="INTEGER" value="1" />
    <variable id="User" type="STRING" value="testIncludeTarget" />
    <variable id="Date" type="SYSTEM_DATE"/>
    <variable id="Action" type="STRING" value="T" />
  </insert>
</target>

<!-- Test update -->
<target name="testUpdate">
  <update>
    <table id="HISAweMod" />
    <field id="Nam" variable="Nam" />
    <field id="IdeThm" variable="Thm" />
    <field id="ScrIni" variable="Scr" />
    <field id="Act" variable="Act" />
    <where>
      <and>
        <filter left-field="HISope" condition="eq" right-variable="User"/>
        <filter left-field="HISact" condition="eq" right-variable="Action"/>
      </and>
    </where>
    <variable id="Nam" type="STRING" value="testIncludeTargetUpd" />
    <variable id="Thm" type="INTEGER" value="2" />
    <variable id="Scr" type="STRING" value="testIncludeTargetUpd" />
    <variable id="Act" type="INTEGER" value="2" />
    <variable id="User" type="STRING" value="testIncludeTarget" />
    <variable id="Action" type="STRING" value="T" />
  </update>
</target>

<!-- Test delete -->
<target name="testDelete">
  <delete>
    <table id="HISAweMod" />
    <where>
      <and>
        <filter left-field="HISope" condition="eq" right-variable="User"/>
        <filter left-field="HISact" condition="eq" right-variable="Action"/>
      </and>
    </where>
    <variable id="User" type="STRING" value="testIncludeTarget" />
    <variable id="Action" type="STRING" value="T" />
  </delete>
</target>

<!-- Test include -->
<target name="testInclude">
  <include-target name="testInsert"/>
  <include-target name="testUpdate"/>
  <include-target name="testDelete"/>
</target>
```

## **Retrieve data**

Retrieve data target is useful to retrieve some data from a query (SQL, service, enumerated, etc.) 
and send it to a maintain process.

Retrieve data has the following xml structure:

```xml
<target name="[target_name]">
  <retrieve-data service="[service_id]" enumerated="[enumerated_id]" queue="[queue_id]">
    <table .../>
    <field alias="[field_alias]"
    <variable id="[variable_name]" type="[variable_type]" name="[parameter_name]" [[list="list"] 
     [session="session_variable"] [value="static_value"] [property="property_value"]]/>
    ... (more variables)
  </retrieve-data>
</target>
```

`retrieve-data` tag works as a query defined on queries.xml. Every retrieved column will be 
stored as a parameter named as the column field alias.

> **NOTE:** If you are using AWE sequences, you should consider to prioritize this way of 
retrieving data for inserting it rather to `INSERT INTO SELECT` statements.

#### **Retrieve data examples**

```xml
<target name="testRetrieveDataAndInsertAfter">
  <retrieve-data>
    <table id="Table1"/>
    <field id="Field1" alias="name"/>
    <field id="Field2" alias="screen"/>
    <field id="Field3" alias="user"/>
    <field id="Field4" alias="action"/>
  </retrieve-data>
  <insert multiple="true">
    <table id="Table2"/>
    <field id="User" variable="User"/>
    <field id="Date" variable="Date"/>
    <field id="Action" variable="Action"/>
    <field id="Name" variable="Nam"/>
    <field id="Active" variable="Active"/>
    <variable id="User" type="STRING" name="user"/>
    <variable id="Date" type="SYSTEM_DATE"/>
    <variable id="Action" type="STRING" name="action"/>
    <variable id="Name" type="STRING" name="name"/>
    <variable id="Active" type="INTEGER" value="1"/>
  </insert>
</target>
```

This sample will retrieve a list of variables named `name`, `screen`, `user` and `action` 
and will use them as input parameters for insert statement to `Table2`.