FROM node:20-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY internal-nginx-proxy.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]