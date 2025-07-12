# In rewear/docker/client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy all files including the public directory
COPY . .

# Make sure the public directory exists with index.html
RUN test -f ./public/index.html || (echo "index.html not found in public directory" && exit 1)

EXPOSE 3000

CMD ["npm", "start"]