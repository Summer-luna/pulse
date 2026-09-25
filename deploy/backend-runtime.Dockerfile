FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev && npm cache clean --force

RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/backend/uploads \
  && chown -R app:app /app/backend/uploads
USER app

WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "dist/main.js"]
