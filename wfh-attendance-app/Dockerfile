# ---- Base Stage ----
# Use the standard Debian-based Node.js image
FROM node:20 AS base
WORKDIR /usr/src/app
# Install pnpm package manager
RUN npm install -g pnpm

# ---- Dependencies Stage ----
# Copy only package manifests to leverage Docker cache
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Install all dependencies including devDependencies for the build stage
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
# Build the application
FROM deps AS builder
COPY . .
# Use tsconfig.build.json which excludes test files for a smaller build
RUN pnpm run build api-gateway && \
    pnpm run build auth-service && \
    pnpm run build users-service && \
    pnpm run build attendance-service

# ---- Production Stage ----
# Create the final, lean production image
FROM base AS production
# Copy only production dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist
# Copy package.json to the final image
COPY package.json .

# Default command (can be overridden in docker-compose)
CMD ["node", "dist/apps/api-gateway/main"]