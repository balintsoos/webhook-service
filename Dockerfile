FROM node:15.12.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ARG PROCESS
ENV PROCESS ${PROCESS}
CMD npm run start:${PROCESS}
