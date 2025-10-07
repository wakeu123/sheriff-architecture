#!/bin/bash

# Script pour générer les certificats SSL pour Angular
# Placez ce script à la racine de votre projet Angular

mkdir -p ssl

# Génération du certificat auto-signé
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key \
  -out ssl/certificate.crt \
  -subj "/C=CM/ST=Centre/L=Yaounde/O=MyCompany/OU=Dev/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "✅ Certificats SSL générés dans le dossier ssl/"
echo "📁 ssl/private.key"
echo "📁 ssl/certificate.crt"
echo ""
echo "Pour démarrer Angular avec HTTPS:"
echo "ng serve --ssl --ssl-key ssl/private.key --ssl-cert ssl/certificate.crt"