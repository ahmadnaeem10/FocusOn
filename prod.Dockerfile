FROM node:18.15.0-alpine

RUN apk add --no-cache bash && \
    npm i -g typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app
RUN npm run build && \
    npm run migrate:run

EXPOSE 8080
CMD ["npm", "run", "start:prod"]
