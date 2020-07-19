# Easy Docker HTTP(s) Proxy [![Build Status](https://github.com/shroomlife/docker-https-proxy/workflows/docker/badge.svg)](https://github.com/shroomlife/docker-https-proxy/actions)

This is an easy to use HTTP(s) proxy for your docker containers that you can use to have multiple containers running on a single machine and to proxy requests among those containers.

## Prerequisites

* [Docker](https://docs.docker.com/get-docker/) - The containerization service.
* [docker-compose](https://docs.docker.com/compose/gettingstarted/) - The orchestration service for your environment.

## Getting Started

### Using Docker Hub

```Shell
docker run --name=proxy -d -p 80:80 -p 443:443 shroomlife/docker-https-proxy:latest
```

🐳 [https://hub.docker.com/r/shroomlife/docker-https-proxy](https://hub.docker.com/r/shroomlife/docker-https-proxy)

### Using Docker Compose

Use the following example `docker-compose.yml` file.

```YAML
version: '3.3'
services:
  proxy:
    container_name: proxy
    image: shroomlife/docker-https-proxy:latest
    ports:
      - "80:80"
      - "443:443"
  webserver:
    container_name: example.com.proxy
    image: httpd:latest
```

When your server with docker is contacted at `example.com` all requests will be proxied to your custom container on port 80.
