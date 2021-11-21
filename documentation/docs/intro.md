---
id: intro
title: Xest API Framework
sidebar_label: Introduction
slug: /
---

<img alt="Xest" src={require('@docusaurus/useBaseUrl').default('img/awe_logo.png')} />

Xest is a light-weight Javascript API framework. Allows you build web APIs in the fastest way.

- :white_check_mark: Automatic server-client communication with WebSocket support
- :white_check_mark: Use ExpresJS for building endpoints
- :white_check_mark: Rich utility library
- :white_check_mark: Fast Mysql setup on Docker with your seed data
- :white_check_mark: Developent ready Dockerized Mysql setup
- :white_check_mark: Built-in authentication and authorization
- :white_check_mark: Easiest learning curve

## Xest Project main page

Please visit us at [https://www.xestjs.com](https://xestjs.com)

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

- [Maven](https://maven.apache.org/) - Dependency Management
- [Spring framework](https://spring.io/) - AWE Spring boot starter
- [Express JS](https://expressjs.com/) - Express JS framework
- [Bootstrap](https://getbootstrap.com/) - Bootstrap web toolkit
- [Highcharts](https://www.highcharts.com/) - Interactive charts library

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/almis-informatica-financiera/aweframework)

## Changelogs

Latest changelog file: [CHANGELOG.md](https://gitlab.com/aweframework/awe/-/blob/master/CHANGELOG.md)

## Contributing

Please read [CONTRIBUTING.md](https://gitlab.com/aweframework/awe/-/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

All parts of AWE, **except the contents of the graphical charts library (HighCharts)**, are licensed
under Apache License v2.0 see the [LICENSE.md](https://gitlab.com/aweframework/awe/-/blob/master/LICENSE.md) file for details.
