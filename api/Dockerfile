FROM node:12.14.1-alpine

RUN apk update
RUN apk upgrade

RUN apk add --no-cache build-base vim curl git mysql-client gawk python g++ make bash libbz2
RUN npm i -g nodemon

# 1 Setting up environment
ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}
ENV NODE_PORT=4848

# 2 Create app folders
RUN mkdir /api
WORKDIR /api

# 3 Add package-json files
COPY package*.json ./

# 4 Install dependencies
RUN npm install

# 5 Add rest of app
ADD . ./

# START
EXPOSE 4848
CMD npm run start
