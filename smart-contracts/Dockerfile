FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose hardhat default port
EXPOSE 8545

# Default command (overridden by docker-compose)
CMD ["npm", "run", "dev"]
