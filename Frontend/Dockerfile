# Build Environment
FROM node:19.0.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
# Have a .dockerignore file ignoring node_modules and build
COPY . ./
CMD ["npm", "run", "dev"]