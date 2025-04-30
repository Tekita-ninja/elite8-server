FROM node:20-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .
COPY .env .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]