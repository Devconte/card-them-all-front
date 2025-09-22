<template>
  <div class="collection-page">
    <AppNavbar />

    <main class="main-content">
      <!-- Si pas connecté : prompt de connexion -->
      <div v-if="!authStore.isAuthenticated" class="login-prompt">
        <div class="login-prompt-content">
          <h1>Ma Collection</h1>
          <div class="prompt-icon">
            <img src="/Chen.png" alt="Professeur Chen" class="professor-chen" />
          </div>
          <p class="prompt-description">
            Connectez-vous pour voir et gérer votre collection de cartes Pokémon ! Collectez,
            organisez et suivez votre progression.
          </p>
          <div class="prompt-actions">
            <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
            <router-link to="/register" class="btn btn-secondary">S'inscrire</router-link>
          </div>
        </div>
      </div>

      <!-- Si connecté : contenu de la collection -->
      <div v-else>
        <div class="collection-header">
          <h1>Ma Collection</h1>
          <div class="collection-stats">
            <span class="total-cards">{{ collection.length }} cartes</span>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>Chargement de votre collection...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error">
          <p>Erreur : {{ error }}</p>
          <button @click="fetchCollection" class="retry-btn">Réessayer</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="collection.length === 0" class="empty-state">
          <h2>Votre collection est vide</h2>
          <p>Ouvrez des boosters pour commencer votre collection !</p>
        </div>

        <!-- Collection content -->
        <div v-else class="collection-content">
          <div class="cards-grid">
            <div v-for="userCard in collection" :key="userCard.id" class="card-item">
              <div class="card-image-container">
                <img
                  :src="getCardImage(userCard)"
                  :alt="userCard.card.name"
                  class="card-image"
                  @error="handleImageError"
                />
                <div v-if="userCard.quantity > 1" class="quantity-badge">
                  {{ userCard.quantity }}
                </div>
              </div>
              <div class="card-info">
                <h3 class="card-name">{{ userCard.card.name }}</h3>
                <p class="card-rarity">{{ userCard.card.rarity?.name || 'N/A' }}</p>
                <p class="card-set">{{ userCard.card.set?.name || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '@/stores/collection';
import { useAuthStore } from '@/stores/auth';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
// Types pour la collection
interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  quantity: number;
  card: {
    id: string;
    name: string;
    image: string;
    rarity?: {
      name: string;
    };
    set?: {
      name: string;
    };
  };
}

// Récupérer les stores
const collectionStore = useCollectionStore();
const authStore = useAuthStore();

// Utiliser storeToRefs pour les refs réactifs
const { collection, loading, error } = storeToRefs(collectionStore);
// Utiliser directement pour les actions
const { fetchCollection } = collectionStore;

// Charger les données au montage
onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchCollection();
  }
});

// Surveiller les changements d'authentification
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      fetchCollection();
    }
  },
  { immediate: true },
);

// Fonction pour gérer les images
const getCardImage = (userCard: UserCard): string => {
  const baseImage = userCard.card.image || '/logocard.png';
  if (baseImage.includes('tcgdex.net')) {
    return `${baseImage}/high.webp`;
  }
  return baseImage;
};

// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/logocard.png';
};
</script>

<style scoped>
.collection-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.collection-header h1 {
  font-size: 2.5rem;
  color: #2c5aa0;
  margin: 0;
}

.collection-stats {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.total-cards {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c5aa0;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2c5aa0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  background: #2c5aa0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.quantity-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 1rem;
}

.card-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.card-rarity {
  color: #666;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.card-set {
  color: #888;
  margin: 0;
  font-size: 0.8rem;
}

/* Styles pour le prompt de connexion */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.login-prompt-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-prompt-content h1 {
  font-size: 2.5rem;
  color: #2c5aa0;
  margin-bottom: 1rem;
}

.prompt-icon {
  margin: 2rem 0;
}

.professor-chen {
  width: 400px;
  height: 400px;
  object-fit: contain;
  opacity: 0.9;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.prompt-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.prompt-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #2c5aa0;
  color: white;
}

.btn-primary:hover {
  background: #1e3f73;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #2c5aa0;
  border: 2px solid #2c5aa0;
}

.btn-secondary:hover {
  background: #2c5aa0;
  color: white;
  transform: translateY(-2px);
}
</style>
