# ----------- Stage 1: Builder -----------
  FROM node:20-bullseye-slim AS builder

  RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

  WORKDIR /app

  COPY package*.json ./
  RUN npm install --legacy-peer-deps

  COPY . .
  COPY .env .env
  RUN npx prisma generate

  RUN echo "Contents of /app:" && ls -al /app && \
    echo "Contents of /app/uploads:" && ls -al /app/uploads || echo "uploads missing"

  RUN npm run build
  
  
  # ----------- Stage 2: Runtime -----------
  FROM node:20-bullseye-slim AS runner

  
  WORKDIR /app
  
  # Copy only what's needed from builder
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/.env .env
  
  EXPOSE 3000
  
  # Use direct entry point to avoid relying on npm scripts
  CMD ["node", "dist/src/main.js"]
  