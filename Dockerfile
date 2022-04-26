FROM node:lts-alpine AS builder
WORKDIR /lockebio-backend
COPY . .
RUN apk --no-cache add --virtual builds-deps build-base python3 curl
RUN npm config set python /usr/bin/python3
RUN npm ci --prefer-offline --no-audit
RUN npm run generate
RUN npm run build
RUN apk del builds-deps

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /
COPY package*.json ./
RUN npm install -g dotenv-cli
COPY --from=builder /lockebio-backend/public ./public
COPY --from=builder /lockebio-backend/prisma ./prisma
COPY --from=builder /lockebio-backend/tsconfig.json ./tsconfig.json
COPY --from=builder /lockebio-backend/dist ./dist
COPY --from=builder /lockebio-backend/node_modules/bcrypt ./node_modules/bcrypt
COPY --from=builder /lockebio-backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /lockebio-backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /lockebio-backend/start.sh ./start.sh
RUN chmod +x start.sh
RUN npm install --production
EXPOSE 3030

CMD ["sh", "-c", "/start.sh"]