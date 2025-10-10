#!/bin/bash

echo "🔧 Correction des problèmes de configuration nginx sur VPS"

# 1. Arrêter tous les conteneurs
echo "🛑 Arrêt des conteneurs..."
docker-compose -f docker-compose.vps.yml down

# 2. Nettoyer les volumes et images
echo "🧹 Nettoyage..."
docker system prune -f
docker volume prune -f

# 3. Reconstruire les images
echo "🔨 Reconstruction des images..."
docker-compose -f docker-compose.vps.yml build --no-cache

# 4. Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.vps.yml up -d

# 5. Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 20

# 6. Vérifier le statut
echo "🔍 Vérification du statut..."
docker-compose -f docker-compose.vps.yml ps

# 7. Tester la connectivité
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
echo "🎉 Correction terminée!"
echo "🌐 Votre site devrait maintenant être accessible sur:"
echo "   http://vps-71464054.vps.ovh.net"
echo ""
echo "📋 Commandes utiles:"
echo "   📊 Voir les logs: docker-compose -f docker-compose.vps.yml logs -f"
echo "   🔄 Redémarrer: docker-compose -f docker-compose.vps.yml restart"
echo "   🛑 Arrêter: docker-compose -f docker-compose.vps.yml down"
