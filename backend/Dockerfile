FROM node:20-alpine
WORKDIR /app

# Install deps (context is repo root when built via docker-compose)
COPY backend/package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copy backend source
COPY backend/src ./src

# Copy database migrations (available because context is repo root)
COPY database/migrations ./database/migrations

ENV NODE_ENV=production
ENV MIGRATIONS_DIR=/app/database/migrations
EXPOSE 3000
CMD ["npm", "start"]
