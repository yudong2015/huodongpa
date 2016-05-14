FROM node:6.1

RUN mkdir /src
WORKDIR /src
COPY ./package.json /src

RUN npm install --production --registry=http://registry.npm.taobao.org

COPY . /src

# 同步数据库
RUN node tools/migrate.js

CMD ["node","bin/www"]


