<template>
  <div class="series">
    <AppNavbar />

    <!-- MEGA-EVOLUTION Banner -->
    <section class="mega-banner">
      <img src="/bandeaumegaserie.png" alt="MÉGA-ÉVOLUTION" class="banner-image" />
    </section>

    <!-- Header Section -->
    <section class="series-header">
      <div class="header-content">
        <div class="title-container">
          <img src="/pokeball.png" alt="Pokéball" class="pokeball-icon" />
          <h1 class="page-title">Séries</h1>
        </div>
      </div>
      <div class="search-section">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un set..."
            class="search-input"
          />
          <img src="/loupe.png" alt="Rechercher" class="search-icon" />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Chargement des sets...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <p>Erreur : {{ error }}</p>
        <button @click="() => setsStore.fetchSets(true)" class="retry-btn">Réessayer</button>
      </div>

      <!-- Sets Content -->
      <div v-else class="sets-content">
        <!-- Grouped by Series -->
        <div
          v-for="serie in groupedSets"
          :key="serie.name"
          class="serie-section"
          :data-serie="serie.name"
        >
          <!-- Serie title with yellow bar on the right -->
          <div class="serie-header">
            <h2 class="serie-title">{{ formatSerieName(serie.name) }}</h2>
            <div class="yellow-bar-right"></div>
          </div>
          <div class="sets-slider">
            <div class="sets-container">
              <div
                v-for="set in serie.displayedSets"
                :key="set.id"
                class="set-card"
                @click="goToSet(set)"
              >
                <img :src="getSerieImage(set.name)" :alt="set.name" class="set-image" />
                <div class="set-info">
                  <div class="set-title">
                    <span class="serie-name">{{ set.name }}</span> -
                    <span v-if="!authStore.isAuthenticated" class="card-count"
                      >{{ set.cardCount?.total || 0 }} cartes</span
                    >
                    <span v-else class="card-counter">
                      <span class="owned-count">{{ getOwnedCardsCount(set.id) }}</span
                      >/<span class="total-count">{{ set.cardCount?.total || 0 }}</span>
                      cartes
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="serie.hasMore" class="slider-arrows">
              <button
                v-if="canScrollLeft(serie.name)"
                @click="scrollSliderLeft(serie.name)"
                class="arrow-btn arrow-left"
              >
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <
              </button>
              <button @click="scrollSliderRight(serie.name)" class="arrow-btn arrow-right">
                >
              </button>
            </div>
          </div>
          <!-- Yellow bar below sets -->
          <div class="yellow-bar-below-sets"></div>
        </div>

        <!-- No Results -->
        <div v-if="filteredSets.length === 0" class="no-results">
          <p>Aucun set trouvé pour "{{ searchQuery }}"</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useSetsStore } from '@/stores/sets';
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import type { Set as SetType } from '@/types';
import { getSetImage } from '@/utils/setImages';

const router = useRouter();
const setsStore = useSetsStore();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();

// Collection data
const { collection } = storeToRefs(collectionStore);
const { fetchCollection } = collectionStore;

// Reactive data
const searchQuery = ref<string>('');

const scrollPositions = ref<Record<string, number>>({});

// Utiliser les données du store
const loading = computed(() => setsStore.isLoading);
const error = computed(() => setsStore.error);

// Computed properties
const filteredSets = computed(() => {
  return setsStore.filteredSets(searchQuery.value);
});

// Group sets by series
const groupedSets = computed(() => {
  const groups: Record<string, SetType[]> = {};

  filteredSets.value.forEach((set) => {
    const serieName = set.serie?.name || 'Autres';
    if (!groups[serieName]) {
      groups[serieName] = [];
    }
    groups[serieName].push(set);
  });

  // Convert to array and sort by most recent release date in each serie
  return Object.entries(groups)
    .map(([name, sets]) => ({
      name,
      sets,
      totalSets: sets.length,
      displayedSets: sets, // Afficher TOUS les sets dans le slider
      hasMore: sets.length > 4, // Garder hasMore pour la flèche
      latestDate: Math.max(...sets.map((set) => new Date(set.releaseDate || 0).getTime())),
    }))
    .sort((a, b) => b.latestDate - a.latestDate); // Most recent first
});

// Fonction pour calculer le nombre de cartes possédées pour un set
const getOwnedCardsCount = (setId: string): number => {
  if (!authStore.isAuthenticated || !collection.value) return 0;

  // Compter les cartes de ce set dans la collection
  return collection.value.filter((userCard) => userCard.card.set?.id === setId).length;
};

const getSerieImage = (serieName: string): string => {
  return getSetImage(serieName);
};

const goToSet = (set: SetType) => {
  router.push(`/sets/${set.id}`);
};

const scrollSliderLeft = (serieName: string) => {
  const slider = document.querySelector(
    `[data-serie="${serieName}"] .sets-container`,
  ) as HTMLElement;
  if (slider) {
    slider.scrollBy({ left: -380, behavior: 'smooth' }); // Scroll vers la gauche
    // Mettre à jour la position après le scroll
    setTimeout(() => {
      scrollPositions.value[serieName] = slider.scrollLeft;
    }, 100);
  }
};

const scrollSliderRight = (serieName: string) => {
  const slider = document.querySelector(
    `[data-serie="${serieName}"] .sets-container`,
  ) as HTMLElement;
  if (slider) {
    slider.scrollBy({ left: 380, behavior: 'smooth' }); // Scroll vers la droite
    // Mettre à jour la position après le scroll
    setTimeout(() => {
      scrollPositions.value[serieName] = slider.scrollLeft;
    }, 100);
  }
};

const canScrollLeft = (serieName: string): boolean => {
  return (scrollPositions.value[serieName] || 0) > 0;
};

const formatSerieName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Lifecycle
onMounted(() => {
  setsStore.fetchSets();

  // Charger la collection si l'utilisateur est connecté
  if (authStore.isAuthenticated) {
    fetchCollection();
  }

  // Ajouter des listeners pour détecter le scroll manuel
  nextTick(() => {
    const sliders = document.querySelectorAll('.sets-container');
    sliders.forEach((slider) => {
      slider.addEventListener('scroll', () => {
        const serieName = slider.closest('[data-serie]')?.getAttribute('data-serie');
        if (serieName) {
          scrollPositions.value[serieName] = slider.scrollLeft;
        }
      });
    });
  });
});
</script>

<style scoped>
.series {
  background: #f8f9fa;
  padding: 0 40px; /* Padding global pour tout le contenu */
}

/* MEGA-EVOLUTION Banner */
.mega-banner {
  width: 100vw;
  height: 471px;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

/* Header Section */
.series-header {
  padding: 2rem 0; /* Pas de padding horizontal, géré par .series */
}

.header-content {
  max-width: 1680px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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

.page-title {
  color: black;
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.search-section {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
}

.search-container {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.search-input {
  width: 90%;
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #2b499b;
  color: white;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(43, 73, 155, 0.3);
}

.search-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 1;
  margin-right: 0;
}

/* Main Content */
.main-content {
  padding: 2rem 0; /* Pas de padding horizontal, géré par .series */
  max-width: 1680px;
  margin: 0 auto;
  background: #f8f9fa;
}

/* Serie Section */
.serie-section {
  margin-bottom: 5rem;
}

.serie-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 10rem;
}

.serie-title {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 35px;
  font-weight: 600;
  color: black;
  margin: 0;
  white-space: nowrap;
  letter-spacing: 1px;
}

.yellow-bar-right {
  background: #facf19;
  height: 3px;
  width: 60%;
  border-radius: 2px;
}

.yellow-bar-below-sets {
  background: #facf19;
  height: 3px;
  width: 60%;
  margin-top: 1rem;
  border-radius: 2px;
}

/* Sets Slider */
.sets-slider {
  position: relative;
  overflow: hidden;
}

.sets-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

.sets-container::-webkit-scrollbar {
  display: none;
}

.slider-arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 100%;
  pointer-events: none;
}

.arrow-left {
  position: absolute;
  left: 0;
  pointer-events: auto;
}

.arrow-right {
  position: absolute;
  right: 0;
  pointer-events: auto;
}

.arrow-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.arrow-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.set-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(43, 73, 155, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: 380px; /* Plus large pour éviter le débordement */
  max-width: 380px;
  height: 220px; /* Un peu plus haut */
}

.set-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(43, 73, 155, 0.25);
}

.set-image {
  width: 100%;
  height: 160px; /* Plus haut */
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
}

.set-info {
  background: #2b499b;
  color: white;
  padding: 1rem;
  text-align: center;
  height: 60px; /* Garde la même hauteur */
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.set-title {
  font-family: 'Montserrat Alternates', sans-serif;
  line-height: 1.3;
  margin: 0;
}

.serie-name {
  font-size: 18px;
  font-weight: 500; /* Medium - moins gras */
  white-space: nowrap; /* Force sur une ligne */
  overflow: hidden;
  text-overflow: ellipsis; /* ... si trop long */
}

.card-count {
  font-size: 15px;
  font-weight: 400; /* Normal */
}

.card-counter {
  font-size: 15px;
  font-weight: 400;
}

.owned-count {
  color: #facf19; /* Jaune pour les cartes possédées */
  font-weight: 600;
}

.total-count {
  color: rgba(255, 255, 255, 0.8); /* Gris pour le total */
}

.set-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.9;
  margin-top: 0.3rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2b499b;
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

/* Error State */
.error {
  text-align: center;
  padding: 4rem 2rem;
  color: #e74c3c;
}

.retry-btn {
  background: #2b499b;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #1e3d6f;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
}

/* Responsive */
@media (min-width: 1920px) {
  .mega-banner {
    height: 600px;
  }
}

@media (max-width: 1200px) {
  .header-content,
  .search-section,
  .main-content {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .mega-banner {
    height: 350px;
  }

  .series-header {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 0.5rem;
  }

  .title-container {
    gap: 0.5rem;
  }

  .pokeball-icon {
    width: 32px;
    height: 32px;
  }

  .page-title {
    font-size: 28px;
  }

  .search-section {
    margin-top: 0.5rem;
  }

  .search-container {
    max-width: 250px;
  }

  .search-input {
    padding: 0.5rem 1.5rem 0.5rem 0.8rem;
    font-size: 0.85rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .serie-section {
    margin-bottom: 2rem;
  }

  .serie-header {
    margin-bottom: 0.8rem;
    gap: 1rem;
  }

  .serie-title {
    font-size: 24px;
  }

  .yellow-bar-right,
  .yellow-bar-below-sets {
    width: 50%;
  }

  .set-card {
    min-width: 280px;
    max-width: 280px;
    height: 200px;
  }

  .set-image {
    height: 140px;
  }

  .set-info {
    height: 60px;
    padding: 0.8rem;
  }

  .serie-name {
    font-size: 16px;
  }

  .card-count {
    font-size: 14px;
  }

  .arrow-btn {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .slider-arrows {
    right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .series-header {
    padding: 1rem 0;
  }

  .header-content {
    padding: 0 1rem;
  }

  .search-section {
    padding: 0 1rem;
  }

  .search-container {
    max-width: 200px;
  }

  .main-content {
    padding: 1rem 0.5rem;
  }

  .pokeball-icon {
    width: 28px;
    height: 28px;
  }

  .page-title {
    font-size: 24px;
  }

  .serie-title {
    font-size: 20px;
  }

  .yellow-bar-right,
  .yellow-bar-below-sets {
    width: 40%;
  }

  .set-card {
    min-width: 240px;
    max-width: 240px;
    height: 180px;
  }

  .set-image {
    height: 120px;
  }

  .set-info {
    height: 60px;
    padding: 0.6rem;
  }

  .serie-name {
    font-size: 14px;
  }

  .card-count {
    font-size: 12px;
  }

  .arrow-btn {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}
</style>
