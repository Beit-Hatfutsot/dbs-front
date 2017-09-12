FROM node:4-wheezy

RUN apt-get update && apt-get install -y bash git
RUN npm install -g bower gulp

COPY . /app

WORKDIR /app

RUN npm install
RUN bower --allow-root install

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
