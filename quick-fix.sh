#!/bin/bash

echo "🔧 Correction rapide de la configuration nginx"

# 1. Arrêter les conteneurs
echo "🛑 Arrêt des conteneurs..."
docker-compose -f docker-compose.vps.yml down

# 2. Redémarrer avec la configuration corrigée
echo "🚀 Redémarrage avec la configuration corrigée..."
docker-compose -f docker-compose.vps.yml up -d

# 3. Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 10

# 4. Vérifier le statut
echo "🔍 Vérification du statut..."
docker-compose -f docker-compose.vps.yml ps

# 5. Tester la connectivité
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
echo "📋 Si vous voulez voir les logs:"
echo "   docker-compose -f docker-compose.vps.yml logs -f"
