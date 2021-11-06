---
id: notifier
title: Notifications
sidebar_label: Notifications
---

The **notifier** module improves AWE with a notification system. This system works the following way:

1. Somebody defines a list of subscriptions (topics) in the application.
2. Users can _subscribe_ on a topic to receive the notifications (via web or email).
3. The system launches a notification _via_ the **[Notification API](#notification-api)**, and it is sent to all subscribed users.
4. Users receive the notifications and can mark them as read or click over them (in web notifications)
5. Notifications can lead the user to the screen related to the notification.

## Prerequisites

The **notifier module** needs to be configured before it's used. 

To see how to configure the **notifier module** for your application see the **[Configuration guide](../notifier-module.md)**.    

## Subscriptions

The subscriptions screen allows you to define new subscription topics for the application.

When defining a subscription topic, it is necessary to define an acronym which will be used on the
**[Notification API](#notification-api)** to refer the subscription.

## Notifications

The notifications screen stores all sent notifications. 

Here the user can mark as read/unread any notification.

## User settings

The new user settings screen allows the user to manage his subscriptions, activating or deactivating
which one he needs to receive.

## Notification panel

The notification panel is a dropdown menu which will refresh itself whenever there are any new notification
or notification status has changed.

## Notification API

The notifier module adds a bean called `NotifierService` which contains the following method to 
add notifications:

```xml
public void notify(NotificationDto notification) throws AWException
```

To use it simply fill a Dto object called `NotificationDto` (`new NotificationDto()`) 
and call the `notify` method on the `NotifierService` bean:

  * `subscription`: Subscription **acronym**
  * `title`: Notification title (30 characters max)
  * `description`: Notification description (250 characters max)
  * `icon`: Notification icon (choose them from [FontAwesome](https://fontawesome.com/v4.7.0/icons/))
  * `type`: Notification type:
    * `NORMAL`: Standard notification (gray)
    * `OK`: Success notification (green)
    * `INFO`: Informative notification (blue)
    * `WARNING`: Warning notification (yellow)
    * `ERROR`: Error notification (red)
  * `screen`: Destination screen (option name of the screen to be redirected on notification click)
  * `code`: Code which will be sent as the variable `selected-notification` when clicking on a notification
  (useful to refer a concrete point on the destination screen).