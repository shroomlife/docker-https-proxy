FROM node:12.8.1

WORKDIR /usr/src/app

RUN mkdir -p .ssl
RUN apt-get update && apt-get install -y openssl
RUN openssl genrsa -passout pass:x -out .ssl/server.pass.key 2048
RUN openssl rsa -passin pass:x -in .ssl/server.pass.key -out .ssl/server.key
RUN rm .ssl/server.pass.key
RUN openssl req -new -key .ssl/server.key -out .ssl/server.csr \
    -subj "/C=DE/ST=Baden-Württemberg/L=Asperg/O=docker-proxy/OU=docker-proxy/CN=*"
RUN openssl x509 -req -days 365 -in .ssl/server.csr -signkey .ssl/server.key -out .ssl/server.crt

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

COPY src src

EXPOSE 80 443
CMD [ "node", "src/index" ]
