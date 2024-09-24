# Base stage
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development stage
FROM base AS development
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
