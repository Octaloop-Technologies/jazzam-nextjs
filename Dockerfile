# Use the official Node.js image as the base
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This allows Docker to cache the npm install step if dependencies don't change
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (optional, if you need it for production build)
RUN npm run build

# Expose port 3000 for the application to be accessed
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
