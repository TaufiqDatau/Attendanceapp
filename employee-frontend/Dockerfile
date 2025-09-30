# Stage 1: Build the React application
# This uses the default Node.js image, which is based on Debian
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and the pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Enable corepack to use pnpm and install dependencies
RUN corepack enable && pnpm install

# Copy the rest of the application source code
COPY . .

# Declare the build-time argument
ARG VITE_API_BASE_URL

# Set the environment variable for the build process
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application for production
RUN pnpm run build

# ---

# Stage 2: Serve the application with Nginx
# This uses the default Nginx image, also based on Debian
FROM nginx:stable

# Copy the build output from the 'build' stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]