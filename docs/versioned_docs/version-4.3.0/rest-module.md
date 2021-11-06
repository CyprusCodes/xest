---
id: rest
title: Rest API Module
---

What's a REST api? REST stands for **Re**presentational **S**tate **T**ransfer. (It is sometimes spelled "REST".) It
relies on a stateless, client-server, cacheable communications protocol -- and in virtually all cases, the HTTP protocol
is used.

REST is an architecture style for designing networked applications. The idea is that, rather than using complex
mechanisms such as CORBA, RPC or SOAP to connect between machines, simple HTTP is used to make calls between machines.

Much like Web Services, a REST service is:

- Platform-independent (you don't care if the server is Unix, the client is a Mac, or anything else)
- Language-independent (C# can talk to Java, etc.)
- Standards-based (runs on top of HTTP)
- Can easily be used in the presence of firewalls

To activate this module, follow this steps:

- Add **awe-rest dependencies** to pom.xml descriptor.

```xml
<dependencies>
...
  <dependency>
    <groupId>com.almis.awe</groupId>
    <artifactId>awe-rest-spring-boot-starter</artifactId>
  </dependency>
...
</dependencies>
```

<img alt="AWE Rest" src={require('@docusaurus/useBaseUrl').default('img/AWE_Rest.png')} />

## **AWE Rest configuration properties**

This module provides the following properties to overwrite the `awe-rest-spring-boot-starter` starter:

| Key | Default value | Description |
|-----|---------------|-------------|
| awe.rest.jwt.authorization-header | `Authorization` | Authentication header name |
| awe.rest.jwt.jwt-prefix |  | JWT token prefix |
| awe.rest.jwt.jwt-secret | `${security.master.key}` security property  | JWT secret password for sign token |
| awe.rest.jwt.jwt-issuer | `AWE ISSUER` | JWT issuer name |
| awe.rest.jwt.jwt-expiration-time | `60m` | JWT time valid token to expire |

## **Services**

In this time AWE rest API has three services: `AUTHENTICATE`, `QUERY` and `MAINTAIN` group by `Protected API` (if it
requires authentication) and `Public API` (if the queries or maintenance are public and do not require authentication).

AWE REST module, uses [JWT](https://jwt.io/) (Json Web Token) as authentication method

:::info Complete *swagger* documentation of awe rest services is
available [here](https://staging.aweframework.com/swagger-ui/).
:::

| Service | Method |  Path | Require authentication  | Description                                        |
| ----------- | -----| -------|------------------------|----------------------------------------------------|
| [authenticate](#authenticate-service) | POST | `/api/authenticate` | false | Used to authentication. Provide a JWT token to set as http header (Default value `Authorization`) in protected services |
| [data](#query-service) | POST | `/api/data/{queryId}` | true | Used to launch the queries of web application. Return JSON with data query -  **IMPORTANT:** If the query is private (needs jwt token) first you have to call `/api/authenticate` REST service |
| [maintain](#maintain-service) | POST | `/api/maintain/{maintainId}` | true | Used to launch the maintains of web application. Return JSON with maintain result - **IMPORTANT:** If the maintain is private (needs jwt token) first you have to call `/api/authenticate` REST service |

### **Authenticate service**

The **authenticate** service has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| username | **Required** | Query parameter | Is the user name to authenticate |  **Ex.:** `test` |
| password | **Required** | Query parameter | Is the user password to authenticate |  **Ex.:** `test` |

The **authenticate** service has the following **outputs**:

| OutPut | Type | Description |
| -----------| ------ | ---------|
| username | String | Is the user name for which the token has been generated. |
| token | String | Is the jwt token. Used to authentication process. **Note:** If you want call `/api/data` or `/api/maintain` rest api, you have to send this parameter as http header in the request |
| issuer | String | Is the jwt issuer |
| expiresAt | DateTime | Expiration time of jwt token |

> **Note:** The output is in `JSON` format

This is example of json output

```json
{
  "expiresAt": "2021-04-26T16:16:18.000+00:00",
  "issuer": "AWE issuer",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiaXNzIjoiQVdFIElTU1VFUiIsImV4cCI6MT",
  "username": "foo"
}
```

### **Query service**

The **data** service has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| queryId | **Required** | URI query parameter | URI parameter to set the name of query in the request |  Ex.: `UsrLst` |
| RequestParameter | **Optional** | Json object (body) | Parameter list of query in JSON format | Ex.: `{"parameters": {"parName1": "value1","parName2": "value2","parName3": ["valueList1","valueList2","valueList3"]}}` |

The **data** service has the following **outputs**:

| OutPut | Type | Description |
| ------- | ---- | ---------|
| type | String | Result of operation `(ok, info, warning, error)`  |
| title | String | Title of response  |
| message | String | Message response  |
| dataList | Json object | Data result  of query service |

> **Note:** The output is in `JSON` format

### **Maintain service**

The **maintain** service as POST has the following **inputs**:

| Input | Use | Type | Description     |  Value |
| ----------- | ---------|------------------------|-------------------------------------|---------------|
| maintainId | **Required** | URI query parameter | URI parameter to set the name of maintain in the request |  Ex.: `UsrDel` |
| RequestParameter | **Optional** | Json object (body) | Parameter list of query in JSON format | Ex.: `{"parameters": {"IdeOpe": 2} }`|

The **maintain** service has the following **outputs**:

| OutPut | Type | Description |
| ------- | ---- | ---------|
| type | String | Result of operation `(ok, info, warning, error)`  |
| title | String | Title of response  |
| message | String | Message response  |
| resultDetails | Json object | Maintain result details |

> **Note:** The output is in `JSON` format

## **Client API Rest examples**

* **Login client example**

```java
// Authenticate
@Test
public void authenticateUser() {
    // Init rest template
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    // Build authenticate request
    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("http://localhost:8080/api/authenticate"))
    .queryParam("username","test")
    .queryParam("password","test");
    HttpEntity<String> entity = new HttpEntity<>(headers);
    ResponseEntity<LoginResponse> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.POST, 
            entity, 
            LoginResponse.class);
    // LoginResponse has token info
    ...
}
```

* **Data client example**

```java
// Data without parameters
@Test
public void protectedQueryAuthorized() {
    // Init rest template
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    String queryId = "query";
    
    //Authenticate user (call /api/authenticate to get jwt token)
    headers.add("Authorization", jwtToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    
    ResponseEntity<AweRestResponse> response = restTemplate.exchange("http://localhost:8080/api/data/" + queryId,
        HttpMethod.POST,
        entity,
        AweRestResponse.class);
        // AweRestResponse has response info
        ...
}
```

```java
// Data with parameters
@Test
public void protectedQueryParametersAuthorized() {
    // Init rest template
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    String queryId = "query";
    
    //Authenticate user (call /api/authenticate to get jwt token)
    headers.add("Authorization", jwtToken);

    // Build parameters request
    headers.setContentType(MediaType.APPLICATION_JSON);
    RequestParameter parameters = new RequestParameter();
    Map<String, Object> paramMap = new HashMap<>();
    paramMap.put("param1", 1);
    paramMap.put("param2", "value2");
    paramMap.put("param3", Arrays.asList("value1", "value2"));
    parameters.setParameters(paramMap);

    HttpEntity<RequestParameter> entity = new HttpEntity<>(parameters, headers);     
    ResponseEntity<AweRestResponse> response = restTemplate.exchange("http://localhost:8080/api/data/" + queryId,
        HttpMethod.POST,
        entity,
        AweRestResponse.class);
        // AweRestResponse has response info
        ...
}
```

* **Maintain client example**

```java
// Maintain without parameters
@Test
public void protectedMaintainAuthorized() {
    // Init rest template
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    String maintainId = "MAINTAIN";

    //Authenticate user (call /api/authenticate to get jwt token)
    headers.add("Authorization", jwtToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    ResponseEntity<AweRestResponse> response = restTemplate.exchange("http://localhost:8080/api/maintain/" + maintainId,
    HttpMethod.POST,
    entity,
    AweRestResponse.class);
    // AweRestResponse has response of maintain result
    ...
}
```

```java
// Maintain with parameters
@Test
public void protectedMaintainParametersAuthorized() {
        // Init rest template
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        String maintainId = "MAINTAIN";

        // Build parameters request
        headers.setContentType(MediaType.APPLICATION_JSON);
        RequestParameter parameters = new RequestParameter();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", 1);
        parameters.setParameters(paramMap);

        //Authenticate user (call /api/authenticate to get jwt token)
        headers.add("Authorization", jwtToken);

        HttpEntity<RequestParameter> entity = new HttpEntity<>(parameters, headers);
        ResponseEntity<AweRestResponse> response = restTemplate.exchange("http://localhost:8080/api/maintain/" + maintainId,
        HttpMethod.POST,
        entity,
        AweRestResponse.class);
        // AweRestResponse has response of maintain result
        ...
        }
```