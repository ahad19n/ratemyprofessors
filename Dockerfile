# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY static ./static
COPY src/views ./src/views
COPY postcss.config.mjs tailwind.config.js ./

RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/static ./static

COPY src ./src

EXPOSE 3000
CMD [ "node", "src/server.js" ]
