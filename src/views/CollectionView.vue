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
        </div>

        <!-- Mobile Search and Filter Bar -->
        <div class="mobile-search-filter">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une carte..."
              class="search-input"
            />
          </div>
          <button @click="toggleMobileFilters" class="filter-button">
            <img src="/filterbtn.png" alt="Filtres" class="filter-icon" />
          </button>
        </div>

        <div class="content-layout">
          <!-- Sidebar Filters -->
          <aside class="sidebar desktop-sidebar">
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
            <!-- Quick Stats Bar -->
            <div class="quick-stats-bar">
              <div class="stat-chip">
                <span class="stat-value">{{ stats.totalCards }}</span>
                <span class="stat-label">Total</span>
              </div>
              <div class="stat-chip">
                <span class="stat-value">{{ stats.uniqueCards }}</span>
                <span class="stat-label">Uniques</span>
              </div>
              <div class="stat-chip">
                <span class="stat-value">{{ stats.totalSets }}</span>
                <span class="stat-label">Séries</span>
              </div>
              <div class="stat-chip favorite">
                <span class="stat-value">{{ stats.topSeries }}</span>
                <span class="stat-label">Favorite</span>
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

            <!-- No results -->
            <div v-else-if="filteredCollection.length === 0" class="no-results">
              <p>Aucune carte trouvée avec ces filtres</p>
            </div>

            <!-- Collection content -->
            <div v-else class="cards-grid">
              <div
                v-for="userCard in filteredCollection"
                :key="userCard.id"
                class="card-item"
                @click="openCardDetails(userCard)"
              >
                <div class="card-image-container">
                  <img
                    :src="getCardImage(userCard)"
                    :alt="userCard.card.name"
                    class="card-image"
                    @error="handleImageError"
                  />
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

    <!-- Modal de détail de carte -->
    <CardDetails
      v-if="selectedCard"
      :card="selectedCard"
      :isOpen="isCardDetailsOpen"
      @close="closeCardDetails"
    />

    <!-- Mobile Filters Modal -->
    <div
      class="mobile-filters-overlay"
      :class="{ open: isMobileFiltersOpen }"
      @click="closeMobileFilters"
    >
      <div class="mobile-filters-modal" @click.stop>
        <div class="mobile-filters-header">
          <h3 class="mobile-filters-title">Filtres</h3>
          <button @click="closeMobileFilters" class="close-filters-btn">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="mobile-filters-content">
          <!-- Series Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Série</h4>
            <div class="filter-options">
              <label class="radio-option">
                <input type="radio" v-model="selectedSeries" value="" class="radio-input" />
                <span class="radio-label">Toutes</span>
              </label>
              <label v-for="series in availableSeries" :key="series" class="radio-option">
                <input type="radio" v-model="selectedSeries" :value="series" class="radio-input" />
                <span class="radio-label">{{ series }}</span>
              </label>
            </div>
          </div>

          <!-- Rarity Filter -->
          <div class="filter-section">
            <h4 class="filter-title">Rareté</h4>
            <div class="filter-options">
              <label class="checkbox-option">
                <input type="checkbox" value="" v-model="selectedRarities" class="checkbox-input" />
                <span class="checkbox-label">Toutes</span>
              </label>
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

          <button @click="applyFilters" class="apply-filters-btn">Appliquer les filtres</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCollectionStore } from '@/stores/collection';
import { useAuthStore } from '@/stores/auth';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import CardDetails from '@/components/CardDetails.vue';
import type { Card } from '@/types';

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

// Collection stats from API
const stats = ref({
  totalCards: 0,
  uniqueCards: 0,
  totalSets: 0,
  topSeries: '',
});

const fetchStats = async () => {
  if (!authStore.isAuthenticated) return;

  try {
    const response = await fetch('http://localhost:3000/collections/stats', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Trouver la série avec le plus de cartes
      let topSeries = 'Aucune';
      if (data.cardsBySet && data.cardsBySet.length > 0) {
        const sortedSets = data.cardsBySet.sort(
          (a: { cardCount: number }, b: { cardCount: number }) => b.cardCount - a.cardCount,
        );
        topSeries = sortedSets[0].setName;
      }

      stats.value = {
        totalCards: data.totalCards || 0,
        uniqueCards: data.uniqueCards || 0,
        totalSets: data.totalSets || 0,
        topSeries,
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error);
  }
};

// Charger les données au montage
onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchCollection();
    fetchStats();
  }
});

// Surveiller les changements d'authentification
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      fetchCollection();
      fetchStats();
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

// Modal de détail de carte
const isCardDetailsOpen = ref(false);
const selectedCard = ref<Card | null>(null);

// Mobile Filters Modal State
const isMobileFiltersOpen = ref(false);

const openCardDetails = (userCard: UserCard) => {
  selectedCard.value = userCard.card as Card;
  isCardDetailsOpen.value = true;
};

const closeCardDetails = () => {
  isCardDetailsOpen.value = false;
  selectedCard.value = null;
};

// Mobile Filters Methods
const toggleMobileFilters = () => {
  isMobileFiltersOpen.value = !isMobileFiltersOpen.value;
};

const closeMobileFilters = () => {
  isMobileFiltersOpen.value = false;
};

const applyFilters = () => {
  closeMobileFilters();
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
  grid-template-columns: repeat(3, 1fr);
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
  box-sizing: border-box;
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

/* Quick Stats Bar */
.quick-stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.stat-chip {
  background: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  transition: transform 0.2s ease;
}

.stat-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-chip .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2b499b;
  font-family: 'Montserrat Alternates', sans-serif;
  line-height: 1;
}

.stat-chip .stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.stat-chip.favorite {
  min-width: 120px;
}

.stat-chip.favorite .stat-value {
  font-size: 1rem;
  text-align: center;
  word-break: break-word;
  line-height: 1.1;
}

/* Mobile Search and Filter Bar */
.mobile-search-filter {
  display: none;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  align-items: center;
  gap: 1rem;
  max-width: 90%;
  margin: 0 auto 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-search-filter .search-container {
  flex: 1;
}

.mobile-search-filter .search-input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 13px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.mobile-search-filter .search-input:focus {
  outline: none;
  border-color: #2b499b;
}

.mobile-search-filter .filter-button {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-search-filter .filter-button:hover {
  background: rgba(43, 73, 155, 0.1);
}

.mobile-search-filter .filter-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* Mobile Filters Modal */
.mobile-filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.mobile-filters-overlay.open {
  display: flex;
}

.mobile-filters-modal {
  background: white;
  border-radius: 12px;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1003;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.mobile-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.mobile-filters-title {
  margin: 0;
  color: #2b499b;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-filters-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-filters-btn:hover {
  background: #f0f0f0;
}

.mobile-filters-content {
  padding: 1rem;
}

.mobile-filters-content .filter-section {
  margin-bottom: 1.5rem;
}

.mobile-filters-content .filter-title {
  margin: 0 0 0.75rem 0;
  color: #2b499b;
  font-size: 1rem;
  font-weight: 600;
}

.mobile-filters-content .filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.radio-option:hover,
.checkbox-option:hover {
  background: #f8f9fa;
}

.radio-input,
.checkbox-input {
  margin: 0;
}

.radio-label,
.checkbox-label {
  font-size: 0.9rem;
  color: #333;
}

.apply-filters-btn {
  width: 100%;
  background: #2b499b;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.apply-filters-btn:hover {
  background: #1e3d6f;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-search-filter {
    display: flex;
  }

  .content-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .desktop-sidebar {
    display: none;
  }

  .mobile-filters-modal {
    width: 100%;
  }

  .sidebar {
    order: 2;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .cards-content {
    order: 1;
  }

  .quick-stats-bar {
    gap: 0.3rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    max-width: 280px;
    margin: 0 auto;
  }

  .stat-chip {
    padding: 0.25rem 0.5rem;
    min-width: 45px;
  }

  .stat-chip .stat-value {
    font-size: 0.9rem;
  }

  .stat-chip .stat-label {
    font-size: 0.6rem;
  }

  .stat-chip.favorite {
    min-width: 70px;
  }

  .stat-chip.favorite .stat-value {
    font-size: 0.9rem;
  }

  .collection-header h1 {
    font-size: 28px;
  }
}

/* Statistics Dashboard */
.stats-dashboard {
  margin: 2rem 0;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #facf19, #2b499b);
}

.stat-card.primary::before {
  background: linear-gradient(90deg, #2b499b, #4169e1);
}

.stat-card.rare::before {
  background: linear-gradient(90deg, #ff6b6b, #ffd93d);
}

.stat-card.series::before {
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
}

.stat-card.completion::before {
  background: linear-gradient(90deg, #00b894, #00cec9);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card .stat-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2b499b;
}

.stat-card .stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2b499b;
  font-family: 'Montserrat Alternates', sans-serif;
  margin-bottom: 0.5rem;
  word-break: break-word;
  line-height: 1.1;
}

/* Adjust text size for long series names */
.stat-card.completion .stat-value {
  font-size: 1.8rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
  font-family: 'Montserrat Alternates', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 360px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
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
