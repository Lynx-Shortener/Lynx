<p align="center">
<img alt="" src="frontend/public/logo.png" height="300px">
</p>
<p align="center">
<a href="https://hub.docker.com/r/jackbailey/lynx">
    <img alt="Image Size" src="https://img.shields.io/docker/image-size/jackbailey/lynx?label=Image%20Size">
</a>
<a href="https://hub.docker.com/r/jackbailey/lynx">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/jackbailey/lynx?label=Docker%20Pulls">
</a>
<a href="https://github.com/JackBailey/Lynx">
    <img alt="Image Size" src="https://img.shields.io/github/license/jackbailey/lynx?label=License">
</a>
</p>

# Lynx

## About

A fullstack application using the MEVN stack to shorten your URLs.

I've tried a variety of URL shorteners but didn't find any with the functionality I wanted so I made my own.

My functionality I wanted:

-   Admin Interface
-   Option to redirect the root path
-   Simple UI

## Environment variables

Fill in all of these environment variables before running Lynx.

For the normal installation: Rename `.example.env` to `.env` and fill the variables

For the docker installation: Fill in the variables in `docker-compose.yml`

| Environment Variable | Description | Example |
| --- | --- | --- |
| DB_HOST | The address of your mongodb database. | 127.0.0.1 |
| DB_PORT | The port of your mongodb database. When using docker set this to `27017`. | 27017 |
| DB_USER | Your mongodb database user. | admin |
| DB_PASSWORD | Your mongodb password. Generate a secure one using a tool like [1password](https://1password.com/password-generator/). |  |
|  |
| JWT_KEY | The key used to verify and sign login-sessions. Use a site like [1password](https://1password.com/password-generator/) to generate a 32 character password. |  |
|  |
| URL_LENGTH | The length of your automatically generated slugs. | 8 |
| URL_SET | The type of characters your automatically generated slug will use. | standard |
| URL_ONLY_UNIQUE | Wether each new url has to be unique, e.g. if a link already redirects to `https://example.com` new links created cannot link to the same destination. | false |
|  |
| NODE_ENV | Wether Lynx is running in a `production` or `development` environment | production |
| FORCE_FRONTEND_REDIRECT | Use the frontend to redirect instead of express, useful for hiding embeds on discord for all your rickrolling needs | false |
| ENABLE_REGISTRATION | Whether or not to allow registration. If not accounts exist you will be allowed to register either way. This first account will also be an admin account. | false |

## Installation

You need a MongoDB instance to use Lynx.

Installation guides:

-   [Ubuntu](https://www.cherryservers.com/blog/how-to-install-and-start-using-mongodb-on-ubuntu-20-04)

-   [Windows](https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514)

-   For docker this is provided in [`docker-compose.yml`](/docker-compose.yml)

### Normal Installation

You need yarn (via npm), git and node installed for this guide. I recommend [pm2](https://www.npmjs.com/package/pm2) to run this project in the background.

1.  Clone this repo

    ```console
    git clone https://github.com/JackBailey/Lynx
    ```

2.  Build the frontend

    1.  Navigate to the frontend directory

        ```console
        cd frontend
        ```

    2.  Install the required files

        ```console
        yarn
        ```

    3.  Build the frontend (it will build to `../dist`)

        ```console
        yarn build
        ```

3.  Navigate back to the server's directory

    ```console
    cd ..
    ```

4.  Install the server's required files

    ```console
    yarn
    ```

5.  Start the server

    ```console
    node .
    ```

### Docker Installation

1. Create a docker-compose.yml file in a new directory with the following content:

    ```yml
    version: "3"
    services:
        db:
            image: mongo
            restart: always
            environment:
                - MONGO_INITDB_ROOT_USERNAME=
                - MONGO_INITDB_ROOT_PASSWORD=
            volumes:
                - ./db:/data/db

        lynx:
            image: jackbailey/lynx
            restart: always
            ports:
                - 3000:3000
            depends_on:
                - db
            environment:
                - NODE_ENV=production
                - DB_USER=
                - DB_PASSWORD=
                - JWT_KEY=
                - URL_LENGTH=8
                - URL_SET=standard
                - URL_ONLY_UNIQUE=false
                - HOME_REDIRECT=/dash/overview
                - ENABLE_REGISTRATION=false # First registration will always be allowed

                ## DO NOT CHANGE THESE:
                - DB_HOST=db
                - DB_PORT=27017
    ```

2. Set the environment variables above to your choosing. Follow the guide [here](#environment-variables)

3. Start the container

    ```console
    docker compose up -d
    ```

Lynx should now be accessible at [localhost:3000](http://localhost:3000)

## Post Installation

You should now be able to register at `/dash`

## TODO

-   [ ] ShareX support

    -   [ ] API Tokens

-   [x] Multi-user support

-   [ ] Image uploads?

-   [ ] QR codes

-   [x] Searching

-   [ ] Sorting

## Naming

Each item including a slug, destination and id is called a [`Link`](src/db/models/link.js), the plural being links.

Each link has a `slug`, this is the path in the source url. `example.com/2dch89772`'s slug would be `2dch89772`.

Each item including a username and password is called an [`Account`](src/db/models/account.js), the plural being accounts.
