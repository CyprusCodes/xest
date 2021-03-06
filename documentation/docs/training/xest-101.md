---
id: xest-101
title: XEST-101 Your first XEST App
slug: tutorial/
sidebar_label: XEST-101 Your first XEST App
---

## Introduction

This guide will show you step by step how to generate your first XEST framework based API.

You can find the example finished API at [here](https://github.com/PemMmM/music-library-api).
## What we need for this tutorial?

The requirements for this example are:

* Your enthusiasm :grin:
* Your favorite text processor e.g [VS CODE](https://code.visualstudio.com/)
* Docker
* MYSQL Workbench or BeeKeeper Studio

## Setting up the application

It is time to start setting up a basic XEST application. XEST is a framework built by CyprusCodes Team that allows you to create your api with just a single command.

To develop a progresive app, you should be able to connect with databases. As you remember from the Js Basics Express task on the platform - you did not form any connection between your endpoints and the database. With XEST you should be able to operate CRUD operations Create, Read, Update, Delete

Endpoints are like links where they connect the user (you in this case) to the database with callback functions to operate CRUD. First of all, you will need to install XEST globally;

```bash
$ npm i xest -g
```

To run the project the general command is;

```bash
$ xx run
```

Following that to create a new directory with database set-up you should;

```bash
$ xx [your_directory_name]
```