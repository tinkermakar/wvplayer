FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install && npx tsc

FROM node:20-alpine
ENV NODE_ENV=prod
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --productioon && chown -R node /usr/src/app/node_modules
COPY --chown=node:node . .
COPY --chown=node:node --from=builder /usr/src/app/dist/ ./dist

USER node
EXPOSE 3000
CMD ["npm", "run", "start:prod:docker"]
