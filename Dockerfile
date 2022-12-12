FROM node:lts-alpine

RUN apk add --no-cache git

WORKDIR /app

RUN git clone https://github.com/JackBailey/URL-Shortener /app

WORKDIR /app/frontend

RUN yarn

RUN yarn build

WORKDIR /app

COPY .env .env

ENV NODE_ENV=production

RUN yarn

EXPOSE 3000

CMD ["node", "."]