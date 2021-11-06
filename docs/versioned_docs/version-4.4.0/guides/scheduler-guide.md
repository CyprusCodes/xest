---
id: scheduler
title: Scheduler
sidebar_label: Scheduler
---

This document gives a minimum base to start with the AWE Scheduler module, and explains how to automate and schedule tasks inside AWE in a simple way.

The Scheduler module is based on the Quartz Scheduler library. 

All documentation related to the Quartz Scheduler library can be found on its [web page](https://quartz-scheduler.org/documentation).

## Prerequisites

The scheduler module needs to be configure before it is used. 

To see how to configure the scheduler module for your application see the **[Configuration guide](../scheduler-module.md)**.


* **[Tasks](#tasks)**
* **[Servers](#servers)**
* **[Calendars](#calendars)**
    

## `Tasks`

A task consists on a job associated to a trigger that is executed by the Scheduler in the configured time / moment.

A task can also be concatenated with other tasks to create a workflow. This can be done by adding those other tasks as dependencies in the parent task configuration wizard.

A task consists on a job associated to a trigger that is executed by the Scheduler in the configured time / moment.

A task can also be concatenated with other tasks in order to create a workflow. This can be done by adding those other tasks as dependencies in the parent task configuration wizard.

### Types

There are two type of tasks that the scheduler can work with, the maintain tasks and the command tasks.

| Maintain Task       | Command Task    |
| ------------- |:-------------:|
| A maintain task executes a public maintain with a defined schedule.| A command task executes a batch on the selected server with the defined schedule. |

### Configuration

When creating a new task, a task creation wizard is used to personalize the task configuration.

The configuration wizard consists in 5 steps:

#### 1. Basic information. ###

In this step we have to add the task basic configuration.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Name          | Task name     | **Required** |
| Active        | Task status, if not active the task would not be launched   | **Required** |
| Description   | Task description |  Optional |
| Max. stored executions| Maximum number of executions to be stored in the database (Used to calculate the average time). The default value is 10. |  Optional|
| Timeout       | Maximum time for the task to finish. If the task execution time exceeds the timeout time (represented in milliseconds) the task will be interrupted |  Optional |
| Execute       | The task execution type (Command or Maintain) |  **Required** |
| Execute at    | Server in which the command task has to be launched |  Optional (Only needed in `Command` launch type) |
| Command    | Command to launch |  **Required** (Only needed in `Command` launch type) |
| Maintain   | Maintain to launch |  **Required** (Only needed in `Maintain` launch type) |
| Launch dependencies in case of warning | Launch the task dependencies in case of warning |  Optional |
| Launch dependencies in case of error| Launch the task dependencies in case of error |  Optional |
| Set execution as warning in case of error| Sets the parent execution as warning in case of dependency error |  Optional |

> **Note:** To add a new maintain to the Scheduler, the maintain must be set to `public="true"`.

#### 2. Task parameters ###

This step allows to add the needed parameters to the maintain or command for its execution.

These parameters are loaded to the application context when the task is going to be executed. In this way, the task can get the parameters in the execution time.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Name          | Parameter name   | **Required** |
| Source        | Parameter source, the place from which the parameter will take its value   | **Required** |
| Type   | The parameter type (Only used to give extra information to the user) |  **Required** |
| Value   | The parameter value, it can be directly the parameter value if the source is `Value`, or the parameter name to take the value from if the source is `Variable` |  Optional |


> **Note:** If the task launch type is `Maintain`, the needed parameters for the selected maintain will be automatically added to the task parameters screen.

#### 3. Task launch ###

In this step we will configure the launch type for the task.

We can choose from three different options:

##### 1. Manual ####

The task will only be launched manually from the task list screen.

> **Note:** For a task to be added as a dependency, the launch type must be set to `Manual`.

##### 2. Scheduled ####

The task will be launched with a cron pattern based schedule.

See [schedule configuration guide](schedule-configuration) for more information about how to create schedules for a task.

##### 3. File ####

With this launch type, the task will launch a check in the selected file/s with the configured schedule.

To know how to create a schedule for the task see [schedule configuration guide](schedule-configuration).

The remaining fields are:

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Search at  | The server in which the scheduler has to check for the files  | **Required** |
| File path  | The path in which the file/s are located   | **Required** |
| File pattern  | The pattern that the files have to match with |  **Required** |
| User  | The user for the FTP connection |  Optional |
| Password  | The password for the FTP connection |  Optional |

#### 4. Task dependencies ###

In this step we will configure which tasks have to be executed after the current task finishes.

Playing with these options, we can create a workflow.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Task  | The task to be executed  | **Required** |
| Blocking  | Defines if the task is blocking or not. If it is, the task will be executed synchronously, and it will cancel the dependency launch stack if the task ends with an error. Otherwise, the dependency will be launched asynchronously  | **Required** |
| Order  | The order in which the synchronous task has to be launched in the synchronous dependency stack, the asynchronous dependencies will be launched as they come, with no defined order |  **Required** |



> **Note:** The dependencies can also have their own dependencies to create a workflow.

#### 3. Task report ###

The last step is to choose a report type.

The report will give information about the task when it finishes.

We can choose one of these four options: 

##### 3.1 None ####

Used when we don't want to retrieve any report from the task.

This could be compared to the silent-action in AWE.

##### 3.2 Email ####

This option will send an email with the task information, and it will also add the dependencies information if any.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Send in case of | Set the allowed status (task status when it finishes) for sending the email  | **Required** |
| Email server  | The email server form where the email is going to be sent | **Required** |
| Send to users | The list of users to send the email |  **Required** |
| Title | The title of the email |  **Required** |
| Message | The message to be added in the email |  **Required** |

> **Note:** The email will also add basic information about the task itself and its dependencies.

##### 3.3 Broadcast ####

This option will send a broadcast message with the given message to the selected users only.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Send in case of | Set the allowed status (task status when it finishes) for sending the broadcast | **Required** |
| Send to users | The list of users to send the broadcast |  **Required** |
| Message | The message to be sent in the broadcast |  **Required** |

#### 4. Maintain####

This option will launch the selected maintain as a report.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Send in case of | Set the allowed status (task status when it finishes) for executing the maintain | **Required** |
| Message | The message to be sent, it will be added to the context in order to be available for the selected maintain |  Optional |

> **Note:** The task data will be added to the context in order to be available for the selected maintain, to get the data, it is recommended to use the TaskConstants interface variable names from the Scheduler package.

### Task management

The existing tasks can be managed from the scheduler tasks screen, where we will have a list of the created tasks.

The list will show some basic information of each task, like the name, the launch type (icon), the last and next execution times, the task status and the execution average time.

When selecting one task, some options will be activated:

| Option       | Definition    | Multiple |
| ------------- |:-------------:| --------:|
| Update | Update the selected task | No |
| Delete | Delete the selected task/s | Yes |
| Start | Launch the selected task as a manual task. It doesn't need to be a manual task in order to launch an instance of the task manually | No |
| Activate/Deactivate | Act

## `Servers`

The servers created for the Scheduler module are mainly used to execute tasks, and in tasks that need to check if a file has changed.

The servers can be instantiated multiple times, and each instantiation can use its own user and password to connect to the server with the selected protocol.

The scheduler servers are used with two purposes, to launch a batch on a remote server, and to check for file modifications in an FTP server.

Regarding to the FTP servers, the same server can be used as many times as needed, in different tasks, with different credentials.

### Configuration

When creating a new server, the next fields have to be filled:

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Name          | Server name     | **Required** |
| Server        | Server IP address     | **Required** |
| Port          | Server port     | **Required** |
| Type of connection   | The protocol to be used to connect to the server     | **Required** |
| Active          | Server status     | **Required** |

> **Note:** If a server is deactivated, the task using it won't even try to connect to it.

### Management

The scheduler server list will show a list of servers with their basic information: name, server ip, connection protocol and status.

When selecting one of the servers from the list, some options will be enabled:

| Option       | Definition    | Multiple |
| ------------- |:-------------:| ----------- |
| Update          | Update the selected server  | No |
| Delete          | Deletes the selected server/s  | Yes |
| Activate / Deactivate   | Activates / deactivates the selected server, the label changes depending on the selected servers current status  | No |


## `Calendars`

The task inside the scheduler can be modified to ignore some dates by using holiday calendars.

Those calendars contain the dates that have to be ignored by the scheduler in the task schedule.

Each of the tasks can only be associated with one calendar.

The calendars inside Scheduler module are used to set the dates where the tasks won't have to be executed, like for example, holidays, or weekends. 

Each task can only have associated one calendar, but there can be created as many calendars as needed, and then just change the calendar associated to the task.

### Configuration

The calendar configuration procedure consists in two steps:

#### Create calendar

The first step is to create the calendar itself, which will have the next basic information.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Name          | The calendar name     | **Required** |
| Description   | The calendar description     | **Required** |
| Active  | The calendar status     | **Required** |

> **Note:** If the calendar status is set to `Active = No` the task will ignore the calendar, and it will be launch as if it wasn't associated with it.

#### Add dates

Once the calendar is created, from the calendar configuration screen, we can add new dates by selecting the option edit on the top right side of the screen.

When we get to the edition screen we will have to fill the next fields for each date.

| Element       | Definition    | Use   |
| ------------- |:-------------:| -----:|
| Date          | The date to add to the calendar    | **Required** |
| Name   | A name to assign to the date, for example, a holiday name     | Optional |

### Management

On the calendar list screen, when selecting one of them, the next options will be available:

| Option        | Definition    | Multiple   |
| ------------- |:-------------:| ----------:|
| Edit          | Redirects to the edition screen where we can change the calendar data, and add/remove/update calendar dates    | No |
| Delete   | Delete calendar and all its associated dates     | Yes |
| Activate/Deactivate   | Activates / deactivates the selected calendar, the label changes depending on the selected calendars current status  | No |