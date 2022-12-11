# Vue3 + Vite + vue-router + SCSS

Template created by [Jack-Bailey](https://jackbailey.dev) as a quick start.

## Installation

```
npm install -g yarn degit

degit Jack-Bailey/vue-vite-vuerouter-scss my-vue3-vite-router-scss-app

cd my-vue3-vite-router-scss-app

yarn

yarn dev
```

## Naming

Each item including a slug, destination and id is called a [`Link`](server/src/db/models/link.js), the plural being links.

Each link has a `slug`, this is the path in the source url. `example.com/2dch89772`'s slug would be `2dch89772`.

Each item including a username and password is called an [`Account`](server/src/db/models/account.js), the plural being accounts.
