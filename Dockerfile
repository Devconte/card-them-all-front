# --- Stage 1: build ---
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Copier les deps et installer
    COPY package.json package-lock.json ./
    RUN npm install --include=dev
    
    # Copier le code et builder
    COPY . .
    RUN npm run build
    
    # --- Stage 2: Nginx static server (HTTP only) ---
    FROM nginx:1.23-alpine AS production
    
    # Nettoyer les confs par défaut et n'en garder qu'une
    RUN rm -f /etc/nginx/conf.d/*.conf
    COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copier le build
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    