# ----------- Stage 1: Builder -----------
  FROM node:20-alpine AS builder

  # Install necessary build tools
  RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++

  WORKDIR /app

  COPY package*.json ./
  RUN npm install --legacy-peer-deps

  COPY . .
  COPY .env .env
  RUN npx prisma generate
  RUN npm run build
  
  
  # ----------- Stage 2: Runtime -----------
  FROM node:20-alpine AS runner
  
  WORKDIR /app
  
  # Copy only what's needed from builder
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/.env .env
  
  EXPOSE 3000
  
  # Use direct entry point to avoid relying on npm scripts
  CMD ["node", "dist/main.js"]
  