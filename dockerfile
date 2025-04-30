# ----------- Stage 1: Build -----------
  FROM node:20-alpine AS builder

  # Install system deps for Prisma and node-gyp
  RUN apk add --no-cache \
      python3 \
      make \
      g++ \
      openssl \
      && npm config set python python3
  
  WORKDIR /app
  
  # Copy package files and install deps
  COPY package*.json ./
  RUN npm ci --legacy-peer-deps
  
  # Copy rest of the source
  COPY . .
  
  # Copy env and generate Prisma client
  COPY .env .env
  RUN npx prisma generate
  
  # Build the app (for NestJS or similar)
  RUN npm run build
  
  
  # ----------- Stage 2: Runtime -----------
  FROM node:20-alpine AS runner
  
  WORKDIR /app
  
  # Copy only the necessary files from builder
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/.env .env
  
  EXPOSE 3000
  
  CMD ["node", "dist/main.js"]
  