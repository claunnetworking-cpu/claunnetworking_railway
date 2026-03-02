FROM node:20-alpine AS builder
WORKDIR /app

# Build args for Vite env at build time
ARG VITE_API_URL=http://localhost:3000
ARG VITE_DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEFAULT_TENANT_ID=$VITE_DEFAULT_TENANT_ID

COPY package*.json ./
RUN npm ci || npm i
COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
