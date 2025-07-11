# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (remove --only=production to install dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Debug: Check if files exist
RUN ls -la

# Build the application
RUN npm run build

# Debug: Check if build directory exists and has files
RUN ls -la build/

# Production stage
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy sw.js to root directory
COPY sw.js /usr/share/nginx/html/sw.js

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Debug: Check if files were copied correctly
RUN ls -la /usr/share/nginx/html/

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Debug: Final check of permissions
RUN ls -la /usr/share/nginx/html/

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]