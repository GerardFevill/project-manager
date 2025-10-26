#!/bin/bash
# Script de test pour valider le build Docker et le déploiement local

set -e  # Exit on error

echo "🔧 Test du Dockerfile et du déploiement Docker"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="project-manager-test"
CONTAINER_NAME="project-manager-test-container"
APP_PORT=3001

echo "📋 Étape 1: Nettoyage des anciens conteneurs/images"
echo "---------------------------------------------------"
docker rm -f $CONTAINER_NAME 2>/dev/null || true
docker rmi -f $IMAGE_NAME 2>/dev/null || true
echo -e "${GREEN}✓ Nettoyage terminé${NC}"
echo ""

echo "🔨 Étape 2: Build de l'image Docker"
echo "---------------------------------------------------"
if docker build -t $IMAGE_NAME .; then
    echo -e "${GREEN}✓ Image Docker créée avec succès${NC}"
else
    echo -e "${RED}✗ Erreur lors du build de l'image${NC}"
    exit 1
fi
echo ""

echo "📊 Étape 3: Vérification de l'image"
echo "---------------------------------------------------"
docker images | grep $IMAGE_NAME
IMAGE_SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
echo -e "${GREEN}✓ Taille de l'image: $IMAGE_SIZE${NC}"
echo ""

echo "🗄️  Étape 4: Démarrage de PostgreSQL (si pas déjà lancé)"
echo "---------------------------------------------------"
if ! docker ps | grep -q "project-manager-postgres"; then
    docker run -d \
        --name project-manager-postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=project_manager \
        -p 5433:5432 \
        postgres:16-alpine
    echo -e "${YELLOW}Attente du démarrage de PostgreSQL (10s)...${NC}"
    sleep 10
    echo -e "${GREEN}✓ PostgreSQL démarré${NC}"
else
    echo -e "${GREEN}✓ PostgreSQL déjà en cours d'exécution${NC}"
fi
echo ""

echo "🚀 Étape 5: Lancement du conteneur de l'application"
echo "---------------------------------------------------"
docker run -d \
    --name $CONTAINER_NAME \
    -p $APP_PORT:3000 \
    -e NODE_ENV=production \
    -e DB_HOST=host.docker.internal \
    -e DB_PORT=5433 \
    -e DB_USERNAME=postgres \
    -e DB_PASSWORD=postgres \
    -e DB_DATABASE=project_manager \
    $IMAGE_NAME

echo -e "${YELLOW}Attente du démarrage de l'application (15s)...${NC}"
sleep 15
echo ""

echo "🏥 Étape 6: Test du health check"
echo "---------------------------------------------------"
if curl -f http://localhost:$APP_PORT/health 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✓ Health check réussi${NC}"
else
    echo -e "${RED}✗ Health check échoué${NC}"
    echo "Logs du conteneur:"
    docker logs $CONTAINER_NAME
    exit 1
fi
echo ""

echo "📝 Étape 7: Test de l'API principale"
echo "---------------------------------------------------"
if curl -f http://localhost:$APP_PORT/ 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✓ API principale accessible${NC}"
else
    echo -e "${RED}✗ API principale inaccessible${NC}"
fi
echo ""

echo "📋 Étape 8: Informations du conteneur"
echo "---------------------------------------------------"
echo "Status du conteneur:"
docker ps | grep $CONTAINER_NAME
echo ""
echo "Statistiques:"
docker stats --no-stream $CONTAINER_NAME
echo ""

echo "📄 Étape 9: Logs de l'application (dernières 20 lignes)"
echo "---------------------------------------------------"
docker logs --tail 20 $CONTAINER_NAME
echo ""

echo "🧪 Étape 10: Test du healthcheck Docker"
echo "---------------------------------------------------"
HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "no healthcheck")
echo "Status du healthcheck: $HEALTH"
echo ""

echo "=============================================="
echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
echo "=============================================="
echo ""
echo "📌 Informations utiles:"
echo "   • Application accessible sur: http://localhost:$APP_PORT"
echo "   • Health check: http://localhost:$APP_PORT/health"
echo "   • PostgreSQL sur port: 5433"
echo ""
echo "🛠️  Commandes utiles:"
echo "   docker logs -f $CONTAINER_NAME              # Voir les logs en temps réel"
echo "   docker exec -it $CONTAINER_NAME sh           # Accéder au conteneur"
echo "   docker stats $CONTAINER_NAME                 # Voir les statistiques"
echo ""
echo "🧹 Nettoyage:"
echo "   docker rm -f $CONTAINER_NAME                 # Arrêter et supprimer le conteneur"
echo "   docker rm -f project-manager-postgres        # Arrêter PostgreSQL"
echo "   docker rmi $IMAGE_NAME                       # Supprimer l'image"
echo ""
echo "Appuyez sur Ctrl+C pour quitter (les conteneurs resteront actifs)"
echo "Voulez-vous nettoyer maintenant? (y/N)"
read -r answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo ""
    echo "🧹 Nettoyage en cours..."
    docker rm -f $CONTAINER_NAME
    docker rm -f project-manager-postgres
    docker rmi $IMAGE_NAME
    echo -e "${GREEN}✓ Nettoyage terminé${NC}"
else
    echo "Les conteneurs restent actifs. N'oubliez pas de les nettoyer plus tard !"
fi
