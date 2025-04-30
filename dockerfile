# ----------- Stage 1: Builder -----------
  FROM node:20-alpine AS builder

  # Install necessary build tools
  RUN apk add --no-cache \
      python3 \
      make \
      g++ \
      openssl \
      && npm config set python python3
  
  WORKDIR /app
  
  # Copy package files and install dependencies
  COPY package*.json ./
  RUN npm install --legacy-peer-deps
  
  # Copy the rest of the source code
  COPY . .
  
  # Generate Prisma client (creates node_modules/.prisma and node_modules/@prisma/client)
  COPY .env .env
  RUN npx prisma generate
  
  # Build the app (NestJS or TS)
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
  