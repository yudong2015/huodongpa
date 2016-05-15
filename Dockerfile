FROM daocloud.io/library/node:4.4

RUN mkdir /src
WORKDIR /src
COPY ./package.json /src

RUN npm install --production --registry=http://registry.npm.taobao.org

COPY . /src

CMD /bin/bash launch.sh


