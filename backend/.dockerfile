# ─── Stage 1: Base ────────────────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# ─── Stage 2: Development ────────────────────────────────────
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# ─── Stage 3: Production ──────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S krushna -u 1001 -S -G nodejs

# Set ownership
RUN chown -R krushna:nodejs /app

# Switch to non-root user
USER krushna

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Use dumb-init as PID 1
ENTRYPOINT ["dumb-init", "--"]

# Start production server
CMD ["node", "src/server.js"]