FROM orihoch/mojp-dbs-front-base

COPY . /app
RUN npm install
RUN bower --allow-root install
RUN gulp dist

COPY docker_nginx_default.conf /etc/nginx/sites-enabled/default
COPY docker_nginx_prerender.conf /etc/bhs/front-nginx-prerender.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
