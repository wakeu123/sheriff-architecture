# Étape de construction
FROM node:22.14.0-alpine3.21 AS builder

WORKDIR /project

# Copier les fichiers de configuration d'abord pour mieux profiter du cache Docker
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers
COPY . .

# Build de l'application Angular en mode production
RUN npm run build -- --configuration=production

# Étape d'exécution finale
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape builder
COPY --from=builder /project/dist/sheriff-architecture /usr/share/nginx/html

# Copier la configuration nginx personnalisée (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port
EXPOSE 80

# Commande de démarrage (déjà incluse dans l'image nginx)
