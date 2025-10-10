#!/bin/bash

# Script pour configurer l'application sur VPS sans SSL
# Usage: ./vps-setup.sh

echo "🚀 Configuration de l'application sur VPS OVH"
echo "📍 VPS: vps-71464054.vps.ovh.net"

# 1. Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# 2. Nettoyer les volumes orphelins
echo "🧹 Nettoyage des volumes..."
docker volume prune -f

# 3. Démarrer seulement les services nécessaires (sans certbot)
echo "📦 Démarrage des services..."
docker-compose up -d frontend nginx

# 4. Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 15

# 5. Vérifier le statut des conteneurs
echo "🔍 Vérification du statut des conteneurs..."
docker-compose ps

# 6. Tester la connectivité
echo "🌐 Test de connectivité..."
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx répond sur le port 80"
else
    echo "❌ Nginx ne répond pas sur le port 80"
fi

if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend répond sur le port 5173"
else
    echo "❌ Frontend ne répond pas sur le port 5173"
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Informations d'accès:"
echo "   🌐 Site web: http://vps-71464054.vps.ovh.net"
echo "   🔧 Frontend direct: http://vps-71464054.vps.ovh.net:5173"
echo ""
echo "📝 Commandes utiles:"
echo "   📊 Voir les logs: docker-compose logs -f"
echo "   🔄 Redémarrer: docker-compose restart"
echo "   🛑 Arrêter: docker-compose down"
echo ""
echo "🔮 Pour configurer SSL plus tard (quand vous aurez le nom de domaine):"
echo "   1. Configurez votre DNS pour pointer vers ce VPS"
echo "   2. Exécutez: ./ssl-setup.sh votre-email@example.com"
