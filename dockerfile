FROM openresty/openresty:1.21.4.1-8-alpine-fat
COPY ./docker /etc/nginx/conf.d
COPY ./dist /app
CMD ["openresty", "-g", "daemon off;"]
EXPOSE 80