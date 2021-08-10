FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY /backend/package.json ./
RUN npm install

COPY /backend/ ./

RUN npm run prisma && npm install pm2 -g
ENV PM2_PUBLIC_KEY your-public-key
ENV PM2_SECRET_KEY your-secret-key

CMD ["npm", "start"]