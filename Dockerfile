FROM bitnami/node:15-prod

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod --non-interactive

COPY src ./src

EXPOSE 80 443
CMD [ "node", "src/index" ]
