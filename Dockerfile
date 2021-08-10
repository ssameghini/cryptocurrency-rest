FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY /backend/package.json ./
RUN npm install

COPY /backend/* ./

RUN npm run prisma && npm install pm2 -g
ENV PM2_PUBLIC_KEY dvx73dw8z72bymf
ENV PM2_SECRET_KEY 22gub5ylkdkneqi

CMD ["npm", "start"]