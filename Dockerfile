# Use an official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build TypeScript into JavaScript
RUN npm run build

# Expose the backend port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]

# docker build -t capstone-backend .
# docker run -p 4000:4000 --env-file .env capstone-backend

# docker run -d \
#   --name qr-backend \
#   -p 4000:4000 \
#   --env-file .env \
#   -v /web/borhot.net/qr/logs:/app/logs \
#   capstone-backend
