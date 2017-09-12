FROM node:4-wheezy

RUN apt-get update && apt-get install -y bash git
RUN npm install -g bower gulp

# install bower and node in a cachable way in docker layers
COPY bower.json /bower.json
RUN cd / && bower --allow-root install
COPY package.json /package.json
RUN cd / && npm install


COPY . /app
WORKDIR /app
RUN mv /bower_components ./
RUN mv /node_modules ./

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
