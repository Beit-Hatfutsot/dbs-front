FROM node:4-wheezy

RUN apt-get update && apt-get install -y bash git
RUN npm install -g bower gulp
RUN apt-get install -y nginx

# install bower and node in a cachable way in docker layers
COPY bower.json /bower.json

# try bower a few times, because sometimes some dependencies fail to download
RUN cd / && (bower --allow-root install || bower --allow-root install || bower --allow-root install)
COPY package.json /package.json
RUN cd / && npm install

RUN mkdir /app
WORKDIR /app
RUN mv /bower_components ./
RUN mv /node_modules ./
