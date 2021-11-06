---
id: default-screens
title: Default screens
sidebar_label: Default screens
---

## Introduction

## Sites

## Modules

## Profiles

## Users

## Databases

## Themes

## Screen access

## Encrypt util

## Screen Configuration

This screen is used to change the functionality of the screen defined in XML file. The new functionality is saved in the database and it can be restricted by user or profile. We only have to define the screen, the element and its new attributes with its new values.

### Example:

If we have a criteria that will be required `validation="required"`. 

``` xml
 <criteria id="CrtSit" label="PARAMETER_NAME" component="suggest" server-action="data" target-action="SitSug" style="col-xs-7 col-sm-6 col-lg-3" validation="required"/>
```

And we wont to be not required, put the new configuration like apear in the picture below.

<img alt="screen_conf" src={require('@docusaurus/useBaseUrl').default('img/screen_conf.png')} />

### How to use it:

If you want to access and use this screen, put the next opction in your `private.xml` or `public.xml`.

``` xml
 <option name="screen_configuration" label="MENU_TOOLS_SCR_CNF" screen="ScrCnf" icon="laptop" />
```
## Report style configuration

## Mail servers

## Message queues

## Sequences

## Application parameters

## Broadcasting

## Log

## Report list

## User manual

## Application help

## About
