FROM node:20.16.0-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]
