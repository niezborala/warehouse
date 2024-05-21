# Use the official Node.js 22.1.0-alpine3.18 image as the base image
FROM node:22.1.0-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# Expose the port the application will listen on
EXPOSE 3000

# Start the application with hot reload
CMD ["npm", "run", "start:dev", "--", "--host", "0.0.0.0", "--watch"]
