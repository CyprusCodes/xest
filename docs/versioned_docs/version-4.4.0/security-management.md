---
id: security
title: Security in Awe applications
sidebar_label: Security
---

<img style={{ width: "40%", margin: "30% 10% 0% 30%" }} 
    alt="AWE security" 
    src={require('@docusaurus/useBaseUrl').default('img/undraw_security.svg')}
/>

## Architecture
Awe is a server-side framework, where all of your application state, business and UI logic resides on the server. Unlike client driven frameworks, Awe apps never exposes its internals to the browser where vulnerabilities can be leveraged by an attacker.

It uses **`Spring Security`** utilities to manage and configure all safety-related aspects.

## 3rd party libraries
Always AWE constantly update dependencies to 3rd part libraries when security patches for them are released. When necessary, a new maintenance version of Awe is created to apply the fix. Furthermore, AWE has a public `SonarCloud` server to be audited and constantly adapt to new security flaws. You can check [here](https://sonarcloud.io/component_measures?id=aweframework_awe&metric=Security).

## Cross-Site Request Forgery (CSRF/XSRF)
All requests between the client and the server are included with a user session specific CSRF token. Awe handles all communication between the server and the client, so you do not need to remember to include the CSRF tokens manually.
```properties title="Security request headers"
Authorization: f910520d-28b8-4a2b-6e98-f32822bb1677
Sec-Fetch-Site: same-origin
X-XSRF-TOKEN: faad4d18-035a-4394-ab5f-be3bae2a1a09
Cookie: XSRF-TOKEN=faad4d18-035a-4394-ab5f-be3bae2a1a09; JSESSIONID=7177A217096E0BF9E4D47C967C74431D
```

## Cross-Site Scripting (XSS)
Awe has built-in protection against cross-site scripting (XSS) attacks. Awe converts all data to use HTML entities before the data is rendered in the user's browser.

The filtering is enabled by default, so adding the header typically just ensures it is enabled and instructs the browser what to do when a XSS attack is detected.
```properties
X-XSS-Protection: 1; mode=block
```

## Authentication and Authorization
Awe lets you choose which authentication and authorization system you want to use, instead of bundling any specific one. Awe is fully compatible with the most used security solutions in the Spring Boot ecosystem like `In memory`, `Database`, `LDAP`, `OAuth`, `Oauth2`, `2FA` ...

:::info You can visit [this](https://spring.io/guides/topicals/spring-security-architecture) for more info.
:::

### Spring Security in Awe
Awe provides configuration beans to manage security in your application. You can use them or overwrite and create your custom auth method. The security configuration is in `SecurityConfig` and `AWEScreenSecurityAdapter` classes and select the authentication method that you want.
```shell script title="Configuration properties"
################################################
# Authentication
################################################
# Authentication mode (ldap | bbdd | in_memory | custom)
security.auth.mode=bbdd

################################################
# Custom authentication
################################################
#Provider class beans, separated by comma for multiple providers.
security.auth.custom.providers=
```

You can always create your own Http web security config class extending `WebSecurityConfigurerAdapter`. 

```java title="Custom Http security configuration"
@Configuration
public class CustomSecurityConfig extends WebSecurityConfigurerAdapter {
  
   /**
   * Spring security configuration
   *
   * @param http Http security object
   * @throws Exception Configure error
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Your custom configuration
  }
}

```

## SSL and HTTPS
Awe always recommend developers to set up secure server endpoints and run all communication exclusively under HTTPS. Awe works out-of-the-box with HTTPS, and there is nothing for the developer to configure in your application code. Please refer to the documentation of your servlet container for details on how to set up HTTPS on your server.

## Data validation
In Awe application, the data binding API supports data validation on the server, which cannot be by-passed with client-side attacks. However, awe has client-side validation action to do a double check and increase the responsiveness of the application, but the developer should be aware that these should be used purely for convenience, since they are easily circumvented in the browser. In addition, the developer is free to use any Java API for validating the data, including connecting to external services. There is also a built-in integration with Java’s Bean Validation (`JSR 303`) standard.

## SQL injections
Awe is a backend-agnostic UI framework, it doesn’t directly deal with backend access; instead, it uses a backend framework (e.g. Spring Data) to manage this. Awe provides mitigation for SQL injections using techniques like *Parameterized Queries* with QueryDSL. Internally uses `PreparedStatement`and *User data sanitization*.

```java title="QueryDsl Example"
QCustomer customer = new QCustomer("Foo");

SQLTemplates dialect = new HSQLDBTemplates(); // SQL-dialect
SQLQuery query = new SQLQueryImpl(connection, dialect); 
List<String> lastNames = query.from(customer)
    .where(customer.firstName.eq("Foo"))
    .list(customer.lastName);
```

```sql
SELECT c.last_name FROM customer c WHERE c.first_name = 'Foo'
```



