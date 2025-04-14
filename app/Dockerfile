FROM node:22-bookworm-slim AS packages

WORKDIR /app
COPY package.json tsconfig.json ./

COPY src src

# Stage 2 - Install dependencies and build packages
FROM node:22-bookworm-slim AS build

RUN npm install -g "pnpm@latest"

USER node
WORKDIR /app

COPY --from=packages --chown=node:node /app .

RUN --mount=type=cache,target=/home/node/.cache/pnpm,sharing=locked,uid=1000,gid=1000 \
    pnpm add -D "pnpm@latest" && \
    pnpm self-update && \
    pnpm install && \
    pnpm build

COPY --chown=node:node . .

FROM node:22-bookworm-slim

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/.mastra/output ./

COPY --chown=node:node bootstrap.sh /app/bootstrap.sh

RUN chmod +x /app/bootstrap.sh

ENV NODE_ENV=production

CMD ["/app/bootstrap.sh"]
