FROM nginx:1.23-alpine AS production

RUN rm -f /etc/nginx/conf.d/*.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]