# Build context is the repo root (npm workspaces need every workspace's package.json
# present for `npm ci` to resolve correctly), so this is invoked as:
#   docker build -f backend/Dockerfile .

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci
COPY backend backend
RUN npm run build -w backend

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/backend/dist backend/dist

RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/backend/uploads \
  && chown -R app:app /app/backend/uploads
USER app

WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "dist/main.js"]
