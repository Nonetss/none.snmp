# Multi-stage build to combine backend and frontend images
FROM ghcr.io/nonetss/none-snmp-backend:v0.5.3 AS backend
FROM ghcr.io/nonetss/none-snmp-frontend:v0.5.3 AS frontend

# Final image
FROM oven/bun:1-debian AS runtime

# Copy backend
WORKDIR /app/backend
COPY --from=backend /app /app/backend

# Copy frontend
WORKDIR /app/frontend
COPY --from=frontend /app/dist /app/frontend/dist
COPY --from=frontend /app/node_modules /app/frontend/node_modules
COPY --from=frontend /app/package.json /app/frontend/package.json

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port 80
EXPOSE 80

CMD ["/app/start.sh"]
