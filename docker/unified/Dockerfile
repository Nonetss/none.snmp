# Multi-stage build to combine backend and frontend images
# Build backend from local Dockerfile
FROM oven/bun:1 AS backend-base
WORKDIR /app
COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile --production
COPY backend/src ./src
COPY backend/tsconfig.json .
COPY backend/package.json .
COPY backend/drizzle.config.ts .
COPY backend/OID ./OID
COPY backend/drizzle ./drizzle

RUN apt-get update && apt-get install -y \
    git \
    curl \
    iputils-ping \
    snmp \
    traceroute \
    && rm -rf /var/lib/apt/lists/*

# Build frontend from local Dockerfile
FROM oven/bun:1 AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/bun.lock ./
RUN bun install
COPY frontend/ .
RUN bun run build

FROM oven/bun:1 AS frontend-base
WORKDIR /app
RUN apt-get update && apt-get install -y nginx gettext-base && rm -rf /var/lib/apt/lists/*
COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json
COPY --from=frontend-builder /app/gateway/nginx.conf ./gateway/nginx.conf
COPY --from=frontend-builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Final unified image
FROM oven/bun:1-debian AS runtime

# Copy backend
WORKDIR /app/backend
COPY --from=backend-base /app /app/backend

# Copy frontend
WORKDIR /app/frontend
COPY --from=frontend-base /app/dist /app/frontend/dist
COPY --from=frontend-base /app/node_modules /app/frontend/node_modules
COPY --from=frontend-base /app/package.json /app/frontend/package.json

# Copy startup script
COPY docker/unified/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port 80
EXPOSE 80

CMD ["/app/start.sh"]
