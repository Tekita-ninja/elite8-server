# ---------- Stage 1: Build ----------
  FROM node:20-slim AS builder

  RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
  
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm install
  
  COPY . .
  
  COPY .env .env
  RUN npx prisma generate
  RUN npm run build

# ---------- Stage 2: Runtime ----------  
  FROM node:20-slim AS runner
  
  WORKDIR /app
  
  COPY --from=builder /usr/src/app/node_modules ./node_modules
  COPY --from=builder /usr/src/app/dist ./dist
  COPY --from=builder /usr/src/app/package.json ./package.json
  COPY --from=builder /usr/src/app/.env .env
  
  EXPOSE 3000
  
  CMD ["npm", "run", "start"]
  