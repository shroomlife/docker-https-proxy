FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --prod --non-interactive

COPY src ./src

EXPOSE 80 443
CMD [ "node", "src/index" ]
