FROM orihoch/mojp-dbs-front-base

COPY doc /app/doc
COPY docs /app/docs
COPY fonts /app/fonts
COPY images /app/images
COPY js /app/js
COPY scss /app/scss
COPY templates /app/templates
COPY under_construction /app/under_construction
COPY .nvmrc /app/
COPY bower.json /app/
COPY browserstack.py /app/
COPY fabfile.py /app/
COPY gulpfile.js /app/
COPY index.html /app/
COPY package.json /app/
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
