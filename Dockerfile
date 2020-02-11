FROM bitnami/node:10-prod

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

COPY src .

EXPOSE 80 443
CMD [ "node", "index" ]
