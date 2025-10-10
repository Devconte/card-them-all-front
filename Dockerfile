# Stage 1: Build the Vue.js application
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
<<<<<<< HEAD
RUN npm install

# Copy project files
COPY . .

# Expose port for development
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
=======
RUN npm ci

# Copy all project files
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:1.23-alpine AS production

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if present
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 03282fc (Deploy: config docker)
