FROM node:22 AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/nuxt.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
