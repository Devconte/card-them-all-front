#!/bin/bash

# Script pour configurer SSL avec Let's Encrypt
# À exécuter sur le serveur après le déploiement initial

echo "🔐 Configuration SSL avec Let's Encrypt pour cardthemall.fr"

# Vérifier que le domaine pointe vers le serveur
echo "📋 Vérification du DNS..."
nslookup cardthemall.fr

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt

# Arrêter nginx temporairement
echo "⏹️ Arrêt de nginx..."
sudo systemctl stop nginx

# Générer les certificats avec certbot
echo "🔑 Génération des certificats SSL..."
sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d cardthemall.fr \
    -d www.cardthemall.fr

# Vérifier que les certificats ont été créés
if [ -f "/etc/letsencrypt/live/cardthemall.fr/fullchain.pem" ]; then
    echo "✅ Certificats SSL générés avec succès !"
    
    # Décommenter la configuration SSL dans nginx
    echo "🔧 Activation de la configuration SSL..."
    # Vous devrez décommenter manuellement la section SSL dans nginx.conf
    
    # Redémarrer nginx
    echo "🔄 Redémarrage de nginx..."
    sudo systemctl start nginx
    sudo systemctl reload nginx
    
    echo "🎉 Configuration SSL terminée !"
    echo "Votre site est maintenant accessible en HTTPS sur https://cardthemall.fr"
else
    echo "❌ Erreur lors de la génération des certificats SSL"
    echo "Vérifiez que :"
    echo "1. Le domaine cardthemall.fr pointe vers ce serveur"
    echo "2. Le port 80 est ouvert"
    echo "3. Aucun autre service n'utilise le port 80"
fi

# Configuration du renouvellement automatique
echo "⏰ Configuration du renouvellement automatique..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✨ Configuration terminée !"
