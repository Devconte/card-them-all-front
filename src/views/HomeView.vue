<template>
  <div class="home">
    <AppNavbar />

    <!-- Hero Section -->
    <section class="hero">
      <img src="/mega.png" alt="Mega Lucario" class="hero-bg-image" />
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <h2 class="section-title">DERNIÈRES SORTIES</h2>

      <!-- Featured Card -->
      <div v-if="series.length > 0" class="featured-card">
        <div class="featured-card-container" @click="goToSet(series[0])">
          <img :src="getCardImage(series[0].name)" :alt="series[0].name" class="featured-image" />
          <h3 class="featured-title">{{ series[0].name.toUpperCase() }}</h3>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-if="loading" class="loading">Chargement des séries...</div>
      <div v-else-if="error" class="error">Erreur : {{ error }}</div>
      <div v-else class="cards-grid">
        <div
          v-for="set in series.slice(1, 7)"
          :key="set.id"
          class="card-item"
          @click="goToSet(set)"
        >
          <img :src="getCardImage(set.name)" :alt="set.name" class="card-image" />
          <h4 class="card-title">{{ set.name }}</h4>
        </div>
      </div>

      <!-- View More Button -->
      <div class="view-more">
        <button class="view-more-btn" @click="goToSets">
          <span class="plus-icon">+</span>
        </button>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSetsStore } from '@/stores/sets';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import type { Set as SetType } from '@/types';

const router = useRouter();
const setsStore = useSetsStore();

// Utiliser les données du store
const series = computed(() => setsStore.latestSets);
const loading = computed(() => setsStore.isLoading);
const error = computed(() => setsStore.error);

const getCardImage = (setName: string): string => {
  // Mapping des noms de sets vers les images disponibles
  const imageMap: Record<string, string> = {
    'Foudre Noire': '/foudrenoire.png',
    'Flamme Blanche': '/foudreblanche.png',
    'Rivalités Destinées': '/rivalitedestine.png',
    'Aventures Ensemble': '/aventuresnesemble.png',
    'Évolutions Prismatiques': '/évolution prismatique.png',
    'Couronne Stellaire': '/couronnestelaire.png',
    'Étincelles Déferlantes': '/etincelledeferlante.png',
  };

  return imageMap[setName] || '/logocard.png'; // Image par défaut
};

const goToSet = (set: SetType) => {
  router.push(`/sets/${set.id}`);
};

const goToSets = () => {
  router.push('/sets');
};

onMounted(() => {
  setsStore.fetchSets();
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Hero Section */
.hero {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-bg-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

/* Main Content */
.main-content {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  position: relative;
}

.section-title {
  text-align: center;
  color: #2b499b;
  margin: 0 0 3rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
}

/* Featured Card */
.featured-card {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.featured-card-container {
  display: inline-block;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(43, 73, 155, 0.2);
  border: 4px solid #facf19;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.featured-card-container:hover {
  transform: translateY(-5px);
}

.featured-image {
  width: 100%;
  max-width: 500px;
  height: 300px;
  object-fit: cover;
  border: none;
  transition: transform 0.3s ease;
  display: block;
}

.featured-image:hover {
  transform: scale(1.02);
}

.featured-title {
  font-size: 17px;
  font-weight: 700;
  color: white;
  background: #2b499b;
  margin: 0;
  padding: 1rem 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  border-radius: 0 0 8px 8px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.card-item {
  text-align: center;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(43, 73, 155, 0.15);
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border: none;
  transition: all 0.3s ease;
  flex: 1;
}

.card-item:hover .card-image {
  box-shadow: 0 8px 24px rgba(43, 73, 155, 0.3);
  border-color: #facf19;
  transform: scale(1.02);
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: white;
  background: #2b499b;
  margin: 0;
  padding: 1rem 0.5rem;
  letter-spacing: 0.5px;
  line-height: 1.3;
  text-align: center;
  flex-shrink: 0;
}

/* View More Button */
.view-more {
  text-align: center;
  margin-top: 2rem;
}

.view-more-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2b499b;
  border: none;
  color: white;
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(43, 73, 155, 0.3);
}

.view-more-btn:hover {
  background: #facf19;
  color: #2b499b;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(250, 207, 25, 0.4);
}

.plus-icon {
  display: block;
  line-height: 1;
}

/* Loading and Error States */
.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #2b499b;
}

.error {
  color: #e74c3c;
}

/* Responsive Design */
@media (min-width: 1200px) {
  .hero {
    height: 60vh;
    overflow: hidden;
  }

  .hero-bg-image {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .hero-bg-image {
    max-height: 50vh;
    width: 100%;
    object-fit: contain;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .card-image {
    height: 200px;
  }

  .card-title {
    font-size: 14px;
    padding: 0.6rem 0.4rem;
  }

  .featured-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 12px;
    padding: 0.5rem 0.3rem;
    letter-spacing: 0.3px;
  }
}
</style>
