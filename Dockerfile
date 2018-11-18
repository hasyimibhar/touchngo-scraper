FROM node:8.10 AS build_base

WORKDIR /src
COPY package.json .
COPY yarn.lock .

RUN npm install -g yarn
RUN yarn install

FROM build_base AS builder

WORKDIR /src
COPY . .

RUN yarn build
RUN yarn install --production

FROM node:8.10-alpine

WORKDIR /src
COPY package.json .
COPY --from=builder /src/dist dist
COPY --from=builder /src/node_modules node_modules

ENV PORT 3000

CMD node dist/index.js
