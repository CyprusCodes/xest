---
id: intro
title: Almis Web Engine
sidebar_label: Introduction
slug: /
---

<img alt="Almis" src={require('@docusaurus/useBaseUrl').default('img/awe_logo.png')} />

AWE is a light-weight Java web framework. Allows you build web applications in the fastest way.

- :white_check_mark: Automatic server-client communication with WebSocket support
- :white_check_mark: Use Xml or Java for building views
- :white_check_mark: Modern UI responsive components
- :white_check_mark: Themes and Multi-language support
- :white_check_mark: Multiple data binding. Rest, SQL and noSql database, ...
- :white_check_mark: Built-in Spring Boot support
- :white_check_mark: Easiest learning curve

## AWE Project main page

Please visit us at [https://www.aweframework.com](https://www.aweframework.com)


## Prerequisites
You must have Maven 3.x installed on your computer and JDK 8 or higher

## Getting Started

This is a multi module maven project. Import as maven project with your favorite IDE to contribute. If you want create your first AWE project, use maven archetype `awe-boot-archetype` with version [![Version](https://img.shields.io/maven-central/v/com.almis.awe/awe-starter-parent.svg?label=maven%20central)](https://search.maven.org/search?q=g:%22com.almis.awe%22%20AND%20a:%22awe-starter-parent%22)

```bash
mvn -B archetype:generate \
 -DarchetypeGroupId=com.almis.awe \
 -DarchetypeArtifactId=awe-boot-archetype \
 -DarchetypeVersion=[Archetype version]
 -DgroupId=com.mycompany.app \
 -DartifactId=my-app \
 -Dversion=1.0-SNAPSHOT 
```

## Built With
* [Maven](https://maven.apache.org/) - Dependency Management
* [Spring framework](https://spring.io/) - AWE Spring boot starter
* [Angular JS](https://angularjs.org/) - Angular JS framework
* [Bootstrap](https://getbootstrap.com/) - Bootstrap web toolkit
* [Highcharts](https://www.highcharts.com/) - Interactive charts library

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/almis-informatica-financiera/aweframework)

## Changelogs

Latest changelog file: [CHANGELOG.md](https://gitlab.com/aweframework/awe/-/blob/master/CHANGELOG.md)

## Contributing

Please read [CONTRIBUTING.md](https://gitlab.com/aweframework/awe/-/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

All parts of AWE, **except the contents of the graphical charts library (HighCharts)**, are licensed
under Apache License v2.0 see the [LICENSE.md](https://gitlab.com/aweframework/awe/-/blob/master/LICENSE.md) file for details.