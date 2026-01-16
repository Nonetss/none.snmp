#!/bin/bash

# Start backend in background
cd /app/backend
bunx drizzle-kit migrate --config drizzle.config.ts
bun run src/index.ts &

# Start frontend on port 80
cd /app/frontend
HOST=0.0.0.0 PORT=80 BACKEND_URL=http://127.0.0.1:3000 bun run dist/server/entry.mjs
