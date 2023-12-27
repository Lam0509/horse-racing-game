FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main.js"]
