---
id: maven
title: Maven
sidebar_label: Maven
---

The maven dependencies needed to run an application with AWE engine are the next ones:

```xml
<dependency>
  <groupId>com.almis.awe</groupId>
  <artifactId>awe-spring-boot-starter</artifactId>
  <version>${awe.version}</version>
</dependency>
<dependency>
  <groupId>com.almis.awe</groupId>
  <artifactId>awe-client-angular</artifactId>
  <version>${awe.version}</version>
</dependency>
```

Add the maven dependency plugin to retrieve the generic screens and the client engine sources:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-dependency-plugin</artifactId>
  <executions>
    <execution>
      <phase>prepare-package</phase>
      <id>unpack awe-generic-screens</id>
      <goals>
        <goal>unpack-dependencies</goal>
      </goals>
      <configuration>
        <includeGroupIds>com.almis.awe</includeGroupIds>
        <includeArtifactIds>awe-generic-screens</includeArtifactIds>
        <includes>schemas/**</includes>
        <outputDirectory>${project.build.directory}/classes/static/</outputDirectory>
      </configuration>
    </execution>
    <execution>
      <phase>prepare-package</phase>
      <id>unpack awe-client-angular</id>
      <goals>
        <goal>unpack-dependencies</goal>
      </goals>
      <configuration>
        <includeGroupIds>com.almis.awe</includeGroupIds>
        <includeArtifactIds>awe-client-angular</includeArtifactIds>
        <includes>images/**,fonts/**,js/**,css/**,less/**</includes>
        <outputDirectory>${project.build.directory}/classes/static/</outputDirectory>
      </configuration>
    </execution>
  </executions>
</plugin>
```

We use `webpack` to compile all javascript and less files

```xml
<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <executions>
    <execution>
      <id>install node and yarn</id>
      <goals>
        <goal>install-node-and-yarn</goal>
      </goals>
      <configuration>
        <nodeVersion>v8.12.0</nodeVersion>
        <yarnVersion>v1.10.1</yarnVersion>
      </configuration>
    </execution>
    <execution>
      <id>yarn install</id>
      <goals>
        <goal>yarn</goal>
      </goals>
      <configuration>
        <arguments>install</arguments>
      </configuration>
    </execution>
    <execution>
      <id>webpack</id>
      <goals>
        <goal>webpack</goal>
      </goals>
      <configuration>
        <arguments>--output-path "${project.build.frontend}"</arguments>
      </configuration>
    </execution>
  </executions>
</plugin>
```

> **Note:** More info about less plugin [here](https://github.com/marceloverdijk/lesscss-maven-plugin)

Where **PROJECT-ACRONYM** is the acronym of the project in uppercase, and **project-acronym** is the same acronym but in lowercase.