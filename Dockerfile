FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS builder
WORKDIR /app
COPY package*.json ./
USER root
COPY . .
RUN npm i && npm run build

FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]