FROM node:15.12.0-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS build

RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM base AS production

ENV NODE_ENV production

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

USER node
