FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .

FROM node:18-alpine
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
WORKDIR /app
COPY --from=builder /app /app
USER nodejs
EXPOSE 3500
ENV NODE_ENV=production
CMD ["node", "server.js"]
