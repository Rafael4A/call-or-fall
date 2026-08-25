FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY front-end/package.json front-end/
COPY back-end/package.json back-end/
COPY shared-code/package.json shared-code/

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run", "prod"]