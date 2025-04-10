FROM node:22-bookworm-slim AS packages

WORKDIR /app
COPY package.json tsconfig.json ./

COPY src src

# Stage 2 - Install dependencies and build packages
FROM node:22-bookworm-slim AS build

RUN npm install -g pnpm

USER node
WORKDIR /app

COPY --from=packages --chown=node:node /app .

RUN --mount=type=cache,target=/home/node/.cache/pnpm,sharing=locked,uid=1000,gid=1000 \
    pnpm add -D pnpm && \
    pnpm self-update && \
    pnpm install && \
    pnpm build

COPY --chown=node:node . .

FROM node:22-bookworm-slim

USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/.mastra/output ./

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
