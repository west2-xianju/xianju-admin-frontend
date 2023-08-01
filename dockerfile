FROM openresty/openresty:1.21.4.2-0-alpine-fat
COPY ./docker /etc/nginx/conf.d
COPY ./dist /app
CMD ["openresty", "-g", "daemon off;"]
EXPOSE 80