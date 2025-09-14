<template>
  <div class="series">
    <Navbar />

    <!-- Header Section -->
    <section class="series-header">
      <div class="header-content">
        <h1 class="page-title">SETS</h1>
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un set..."
            class="search-input"
          />
          <div class="search-icon">🔍</div>
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
        <!-- Sets Grid -->
        <div class="sets-grid">
          <div v-for="set in filteredSets" :key="set.id" class="set-card" @click="goToSet(set)">
            <img :src="getSerieImage(set.name)" :alt="set.name" class="set-image" />
            <div class="set-info">
              <h3 class="set-name">{{ set.name }}</h3>
              <p v-if="set.serie" class="set-serie">Série: {{ set.serie.name }}</p>
              <p class="set-date">{{ formatDate(set.releaseDate || null) }}</p>
              <p v-if="set.cardCount" class="set-cards">{{ set.cardCount.total }} cartes</p>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredSets.length === 0" class="no-results">
          <p>Aucun set trouvé pour "{{ searchQuery }}"</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSetsStore } from '@/stores/sets'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const setsStore = useSetsStore()

// Reactive data
const searchQuery = ref<string>('')

// Utiliser les données du store
const sets = computed(() => setsStore.sets)
const loading = computed(() => setsStore.isLoading)
const error = computed(() => setsStore.error)

// Computed properties
const filteredSets = computed(() => {
  return setsStore.filteredSets(searchQuery.value)
})

// Plus besoin de fetchSets - le store s'en occupe !

const getSerieImage = (serieName: string): string => {
  const imageMap: Record<string, string> = {
    'Foudre Noire': '/foudrenoire.png',
    'Flamme Blanche': '/foudreblanche.png',
    'Rivalités Destinées': '/rivalitedestine.png',
    'Aventures Ensemble': '/aventuresnesemble.png',
    'Évolutions Prismatiques': '/évolution prismatique.png',
    'Couronne Stellaire': '/couronnestelaire.png',
    'Étincelles Déferlantes': '/foudreblanche.png',
  }

  return imageMap[serieName] || '/logocard.png'
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Date inconnue'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  })
}

const goToSet = (set: Set) => {
  router.push(`/sets/${set.id}`)
}

// Lifecycle
onMounted(() => {
  setsStore.fetchSets()
})
</script>

<style scoped>
.series {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header Section */
.series-header {
  background: linear-gradient(135deg, #2b499b 0%, #1e3d6f 100%);
  padding: 3rem 2rem;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #666;
}

/* Main Content */
.main-content {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  padding: 0.8rem 1.5rem;
  border: 2px solid #2b499b;
  background: white;
  color: #2b499b;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #f0f0f0;
}

.filter-tab.active {
  background: #2b499b;
  color: white;
}

/* Block Section */
.block-section {
  margin-bottom: 4rem;
}

.block-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2b499b;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 3px solid #facf19;
  padding-bottom: 0.5rem;
  display: inline-block;
}

/* Sets Grid */
.sets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.set-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(43, 73, 155, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
}

.set-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(43, 73, 155, 0.25);
}

.set-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.set-info {
  padding: 1.5rem;
}

.set-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2b499b;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.set-serie {
  color: #2b499b;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0.25rem 0;
}

.set-date {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.set-cards {
  color: #888;
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
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
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .series-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .block-title {
    font-size: 1.5rem;
  }
}
</style>
