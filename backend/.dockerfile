# ─── Stage 1: Base ────────────────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app

# Install only production deps in this layer
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: Development ────────────────────────────────────
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ─── Stage 3: Production ──────────────────────────────────────
FROM base AS production
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S krushna -u 1001 -G nodejs

USER krushna

EXPOSE 5000

# Health check — Render/Railway will use this
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]