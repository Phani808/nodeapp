# Use a Node.js runtime as the base image
FROM node:14

# Create and set the working directory for the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the project files to the container
COPY . .

# Expose the port used by your Forever project
EXPOSE 1338

# Start the Forever project when the container starts
CMD ["npm", "start"]

