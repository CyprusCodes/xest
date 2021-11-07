---
id: installation
title: Installation
sidebar_label: Installation
---

To install an AWE-based application just deploy it on an application server, like Apache Tomcat, Wildfly (old JBoss) or IBM WebSphere

## Optimization

There are several settings which can be defined onto the application server to optimize the access time between client browser and server and between server and databases:

### Server compression

Server compression reduces the size of packages sent to client browser by compressing them in GZIP, which can be uncompressed by all modern browsers.

To activate this setting (in Tomcat) use the following attributes on **server.xml** file:

```xml
<Connector port="[connectorPort]" protocol="HTTP/1.1"
  connectionTimeout="[connectionTimeout]"
  redirectPort="[redirectPort]" compression="on" 
  compressionMinSize="128" 
  noCompressionUserAgents="gozilla, traviata" 
  compressableMimeType="text/html,text/xml,application/json,text/json,text/x-json,text/javascript,application/javascript,application/x-javascript,text/css,application/font-sfnt,image/svg+xml,application/x-font-ttf"/>
```

### Datasources

A datasource is a server-managed connection pool which speeds up the database access. Connection in Apache Tomcat has two steps:

**server.xml**: Define the database connection

```xml
<Resource name="[resourceName]" auth="Container"
  type="javax.sql.DataSource" driverClassName="com.microsoft.sqlserver.jdbc.SQLServerDriver"
  url="[jdbcUrl]"
  username="[databaseUsername]" password="[databasePassword]" maxActive="20" maxIdle="-1"
  maxWait="-1" removeAbandoned="true" logAbandoned="true" validationQuery="select 1 from ope"/>
```

**context.xml**: Define the server endpoint to allow access to the datasource

```xml
<ResourceLink global="[resourceName]" name="[datasourceName]" type="javax.sql.DataSource"/>
```

> **Note:** These optimization settings are *only* for Apache Tomcat. Wildfly and WebSphere have their own settings to enable server compression and datasoures

### Application server hardening

#### Apache Tomcat

We recommend to follow these steps to improve application server security.
*  Follow OWASP security recommendations for Apache Tomcat https://www.owasp.org/index.php/Securing_tomcat
*  Configure HTTPS connection in Tomcat https://tomcat.apache.org/tomcat-8.0-doc/ssl-howto.html. You may need paid SSL certificates (or certificates issued by your CA).
*  Enable extended access logs. Edit server.xml file and add check if the following code is enabled inside host tag:

```xml
<Valve className="org.apache.catalina.valves.AccessLogValve"
    directory="logs" prefix="localhost_access_log." suffix=".txt"
    pattern="common" resolveHosts="false"/>
```

*  Enable clickjacking protection (only for Tomcat version 8 or greater). :
**web.xml**: Uncomment the following code

```xml
<filter>
  <filter-name>httpHeaderSecurity</filter-name>
  <filter-class>org.apache.catalina.filters.HttpHeaderSecurityFilter</filter-class>
  <async-supported>true</async-supported>
</filter>
```

 And add the following code just after the uncommented section:

 ```xml
<filter-mapping>
  <filter-name>httpHeaderSecurity</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

*  If HTTPS is enabled, add a rule to redirect HTTP requests to HTTPS. On web.xml file add the following code at the end of web-app tag (add it inside web-app tag):

```xml
<security-constraint>
 <web-resource-collection>
   <web-resource-name>Secure SSL</web-resource-name>
   <url-pattern>/*</url-pattern>
 </web-resource-collection>
 <user-data-constraint>
   <transport-guarantee>CONFIDENTIAL</transport-guarantee>
 </user-data-constraint>
</security-constraint>
```


