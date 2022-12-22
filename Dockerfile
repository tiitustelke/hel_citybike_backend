FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json .env ./

COPY dist ./dist

RUN npm install --production

COPY . /usr/src/app

EXPOSE 3000

CMD ['node', 'app.js']