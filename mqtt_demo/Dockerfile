# Stage 1: Build Stage
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Copy app source code
COPY . .

# Install dependencies and build
RUN bun install
RUN bun add mqtt
RUN bun run build


# Stage 2: Run Stage (Nginx)

FROM nginx:alpine
COPY --from=base /usr/src/app/dist /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]