#!/bin/bash

# Script pour configurer SSL avec Let's Encrypt
# Usage: ./ssl-setup.sh your-email@example.com

if [ $# -eq 0 ]; then
    echo "Usage: $0 <email>"
    echo "Exemple: $0 admin@cardthemall.fr"
    exit 1
fi

EMAIL=$1

echo "🔧 Configuration SSL pour cardthemall.fr avec l'email: $EMAIL"

# 1. Démarrer les services sans SSL
echo "📦 Démarrage des services..."
docker-compose up -d frontend nginx

# 2. Attendre que nginx soit prêt
echo "⏳ Attente que nginx soit prêt..."
sleep 10

# 3. Générer les certificats SSL
echo "🔐 Génération des certificats SSL..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d cardthemall.fr \
    -d www.cardthemall.fr

# 4. Vérifier si les certificats ont été générés
if [ -d "./certbot_certs/live/cardthemall.fr" ]; then
    echo "✅ Certificats générés avec succès!"
    
    # 5. Activer la configuration SSL
    echo "🔄 Activation de la configuration SSL..."
    
    # Remplacer la configuration temporaire par la configuration SSL
    cat > nginx/conf/app.conf << 'EOF'
server {
    listen 80;
    server_name cardthemall.fr www.cardthemall.fr;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name cardthemall.fr www.cardthemall.fr;
    
    ssl_certificate /etc/letsencrypt/live/cardthemall.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cardthemall.fr/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gestion du routing côté client
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # 6. Redémarrer nginx avec la nouvelle configuration
    echo "🔄 Redémarrage de nginx avec SSL..."
    docker-compose restart nginx
    
    echo "🎉 Configuration SSL terminée!"
    echo "🌐 Votre site est maintenant accessible en HTTPS sur https://cardthemall.fr"
    
else
    echo "❌ Erreur lors de la génération des certificats SSL"
    echo "Vérifiez que:"
    echo "  - Le domaine cardthemall.fr pointe vers votre serveur"
    echo "  - Le port 80 est accessible depuis l'extérieur"
    echo "  - Aucun firewall ne bloque les connexions"
    exit 1
fi

# 7. Créer un script de renouvellement automatique
echo "📅 Création du script de renouvellement automatique..."
cat > renew-ssl.sh << 'EOF'
#!/bin/bash
# Script de renouvellement automatique des certificats SSL

echo "🔄 Renouvellement des certificats SSL..."

# Renouveler les certificats
docker-compose run --rm certbot renew

# Recharger nginx
docker-compose exec nginx nginx -s reload

echo "✅ Renouvellement terminé!"
EOF

chmod +x renew-ssl.sh

echo "📝 Pour renouveler automatiquement les certificats, ajoutez cette ligne à votre crontab:"
echo "0 12 * * * /path/to/your/project/renew-ssl.sh"
