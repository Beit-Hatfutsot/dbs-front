FROM node:4-wheezy

RUN apt-get update && apt-get install -y bash git
RUN npm install -g bower gulp
RUN apt-get install -y nginx

# install bower and node in a cachable way in docker layers
COPY bower.json /bower.json
RUN cd / && bower --allow-root install
COPY package.json /package.json
RUN cd / && npm install

RUN mkdir /app
WORKDIR /app
RUN mv /bower_components ./
RUN mv /node_modules ./

COPY . /app
RUN gulp dist

COPY docker_nginx_default.conf /etc/nginx/sites-enabled/default

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
