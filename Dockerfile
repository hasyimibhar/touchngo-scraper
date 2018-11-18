FROM node:9 AS build_base

WORKDIR /src
COPY package.json .
COPY yarn.lock .

USER root
RUN npm install -g yarn
RUN yarn install

FROM build_base AS builder

WORKDIR /src
COPY . .

RUN yarn build

FROM node:10.13.0-slim@sha256:fefd53d3e2bceeac151d1bb65b4e45238aca5a19bc5cfade099038f7c2449fc1
    
RUN  apt-get update \
     # See https://crbug.com/795759
     && apt-get install -yq libgconf-2-4 \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY package.json .
COPY --from=builder /src/dist dist
COPY --from=builder /src/node_modules node_modules

ENV PORT 3000

EXPOSE ${PORT}

CMD node dist/index.js
