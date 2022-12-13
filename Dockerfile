FROM node:lts-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY ["./frontend/package.json","./frontend/yarn.lock","frontend/"]

COPY ["./package.json","./yarn.lock","./"]

## INSTALL FRONTEND DEPS

WORKDIR /app/frontend

RUN yarn

## INSTALL BACKEND DEPS

WORKDIR /app

RUN yarn

## COPY OVER SRC FILES

COPY . .

## BUILD FRONTEND

WORKDIR /app/frontend

RUN yarn build


## START BACKEND

WORKDIR /app

ENV NODE_ENV=production

RUN yarn

EXPOSE 3000

CMD ["node", "."]