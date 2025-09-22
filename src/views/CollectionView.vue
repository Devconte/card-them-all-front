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
          <div class="title-container">
            <img src="/pokeball.png" alt="Pokéball" class="pokeball-icon" />
            <h1>Ma Collection</h1>
          </div>
          <div class="collection-stats">
            <span class="total-cards">{{ filteredCollection.length }} cartes</span>
          </div>
        </div>

        <div class="content-layout">
          <!-- Sidebar Filters -->
          <aside class="sidebar">
            <div class="filters-container">
              <!-- Search -->
              <div class="filter-section">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher une carte..."
                  class="search-input"
                />
              </div>

              <!-- Series Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Série</h3>
                <div class="filter-options">
                  <label v-for="serie in availableSeries" :key="serie" class="checkbox-option">
                    <input
                      type="checkbox"
                      :value="serie"
                      v-model="selectedSeries"
                      class="checkbox-input"
                    />
                    <span class="checkbox-label">{{ serie }}</span>
                  </label>
                </div>
              </div>

              <!-- Rarity Filter -->
              <div class="filter-section">
                <h3 class="filter-title">Rareté</h3>
                <div class="filter-options">
                  <label v-for="rarity in availableRarities" :key="rarity" class="checkbox-option">
                    <input
                      type="checkbox"
                      :value="rarity"
                      v-model="selectedRarities"
                      class="checkbox-input"
                    />
                    <span class="checkbox-label">{{ rarity }}</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <!-- Cards Content -->
          <div class="cards-content">
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

            <!-- No results -->
            <div v-else-if="filteredCollection.length === 0" class="no-results">
              <p>Aucune carte trouvée avec ces filtres</p>
            </div>

            <!-- Collection content -->
            <div v-else class="cards-grid">
              <div v-for="userCard in filteredCollection" :key="userCard.id" class="card-item">
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
                  <div class="card-name-row">
                    <h4 class="card-name">{{ userCard.card.name }}</h4>
                    <span class="card-count">x{{ userCard.quantity }}</span>
                  </div>
                </div>
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
import { onMounted, watch, computed, ref } from 'vue';
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

// Filtres
const searchQuery = ref('');
const selectedSeries = ref<string[]>([]);
const selectedRarities = ref<string[]>([]);

// Computed pour les options de filtres
const availableSeries = computed(() => {
  const series = new Set<string>();
  collection.value.forEach((userCard) => {
    if (userCard.card.set?.name) {
      series.add(userCard.card.set.name);
    }
  });
  return Array.from(series).sort();
});

const availableRarities = computed(() => {
  const rarities = new Set<string>();
  collection.value.forEach((userCard) => {
    if (userCard.card.rarity?.name) {
      rarities.add(userCard.card.rarity.name);
    }
  });
  return Array.from(rarities).sort();
});

// Computed pour les cartes filtrées
const filteredCollection = computed(() => {
  let filtered = collection.value;

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((userCard) => userCard.card.name.toLowerCase().includes(query));
  }

  // Filtre par série
  if (selectedSeries.value.length > 0) {
    filtered = filtered.filter((userCard) =>
      selectedSeries.value.includes(userCard.card.set?.name || ''),
    );
  }

  // Filtre par rareté
  if (selectedRarities.value.length > 0) {
    filtered = filtered.filter((userCard) =>
      selectedRarities.value.includes(userCard.card.rarity?.name || ''),
    );
  }

  return filtered;
});

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
  max-width: 1680px;
  margin: 0 auto;
  padding: 2rem 40px;
}

.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pokeball-icon {
  width: 40px;
  height: 40px;
}

.collection-header h1 {
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
  color: black;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.collection-stats {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(43, 73, 155, 0.15);
}

.total-cards {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #2b499b;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-image-container {
  position: relative;
}

.quantity-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #facf19;
  color: #2b499b;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #2b499b;
}

.card-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.card-info {
  padding: 1rem;
}

.card-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-name {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2b499b;
  margin: 0;
  flex: 1;
}

.card-count {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 13px;
  color: #666;
  margin: 0;
  font-weight: 600;
}

/* Sidebar Styles */
.sidebar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-title {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2b499b;
  margin: 0;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2b499b;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
}

.checkbox-input {
  margin: 0;
  accent-color: #2b499b;
}

.checkbox-label {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 14px;
  color: #333;
}

/* Cards Content */
.cards-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 17px;
}

/* Responsive */
@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .sidebar {
    order: 2;
  }

  .cards-content {
    order: 1;
  }
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
