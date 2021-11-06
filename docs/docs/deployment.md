---
id: deployment
title: Deploying AWE Applications
sidebar_label: Deployment
---

## Intro
Awe framework same as Spring Boot apps, has flexible packaging options provide a great deal of choice when it comes to deploying your application. You can deploy Awe applications to a variety of cloud platforms, to container images (such as Docker), or to virtual/real machines.

This section covers some of the more common deployment scenarios.

## Deploying in Java Archive (JAR) as a standalone application

Awe applications can easily be packaged into JAR files and deployed as standalone applications. This is done by the `spring-boot-maven-plugin`. The plugin is automatically added to pom.xml using `awe-boot-archetype` maven archetype.

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

In order to package the application in a single (fat) jar file, run the maven command mvn package under project directory. This will package the application inside an executable jar file with all its dependencies (including the embedded servlet container — if its a web application). To run the jar file, use the following standard JVM command `java -jar <jar-file-name>.jar`.

## Deploying in application server
If you are running your application in an Application server like Apache Tomcat, Jboss, Websphere, ... you have to do a little changes in your pom.xml.

1. Modify your `pom.xml` to generate a WAR package instead of a JAR
```xml
<packaging>war</packaging>
```

2. Exclude the embedded tomcat by marking its scope as `provided`
```xml
<dependency> 
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <scope>provided</scope>
</dependency>
```

3. Modify your main class `AppBootApplication.java` to start the application in a stand-alone servlet container.
```java

@SpringBootApplication
public class AppBootApplication extends SpringBootServletInitializer {

  private static Class<AppBootApplication> applicationClass = AppBootApplication.class;

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(applicationClass);
  }

  /**
   * The goal of this method is only for running the application as a standalone
   * application, setting up an embedded Tomcat server.
   *
   * @param args Application arguments
   */
  public static void main(String[] args) {
    SpringApplication.run(AppBootApplication.class, args);
  }
}
```

## Deploying in Docker Container

Before deploying the application into a Docker container, we will first package the application in a (fat) JAR file. This process is previously explained, therefore I will assume we have a jar file.
On the first step, we need to build a container image. For this, we start with creating a Dockerfile in the project root directory as follows:

For example:

```shell script
# Use an official Open jdk runtime as a parent image
FROM openjdk:8-jdk-alpine
# Copy the current directory contents into the container at /app
ADD target/awe-demo.jar awe-demo.jar
# Volume of app logs
VOLUME /logs
# Volume of app data
VOLUME /tmp
# expose server port accept connections
EXPOSE 8080
# Execute jar
ENTRYPOINT ["java", "-Dspring.devtools.restart.enabled=false", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/awe-demo.jar"]
```

## Deploying in the CLOUD
Awe apps same as Spring Boot’s executable jars are ready-made for most popular cloud PaaS (Platform-as-a-Service) providers. These providers tend to require that you “bring your own container”. They manage application processes (not Java applications specifically), so they need an intermediary layer that adapts your application to the cloud’s notion of a running process.

Ideally, your application, like a Spring Boot executable jar, has everything that it needs to run packaged within it.

:::tip Info
You can read more docs about deploying **[here](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html#cloud-deploymenta)**
:::


