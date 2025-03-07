# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install PNPM manually (without corepack)
RUN npm install -g pnpm@9

# Copy package.json and lock file first (without node_modules)
COPY bookmarkapp/package.json bookmarkapp/pnpm-lock.yaml ./
COPY bookmarkapp/prisma ./prisma

# Install dependencies in the correct platform
RUN pnpm install --frozen-lockfile

# Now copy the entire app, but node_modules is ignored due to .dockerignore
COPY . .

# RUN pnpm prisma generate --schema=prisma/schema.prisma


# Expose the port your Hono app runs on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=development

# Start the Hono app
CMD ["pnpm", "start:dev"]
