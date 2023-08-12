FROM node:18 AS BUILD_IMAGE

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy required files for packages 

COPY ["./frontend/package.json","./frontend/pnpm-lock.yaml","/app/frontend/"]

COPY ["./src/package.json","./src/pnpm-lock.yaml", "/app/src/"]

COPY ["VERSION", "./"]

# Install dependencies for backend

WORKDIR /app/src

RUN pnpm install --frozen-lockfile

COPY src .

# Install dependencies for frontend and build it

WORKDIR /app/frontend
RUN NODE_ENV=production
COPY frontend .
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM gcr.io/distroless/nodejs18-debian11

## From the builder image above, start node from a distroless image

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/src ./src
COPY --from=BUILD_IMAGE /app/VERSION ./VERSION

EXPOSE 3000

CMD ["/app/src/index.js"]