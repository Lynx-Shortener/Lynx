FROM node:18 AS BUILD_IMAGE

WORKDIR /app

# Copy required files for packages 

COPY ["./frontend/package.json","./frontend/yarn.lock","/app/frontend/"]

COPY ["./src/package.json","./src/yarn.lock", "/app/src/"]

COPY ["VERSION", "./"]

# Install dependencies for backend

WORKDIR /app/src

RUN yarn

COPY src .

# Install dependencies for frontend and build it

WORKDIR /app/frontend
RUN NODE_ENV=production
COPY frontend .
RUN yarn
RUN yarn build

FROM gcr.io/distroless/nodejs18-debian11

## From the builder image above, start node from a distroless image

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/src ./src
COPY --from=BUILD_IMAGE /app/VERSION ./VERSION

EXPOSE 3000

CMD ["/app/src/index.js"]