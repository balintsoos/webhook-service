FROM node:16.10.0-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS source

RUN npm ci && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src

FROM source as test

COPY .eslint* ./
COPY jasmine*.json ./

FROM source as build

RUN npm run build

FROM base AS production

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
