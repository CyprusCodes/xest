---
id: docker
title: Docker
sidebar_label: Docker
---

# Docker

**XEST** framework uses *Docker* to manage database. Docker is a tool designed to make it easier to create, deploy and run applications by using containers and images.

The main difference between a normal virtual machine and a docker container is the docker containers are able to share resources with the host operating system (e.g. with your laptop). This makes them a lot less intensive for your computer to run. You can read more about them [here](https://www.docker.com/).

A Docker image is a pre-configured application. It contains all of the software and files that you need to run an application. To use a Dockerized application, we just have to download its image, and then run the image in a container.

## Installing Docker

If you have already installed Docker recently, you can skip the installation instructions below.

You can check whether you already have Docker installed by running

```
docker --version
```

### Ubuntu

Update your software database:

```
sudo apt update
```

Remove any old versions of docker that might be on your system:

```
sudo apt remove docker docker-engine docker.io
```

Install docker:

```
sudo apt install docker.io
```

Check docker version:

```
docker --version
```

### Windows and Mac

Docker requires a Linux kernel in order to run. This can be emulated on Windows and Mac. The easiest way to do this is to install [Docker Desktop](https://docs.docker.com/get-docker/). You will need to have Docker Desktop running in order to use docker commands in your terminal.
