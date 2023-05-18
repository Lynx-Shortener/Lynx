FROM node:18 AS BUILD_IMAGE

WORKDIR /app

# Copy required files for packages 

COPY ["./frontend/package.json","./frontend/yarn.lock","frontend/"]

COPY ["./package.json","./yarn.lock", "VERSION", "./"]

# Install dependencies for backend

RUN yarn
COPY ./src ./src

# Install dependencies for frontend and build it

WORKDIR /app/frontend
RUN NODE_ENV=production
COPY ./frontend /app/frontend 
RUN yarn
RUN yarn build

FROM gcr.io/distroless/nodejs18-debian11

## From the builder image above, start node from a distroless image

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/src ./src
COPY --from=BUILD_IMAGE /app/VERSION ./VERSION
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

EXPOSE 3000

CMD ["/app/src/index.js"]