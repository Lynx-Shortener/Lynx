FROM node:18 AS BUILD_IMAGE

WORKDIR /app

COPY ["./frontend/package.json","./frontend/yarn.lock","frontend/"]

COPY ["./package.json","./yarn.lock","./"]


RUN yarn
COPY ./src ./src
COPY ./VERSION ./VERSION

WORKDIR /app/frontend
RUN NODE_ENV=production
COPY ./frontend /app/frontend 
RUN yarn
RUN yarn build

FROM node:18-alpine

## START BACKEND

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/src ./src
COPY --from=BUILD_IMAGE /app/VERSION ./VERSION
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "/app/src"]