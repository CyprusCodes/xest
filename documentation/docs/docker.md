---
id: docker
title: Docker
sidebar_label: Docker
---

# Docker

Xest framework uses *Docker* to manage local development environment. Docker is a tool designed to make it easier to create, deploy and run applications by using containers and images.

Xest runs a MySQL container using Docker for local development. This MySQL container is initialized with the schema file `database-schema.sql` and also the test seed data file `seed-data.sql`.

If at any point, you make changes to these `.sql` files. You can restart your local development environment by running `xx fresh`.

## Installing Docker

If you have already installed Docker recently, you can skip the installation instructions below.

You can check whether you already have Docker installed by running

```bash
docker --version
```

### Ubuntu

Update your software database:

```bash
sudo apt update
```

Remove any old versions of docker that might be on your system:

```bash
sudo apt remove docker docker-engine docker.io
```

Install docker:

```bash
sudo apt install docker.io
```

Check docker version:

```bash
docker --version
```

### Windows and Mac

Docker requires a Linux kernel in order to run. This can be emulated on Windows and Mac. The easiest way to do this is to install [Docker Desktop](https://docs.docker.com/get-docker/). You will need to have Docker Desktop running in order to use docker commands in your terminal.
