---
id: service
title: Services Definition
sidebar_label: Services Definition
---

Service operations are designed to perform specific treatments and calculations out of the AWE utilities.

Currently there are two types of services declared in the AWE Engine: **Java Services** and **Web Services**

:::info
**Note:** All services are defined in the `Services.xml` file at **global folder**. View [project structure](../guides/project-structure.md#global-folder)  for more info.
:::

## **Global service structure**

The xml structure of services is:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<services xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation = "https://aweframework.gitlab.io/awe/docs/schemas/services.xsd">
  <service id="[Service Id]">
    <java classname="[Java class]" method="[Java method]">
      <service-parameter type="[Type]" name="[Parameter name]" qualifier="[Bean name]" />
      ... (More <service_parameter>)
    </java>
  </service>
  <service id="[Service Id]">
    <microservice name="[Microservice name]" method="[REST method]" endpoint="[Service endpoint]">
      <service-parameter type="[Type]" name="[Parameter name]" />
      ... (More <service_parameter>)
    </microservice>
  </service>
  <service id="[Service Id]">
    <rest method="[REST method]" endpoint="[Service endpoint]" wrapper="[REST service wrapper]">
      <service-parameter type="[Type]" name="[Parameter name]" />
      ... (More <service_parameter>)
    </rest>
  </service>  
  ... (More <service>)
</services>
```

For easier development of services, not all elements are required.


| Element     | Use      | Multiples instances    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| services | **Required**| No | Root element of services xml file|
| [service](#service-element) | **Required**| Yes |Outlines the service. Also describes the **kind of service** (java service or web service)  |
| [java](#java-element) | **Optional**| No | Used to define java services  |
| [microservice](#microservice-element) | **Optional**| No | Used to define microservices  |
| [rest](#rest-service-element) | **Optional**| No | Used to define rest services  |
| [service-parameter](#service-parameter-element) | **Optional**| No | Used to pass parameters to service  |

### Service element

Service element has the following attributes:

| Attribute    | Use          | Type      |  Description                                       |   Values                                |
| ------------ | -------------|-----------|----------------------------------------------------|-----------------------------------------|
| id           | **Required** | String    | Name of service                                    |  **Note:** The id must be unique        |
| launch-phase | Optional     | String    | Launch the service in some application points      | `APPLICATION_START`, `APPLICATION_END`, 
`CLIENT_START`, `CLIENT_END` |

### Java element

Java element has the following attributes:

| Attribute   | Use          | Type      |  Description                        |   Values                                           |
| ----------- | -------------|-----------|-------------------------------------|----------------------------------------------------|
| classname   | **Required** | String    | Class name of java service                                    | Ex.: `classname="com.almis.awe.core.services.controller.AccessController"`
| method      | **Required** | String    | Method name of class to be executed                           | Ex.: `method="login"` |
| qualifier   | Optional     | String    | Qualifier bean name. If uses `@Qualifier` spring annotation   | Ex.: `qualifier="myBean"` |

### Microservice element

Microservice element has the following attributes:

| Attribute    | Use          | Type      |  Description                         |   Values                                           |
| ------------ | -------------|-----------|------------------------------------- |----------------------------------------------------|
| name         | **Required** | String    | Name of web service                  | **Note:** Must be unique                           |
| method       | **Required** | String    | REST method.                         | **GET**: Send the parameters as part of the endpoint - POST**: Send the parameters in the request body |
| endpoint     | **Required** | String    | Path to REST call                    | Ej: /data/ServiceData or /maintain/ServiceMaintain |
| wrapper      | Optional     | String    | Classname to wrap REST call response | Ej: com.almis.awe.test.bean.Postman                     |
| content-type | Optional     | String    | Way to send the parameters           | `URLENCODED` (default), `JSON`                     |
| cacheable    | Optional     | Boolean   | Used to set service as cacheable     | Default value is `false`                           |

### REST service element

REST service element has the following attributes:

| Attribute    | Use          | Type      |  Description                         |   Values                                             |
| ------------ | ------------ |-----------|--------------------------------------|----------------------------------------------------- |
| server       | Optional     | String    | REST server property                 | Used to retrieve the `rest.server.[server]` property |
| method       | **Required** | String    | REST method.                         | **GET**: Send the parameters as part of the endpoint - **POST**: Send the parameters in the request body |
| endpoint     | **Required** | String    | Path to REST call                    | Ej: /data/ServiceData or /maintain/ServiceMaintain   |
| wrapper      | Optional     | String    | Classname to wrap REST call response | Ej: com.almis.awe.test.bean.Postman                       |
| content-type | Optional     | String    | Way to send the parameters           | `URLENCODED` (default), `JSON`                       |
| cacheable    | Optional     | Boolean   | Used to set service as cacheable     | Default value is `false`                             |

### Service parameter element

The service parameter element are parameters passed from query or maintain to the service. Has the following attributes:

| Attribute   | Use          | Type      |  Description                             |   Values                                      |
| ----------- | ------------ |-----------|------------------------------------------|---------------------------------------------- |
| name        | **Required** | String    | Name of service parameter                | **Note:** Must be unique                      |
| type        | **Required** | String    | Type of service parameter                | The possible values are: `STRING`, `INTEGER`, `FLOAT`, `DOUBLE`, `OBJECT`, `JSON`, `DATE`, `TIME` or `TIMESTAMP` |
| value       | Optional     | String    | To set the parameter with a static value |                                               |
| bean-class  | Optional     | String    | Manage parameter as a Java Bean          | Type must be `OBJECT` or `JSON`               |

## **Java services**

Are services to execute `java` code. Its xml structure is:

```xml
<service id="[service_name]">
  <java classname="[service_classname]" method="[service_method]">
    <service-parameter type="String" name="[parameter_name]"/>
    ... (more service parameters)
  </java>
</service>
```

### Java service examples

Service definition with parameters

```xml
<!-- Store a session variable -->
<service id="insertSchedulerTask">
  <java classname="com.almis.awe.scheduler.controller.SchedulerController" method="insertSchedulerTask">
    <service-parameter name="IdeTsk" type="INTEGER" />
    <service-parameter name="SendStatus" type="INTEGER" list="true" />
    <service-parameter name="SendDestination" type="INTEGER" list="true" />
  </java>
</service>

```

Java class definition with parameters

```java
@Service
public class SchedulerService extends ServiceConfig {
  /**
   * Insert and schedule a new task
   *
   * @param taskId Task identifier
   * @param sendStatus Status to send list
   * @param sendDestination Destination target list
   * @return ServiceData
   */
  public ServiceData insertSchedulerTask(Integer taskId, List<Integer> sendStatus, List<Integer> sendDestination) throws AWException {
    // Launch function
    // ...
  } 
}
```

Service definition without parameters

```xml
<!-- Get screen configuration at begining-->
<service id="LoaScrCfg" launch-phase="APPLICATION_START">
  <java classname="com.almis.awe.core.services.controller.ScreenController" method="initScreenConfigurations"/>
</service>
```

Java class definition without parameters

```java
@Service
public class ScreenService extends ServiceConfig {
  /**
   * Initialize singleton with screens configurations info
   *
   */
  public void initScreenConfigurations() {
    // Launch function
    // ...
  } 
}
```

### Load beans from parameters

Here is an example to load a bean from some parameters

**Example 1**: Load a single bean with parameters

Query definition to load a bean parameter (each variable will field a bean attribute)

```xml
<query id="testServiceBeanParameter" service="testServiceBeanParameter">
  <variable id="name" type="STRING" name="name"/>
  <variable id="rotationPeriod" type="STRING" name="rotationPeriod"/>
  <variable id="orbitalPeriod" type="STRING" name="orbitalPeriod"/>
  <variable id="diameter" type="STRING" name="diameter"/>
  <variable id="climate" type="STRING" name="climate"/>
  <variable id="gravity" type="STRING" name="gravity"/>
  <variable id="terrain" type="STRING" name="terrain"/>
  <variable id="population" type="LONG" name="population"/>
  <variable id="created" type="DATE" name="created"/>
  <variable id="edited" type="DATE" name="edited"/>
  <variable id="url" type="STRING" name="url"/>
</query>
```

Service definition with a bean parameter

```xml

<service id="testServiceBeanParameter">
  <java classname="com.almis.awe.service.DummyService" method="getDummyData">
    <service-parameter type="OBJECT" bean-class="com.almis.awe.test.bean.Planet"/>
  </java>
</service>
```

Java class definition with a bean parameter

```java
@Service
public class DummyService extends ServiceConfig { 
  /**
   * Retrieve dummy data
   * @param planet Planet bean
   * @return Service data
   */
  public ServiceData getDummyData(Planet planet) {
    ServiceData serviceData = new ServiceData();
    // ...
    return serviceData;
  }
}
```

**Example 2**: Load a list of beans with parameters

Query definition to load a bean parameter (each variable is a parameter list which will field a bean attribute)

```xml
<query id="testServiceBeanParameterList" service="testServiceBeanParameterList">
  <variable id="name" type="STRING" name="name"/>
  <variable id="rotationPeriod" type="STRING" name="rotationPeriod"/>
  <variable id="orbitalPeriod" type="STRING" name="orbitalPeriod"/>
  <variable id="diameter" type="STRING" name="diameter"/>
  <variable id="climate" type="STRING" name="climate"/>
  <variable id="gravity" type="STRING" name="gravity"/>
  <variable id="terrain" type="STRING" name="terrain"/>
  <variable id="population" type="LONG" name="population"/>
  <variable id="created" type="DATE" name="created"/>
  <variable id="edited" type="DATE" name="edited"/>
  <variable id="url" type="STRING" name="url"/>
</query>
```

Service definition with a bean parameter list

```xml

<service id="testServiceBeanParameterList">
  <java classname="com.almis.awe.service.DummyService" method="getDummyData">
    <service-parameter type="OBJECT" bean-class="com.almis.awe.test.bean.Planet" list="true"/>
  </java>
</service>
```

Java class definition with a bean parameter list

```java
@Service
public class DummyService extends ServiceConfig { 
  /**
   * Retrieve dummy data
   * @param planetList Planet bean list
   * @return Service data
   */
  public ServiceData getDummyData(List<Planet> planetList) {
    ServiceData serviceData = new ServiceData();
    // ...
    return serviceData;
  }
}
```

**Example 3**: Load a json node from a grid

Query definition to load a bean parameter (each variable is a parameter list which will field a bean attribute)

```xml
<query id="testLoadJsonAddress" service="testLoadJsonAddress">
  <variable id="address" type="OBJECT" name="selectedRowAddress"/>
</query>
```

Service definition with a Json parameter

```xml

<service id="testLoadJsonAddress">
  <java classname="com.almis.awe.service.DummyService" method="getJsonAddress">
    <service-parameter type="JSON"/>
  </java>
</service>
```

Java class definition with a json parameter

```java
@Service
public class DummyService extends ServiceConfig { 
  /**
   * Retrieve dummy data
   * @param address Json address
   * @return Service data
   */
  public ServiceData getJsonAddress(JsonNode address) {
    ServiceData serviceData = new ServiceData();
    // ...
    return serviceData;
  }
}
```

**Example 4**: Load a stored datalist from one grid row

Query definition

```xml
<query id="testLoadJsonBean" service="testLoadJsonBean">
  <variable id="storedDatalist" type="OBJECT" name="storedData.selected"/>
</query>
```

Service definition with a Json parameter

```xml

<service id="testLoadJsonBean">
  <java classname="com.almis.awe.service.DummyService" method="getJsonBean">
    <service-parameter type="JSON" bean-class="com.almis.awe.model.dto.DataList"/>
  </java>
</service>
```

Java class definition with a json parameter

```java
@Service
public class DummyService extends ServiceConfig { 
  /**
   * Retrieve dummy data
   * @param datalist DataList from Json
   * @return Service data
   */
  public ServiceData getJsonBean(DataList datalist) {
    ServiceData serviceData = new ServiceData();
    // ...
    return serviceData;
  }
}
```

### How to set parameter values from Java

There is the procedure to set set query and maintain variable values in Java.

**Java Service**

```java
  @Service
  public class UserService extends ServiceConfig { 

    /**
     * Get user information
     *
     * @param id User id
     * @return ServiceData
     */
    private ServiceData getUserData(String id) throws AWException {
      DataList userData = null;
      ServiceData srvDat = null;

      getRequest().setParameter("opeId", id);
      return getBean(QueryService.class).launchQuery("getUserData");
    }
  }

```

**Query definition**

```xml
<query id="getUserData">
  <table id="ope" alias="o" />
  <field id="l1_nom" alias="nom" table="o" />
  <field id="l1_lan" alias="lan" table="o" />
  <field id="EmlSrv" alias="eml" table="o" />
  <field id="OpeNam" alias="nam" table="o" />
  <where>
    <and>
      <filter field="IdeOpe" table="o" condition="=" variable="OpeId">
    </and>
  </where>
  <variable id="OpeId" type="STRING" name="opeId" />
</query>

```

>**Note:** This method of setting values of query and maintain variables is not recommended. It only has to be used in exceptional cases.

## **Microservices**

Microservices are connectors to REST-defined services. It's xml structure is:

```xml
<service id="[service_name]">
  <microservice name="alu-microservice" method="GET" endpoint="/[data/maintain]/[service-name]/{param1}">
    <service-parameter name="param1" type="STRING"/>
  </microservice>
</service>
```

### Microservice examples

```xml
<!-- GET BACKOFFICE NUMBER -->
<service id="BocNum">
  <microservice name="alu-microservice" method="POST" endpoint="/data/BilGetBoc">
    <service-parameter type="STRING" name="ent" />
    <service-parameter type="STRING" name="suc" />
    <service-parameter type="STRING" name="sns" />
    <service-parameter type="STRING" name="cap" />
    <service-parameter type="STRING" name="prd" />
  </microservice>
</service>
```

```xml
<!-- CONTROL CORRESPONSAL -->
<service id="BilCtlCrr">
  <microservice name="alu-microservice" method="POST" endpoint="/maintain/BilCtlCrr">
    <service-parameter type="STRING" name="Ent" />
    <service-parameter type="STRING" name="Liq" />
    <service-parameter type="STRING" name="Crr" />
  </web>
</service>
```

> **Note:** `microservice.name` attributes are optional. `name` attribute is used to allow overwrite microservice name and set auth configuration. 
> Microservice configuration example:
>
>```properties
># microservice.[name]=
> microservice.myservice=overwrite-service-name
> microservice.myservice.authentication=basic
> microservice.myservice.authentication.username=rest_username
> microservice.myservice.authentication.password=ENC(rest_password_encoded)
>```

## **REST services**

REST services are very useful to connect to REST API's. Their xml structure is:

```xml
<service id="[service_name]">
  <rest server="server" method="GET" endpoint="/[data/maintain]/[service-name]/{param1}" wrapper="com.almis.test.ServiceDataWrapper" content-type="URLENCODED">
    <service-parameter name="param1" type="STRING"/>
  </rest>
</service>
```

> **Note:** `server` and `wrapper` attributes are optional. `server` attribute is used to retrieve the `rest.server.[server]` property, 
> which is appended to the `endpoint` defined url. `wrapper` attribute defines a class name which will be used to manage the REST call response
> and translate it into a `ServiceData` class, suitable for AWE.  
> 
> Rest server configuration example:
>
>```properties
> rest.server.core=http://localhost:18080/core
> rest.server.core.authentication=basic
> rest.server.core.authentication.username=rest_username
> rest.server.core.authentication.password=ENC(rest_password_encoded)
>```

### REST services examples

* **Call to a local URL with GET method without parameters**
```xml
<service id="testSimpleRestGet">
  <rest method="GET" endpoint="http://localhost:18089/testapi/simple"/>
</service>
```

* **Call to a local URL with POST method without parameters**
```xml
<service id="testSimpleRestPost">
  <rest method="POST" endpoint="http://localhost:18089/testapi/simple"/>
</service>
```

* **Call to a local URL with GET method without parameters**
```xml
<service id="testComplexRestGet">
  <rest method="GET" endpoint="http://localhost:18089/testapi/complex/QtyTst"/>
</service>
```

* **Call to a local URL with POST method without parameters**
```xml
<service id="testComplexRestPost">
  <rest method="POST" endpoint="http://localhost:18089/testapi/complex/testInclude"/>
</service>
```

* **Call to a local URL with GET method with url parameters**
```xml
<service id="testComplexRestGetParameters">
  <rest server="local" method="GET" endpoint="/testapi/complex/QtyTst{name}/{value}">
    <service-parameter type="STRING" name="name" />
    <service-parameter type="STRING" name="value" />
  </rest>
</service>
```

* **Call to a local URL with POST method with url encoded parameters (default)**
```xml
<service id="testComplexRestPostParameters">
  <rest method="POST" endpoint="http://localhost:18089/testapi/complex/parameters/testRestParameters">
    <service-parameter type="INTEGER" name="value" />
  </rest>
</service>
```

* **Call to a local URL with POST method with json encoded parameters**
```xml
<service id="testComplexRestPostParametersJson">
  <rest server="local" method="POST" endpoint="/testapi/complex/parameters/json/testRestParameters" content-type="JSON">
    <service-parameter type="INTEGER" name="value" />
  </rest>
</service>
```

* **Call to a external URL with GET method without parameters and a wrapper**
```xml
<service id="testExternalRest">
  <rest server="islandia" method="GET" endpoint="/concerts" wrapper="com.almis.awe.test.bean.Concerts"/>
</service>
```

* **Call to a external URL with GET method without parameters and a wrapper**
```xml
<service id="testPostman">
  <rest server="postman" method="GET" endpoint="/gzip" wrapper="com.almis.awe.test.bean.Postman"/>
</service>
```