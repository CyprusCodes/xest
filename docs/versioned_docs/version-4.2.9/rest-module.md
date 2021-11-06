---
id: rest
title: Rest API Module
---

:::caution
This document is deprecated and not corrected. Currently AWE uses `Spring Boot` and natively uses Spring management when dealing with `REST APIs`
:::

What's a REST api? REST stands for **Re**presentational **S**tate **T**ransfer. (It is sometimes spelled "REST".) It relies on a stateless, client-server, cacheable communications protocol -- and in virtually all cases, the HTTP protocol is used.

REST is an architecture style for designing networked applications. The idea is that, rather than using complex mechanisms such as CORBA, RPC or SOAP to connect between machines, simple HTTP is used to make calls between machines.

Much like Web Services, a REST service is:

- Platform-independent (you don't care if the server is Unix, the client is a Mac, or anything else)
- Language-independent (C# can talk to Java, etc.)
- Standards-based (runs on top of HTTP)
- Can easily be used in the presence of firewalls

<img alt="AWE Rest" src={require('@docusaurus/useBaseUrl').default('img/AWE_Rest.png')} />

## **Services**

In this time AWE rest API has three services: `AUTHENTICATION`, `QUERY` and `MAINTAIN`

| Service | Method | Path    | Description                                        |
| ----------- | ---------|------------------------|----------------------------------------------------|
| [login](#authentication-service) | POST | `/rest/login` | Used to authentication in web application. Return **session token** and **REST request ID** |
| [data](#query-service) | GET | `/rest/data` | Used to launch the queries of web application. Return JSON with data query -  **IMPORTANT:** If the query is private (needs session token) first you have to call `login` REST service |
| [maintain](#maintain-service) | GET/POST | `/rest/maintain` | Used to launch the maintains of web application. Return JSON with maintain result - **IMPORTANT:** If the maintain is private (needs session token) first you have to call `login` REST service |

### **Authentication service**

The **login** service has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| user | **Required** | Http header | Is the user name to login |  **Ex.:** `mgr` |
| password | **Required** | Http header | Is the user password to login |  **Ex.:** `demo` |

The **login** service has the following **outputs**:

| OutPut | Type | Description |
| -----------| ------ | ---------|
| token | String | Is the session token. Used to authentication process. **Note:** If you want call `data` rest api, you have to send this parameter as http header in the request |
| restReqId | String | Is the REST request Id. Used to authentication process. **Note:** If you want call `data` rest api, you have to send this parameter as http header in the request |
| result | Object | Is the result of REST service. It has other properties to show the code result, type of result or description |

> **Note:** The output is in `JSON` format

This is example of json output

```json
{
  "token" : "SlNOUGFXbjVTQ1QvS1FFZlZTTEdYY095L2hiSzd5K1duRUVMZVNZZDhHejNhRWVtL1I2dTF2M3ZnMXN1N2VROHBCMHhFaW93Zk1FV2VZbHJyRVFzSWc9PQ==",
  "restReqId" : "6c275f83-3f4b-4b63-9b50-f1d9279e6693",
  "result" : {
    "code" : 0,
    "type" : "ok",
    "description" : "Service rest login launched successfully"
  }
}
```

### **Query service**

The **data** service has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| id | **Required** | URI query paramter | URI parameter to set the name of query in the request |  **Ex.:** `UsrLst` |
| variable-list | **Optional** | Http header | Variable list of query in JSON format | **Ex.:** `variable-list = { CrtUsr : "mgr", CrtAct : 1}` |
| token | Optional | Http header | Is the session token. You have to set it when the query is private |  |
| restReqId| Optional | Http header | Is the REST request Id. You have to set it when the query is private | |

The **data** service has the following **outputs**:

| OutPut | Type | Description |
| ------- | ---- | ---------|
| records | Number | Records number of query  |
| rows | Array | Each rows in the query. The row has the column structure and its values |
| result | Object | Is the result of REST service. It has other properties to show the code result, type of result or description |

> **Note:** The output is in `JSON` format

This is example of json output

```json
{
  "result" : {
    "code" : 0,
    "type" : "ok",
    "description" : "Service rest DATA launched successfully"
  },
  "records" : 1,
  "rows" : [ {
    "LanImg" : {
      "image" : "images/flags/ENG.svg",
      "label" : "English"
    },
    "LanTxt" : "English",
    "Pro" : 1.0,
    "ThmTxt" : "",
    "Prn" : "\\\\servername1\\printername",
    "Nam" : "Manager",
    "StaTxt" : 1.0,
    "Lan" : "ENG",
    "id" : "1",
    "BlkIco" : {
      "icon" : "AUTHENTICATION_STATUS_0",
      "label" : "No"
    },
    "Nom" : "mgr",
    "ScrIni" : "",
    "StaIco" : {
      "icon" : "GENERAL_STATUS_FA_1",
      "label" : "Yes"
    },
    "EmlSrv" : "EmlSrv2",
    "ProTxt" : "administrator",
    "WebPrn" : "\\\\servername2\\printername2",
    "Thm" : null,
    "Sta" : 1.0,
    "IdeOpe" : 1.0,
    "PwdLck" : 0.0,
    "Res" : "administrator",
    "Eml" : "test@testemail.com"
  } ]
}
```

### **Maintain service**

The **maintain** service as GET has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| id | **Required** | URI query paramter | URI parameter to set the name of maintain in the request |  **Ex.:** `UsrDel`|
| variable-list | Optional | Http header | Variable list of maintain in JSON format | **Ex.:** `variable-list = { IdeOpe :  2}` |
| token | Optional | Http header | Is the session token. You have to set it when the query is private |  |
| restReqId| Optional | Http header | Is the REST request Id. You have to set it when the query is private | |

The **maintain** service has the following **outputs**:

| OutPut | Type | Description |
| ------- | ---- | ---------|
| result | Object | Is the result of maintain REST service. It has other properties to show the code result, type of result or description |

**IMPORTANT!**: If you need invoque maintain service as POST, you can put your payload as body of the request

> **Note:** The output is in `JSON` format

This is example of json output

```json
{
  "code" : 0,
  "type" : "ok",
  "description" : "The selected maintain operation has been successfully performed"
}
```

## **Client API Rest examples**

For build a java **REST client** you only need add this dependency in your `pom.xml`

```xml
<dependency>
  <groupId>org.glassfish.jersey.core</groupId>
  <artifactId>jersey-client</artifactId>
  <version>2.15</version>
  <scope>provided</scope>
</dependency>
```

> **Optional:** If you want JSON integration, you can use Jackson. Add this dependency in your `pom.xml`

```xml
dependency>
  <groupId>org.glassfish.jersey.media</groupId>
  <artifactId>jersey-media-json-jackson</artifactId>
  <version>2.15</version>
</dependency>
```

* **Login client example**

```java
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class LoginService {
	
	private static final String  AWE_CONTEXT = "AWE_V3.0";

	public static void main(String[] args) {

		// Create rest client for login service
		Client client = ClientBuilder.newClient();
		WebTarget loginService = client.target("http://localhost:18080").path(AWE_CONTEXT + "/rest/login");
		
		// Add headers to request
		Invocation.Builder invocationBuilder = loginService.request(MediaType.APPLICATION_JSON);
		invocationBuilder.header("user", "demo");			
		invocationBuilder.header("password", "demo");
		
		// Get response
	    Response response = invocationBuilder.post(Entity.entity("", MediaType.APPLICATION_JSON));
	    
	    System.out.println(response.getStatus());
		System.out.println(response.readEntity(String.class));
				
	}
}
```

* **Data client example**

```java
import java.net.URI;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import com.almis.awe.rest.client.beans.Token;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class DataService {

	// Application context
	private static final String  AWE_CONTEXT = "AWE_V3.0";
	// Query name
	private static final String  QUERY_NAME = "UsrLst";

	public static void main(String[] args) {

		// Create rest client for login service
		Client client = ClientBuilder.newClient();
		WebTarget loginService = client.target("http://localhost:18080").path(AWE_CONTEXT + "/rest/login");
		
		// Add headers to request
		Invocation.Builder loginBuilder = loginService.request(MediaType.APPLICATION_JSON);
		loginBuilder.header("user", "demo");			
		loginBuilder.header("password", "demo");
		
		// Get login response
	    Response loginResponse = loginBuilder.post(Entity.entity("", MediaType.APPLICATION_JSON));
	    
	    if (loginResponse.getStatus() == 200) {
	    	// Wrapper Json response
	    	Token token = loginResponse.readEntity(Token.class);
	    	if (token != null && token.getToken() != null) {
	    		
	    		// Build REST uri with Query param
	    		URI uri = UriBuilder
	                    .fromUri("http://localhost:18080")
	                    .path(AWE_CONTEXT + "/rest/data").queryParam("id", QUERY_NAME)
	                    .build();
	     
	            WebTarget dataService = client.target(uri);
	    		
	    		// Add headers to request
	    		Invocation.Builder dataBuilder = dataService.request(MediaType.APPLICATION_JSON);
	    		dataBuilder.header("RestReqId", token.getRestReqId());
	    		dataBuilder.header("token", token.getToken());
	    		
	    		// Build variable list
	    		ObjectNode variableList = JsonNodeFactory.instance.objectNode();
	    		
	    		variableList.set("CrtSta", JsonNodeFactory.instance.numberNode(1));
	    		variableList.set("CrtUsr", JsonNodeFactory.instance.numberNode(1));
	    		
	    		dataBuilder.header("variable-list", variableList);
	    		
	    		//Get data response
	    		Response dataResponse = dataBuilder.get(Entity.entity("", MediaType.APPLICATION_JSON));
	    		
	    		if (dataResponse.getStatus() == 200) {
	    			// Print data response	    			
		    	    System.out.println(dataResponse.getStatus());
		    		System.out.println(dataResponse.readEntity(String.class));
	    		}
	    			    	
	    	}	    	
	    }				
	}
}
```

* **Maintain client example**

```java
import java.net.URI;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import com.almis.awe.rest.client.beans.Token;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class MaintainService {

	// Application context
	private static final String  AWE_CONTEXT = "AWE_V3.0";
	// Query name
	private static final String  MAINTAIN_NAME = "UsrDel";

	public static void main(String[] args) {

		// Create rest client for login service
		Client client = ClientBuilder.newClient();
		WebTarget loginService = client.target("http://localhost:18080").path(AWE_CONTEXT + "/rest/login");
		
		// Add headers to request
		Invocation.Builder loginBuilder = loginService.request(MediaType.APPLICATION_JSON);
		loginBuilder.header("user", "demo");			
		loginBuilder.header("password", "demo");
		
		// Get login response
	    Response loginResponse = loginBuilder.post(Entity.entity("", MediaType.APPLICATION_JSON));
	    
	    if (loginResponse.getStatus() == 200) {
	    	// Wrapper Json response
	    	Token token = loginResponse.readEntity(Token.class);
	    	if (token != null && token.getToken() != null) {
	    		
	    		// Build REST uri with Query param
	    		URI uri = UriBuilder
	                    .fromUri("http://localhost:18080")
	                    .path(AWE_CONTEXT + "/rest/maintain").queryParam("id", MAINTAIN_NAME)
	                    .build();
	     
	            WebTarget dataService = client.target(uri);
	    		
	    		// Add headers to request
	    		Invocation.Builder dataBuilder = dataService.request(MediaType.APPLICATION_JSON);
	    		dataBuilder.header("RestReqId", token.getRestReqId());
	    		dataBuilder.header("token", token.getToken());
	    		
	    		// Build variable list
	    		ObjectNode variableList = JsonNodeFactory.instance.objectNode();
	    		
	    		variableList.set("IdeOpe", JsonNodeFactory.instance.numberNode(910));
	    		
	    		dataBuilder.header("variable-list", variableList);
	    		
	    		//Get data response
	    		Response dataResponse = dataBuilder.get(Entity.entity("", MediaType.APPLICATION_JSON));
	    		
	    		if (dataResponse.getStatus() == 200) {
	    			// Print data response	    			
		    	    System.out.println(dataResponse.getStatus());
		    		System.out.println(dataResponse.readEntity(String.class));
	    		}
	    			    	
	    	}	    	
	    }				
	}
```