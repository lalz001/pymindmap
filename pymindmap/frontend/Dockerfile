FROM node:8.10-alpine
ENV HOST 0.0.0.0 

RUN npm config set unsafe-perm true
RUN npm config set registry https://registry.npm.taobao.org
RUN echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.4/main/" > /etc/apk/repositories
RUN apk update \
        && apk upgrade \
        && apk add --no-cache git
WORKDIR /home/code
COPY package.json .
COPY package-lock.json .
RUN npm i -g wr && npm install -g less && npm install -g grunt-cli
# RUN npm run init
RUN npm install
CMD npm run watch