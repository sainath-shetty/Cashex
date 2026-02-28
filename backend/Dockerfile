# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of backend source code
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Start the server
CMD ["node", "index.js"]
