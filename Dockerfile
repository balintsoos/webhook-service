FROM node:15.0.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ARG PROCESS
ENV PROCESS=${PROCESS}
CMD ["npm", "start:${PROCESS}"]
