FROM node:20.16.0-alpine3.20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27.2-alpine3.20

COPY ./docker/nginx/conf.d/ /etc/nginx/conf.d/
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
