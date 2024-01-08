FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "start", "dist/main.js"]


