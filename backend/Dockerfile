FROM node:16.20.2-alpine3.18

RUN apk add --no-cache bash

# set the working direction
WORKDIR /app/backend

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/backend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

RUN npm install

# add app
COPY . ./

RUN chmod +x ./.docker/entrypoint.sh

# RUN yarn typeorm migration:run

# # start app
# ENTRYPOINT ["yarn", "start"]
