FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
