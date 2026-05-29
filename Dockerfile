
# --- Étape 1 : Compilation du projet ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ASTUCE : On demande à Vite de remplacer l'alias "@" par le vrai chemin physique 
# pendant le build pour contourner le bug d'import Linux
RUN npx vite build --resolve.alias.@=/app/src

# --- Étape 2 : Serveur web de production ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 8080; \
    listen [::]:8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
