FROM node:13-alpine as build-localizai

WORKDIR /usr/app

RUN npm install -g http-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]