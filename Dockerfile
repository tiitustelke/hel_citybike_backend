FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json .env ./

COPY dist ./dist

RUN npm install --production && export NODE_OPTIONS="--max-old-space-size=8192"

COPY . /usr/src/app

CMD ["node", "dist/index.js"]