> [!WARNING]  
> Lynx will no longer have new features added to it as of 2024-06-19, read [the announcement](https://github.com/Lynx-Shortener/Lynx/discussions/155) for more information

<p align="center">
<img alt="" src="frontend/public/logo.png" height="300px">
</p>
<p align="center">
<a href="https://hub.docker.com/r/jackbailey/lynx">
    <img alt="Image Size" src="https://img.shields.io/docker/image-size/jackbailey/lynx?label=docker%20image%20size">
</a>
<a href="https://hub.docker.com/r/jackbailey/lynx">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/jackbailey/lynx?label=docker%20pulls">
</a>
<a href="https://github.com/Lynx-Shortener/Lynx">
    <img alt="Image Size" src="https://img.shields.io/github/license/jackbailey/lynx?label=license">
</a>
<a href="https://github.com/Lynx-Shortener/Lynx">
    <img alt="Lines of code" src="https://www.aschey.tech/tokei/github/JackBailey/Lynx?category=code">
</a>
<a href="https://docs.getlynx.dev">
    <img alt="Docs" src="https://img.shields.io/badge/read%20the-docs-blue">
</a>
</p>

# Lynx

![link list](https://cdn.jackbailey.dev/screenshots/lynx.png)

## About

A fullstack application using the MEVN stack to shorten your URLs.

I've tried a variety of URL shorteners but didn't find any with the functionality I wanted so I made my own.

My functionality I wanted:

-   Admin Interface
-   Option to redirect the root path
-   Simple UI

A mirror of this repository is available at [git.jackbailey.uk](https://git.jackbailey.uk/Lynx-Shortener/Lynx)

## Installation

Installation has moved to [the docs](https://docs.getlynx.dev/installation/installation).
## Development/Contribution

I'm actively using and trying to add features/fix bugs with Lynx, I'm just busy.

You're welcome to make a PR adding any features/fixing any issues and I'll merge them.

The Roadmap is accessible [here](https://github.com/orgs/Lynx-Shortener/projects/2)

## Naming

Each item including a slug, destination and id is called a [`Link`](src/db/models/link.js), the plural being links.

Each link has a `slug`, this is the path in the source url. `example.com/2dch89772`'s slug would be `2dch89772`.

Each item including a username and password is called an [`Account`](src/db/models/account.js), the plural being accounts.
