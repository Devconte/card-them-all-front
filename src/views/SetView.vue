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
        <!-- Grouped by Series -->
        <div v-for="serie in groupedSets" :key="serie.name" class="serie-section">
          <h2 class="serie-title">{{ serie.name }}</h2>
          <div class="sets-grid">
            <div
              v-for="set in serie.displayedSets"
              :key="set.id"
              class="set-card"
              @click="goToSet(set)"
            >
              <img :src="getSerieImage(set.name)" :alt="set.name" class="set-image" />
              <div class="set-name">
                <div class="set-title">{{ set.name }}</div>
                <div class="set-details">
                  <span class="set-date">{{ formatDate(set.releaseDate || null) }}</span>
                  <span v-if="set.cardCount" class="set-cards"
                    >{{ set.cardCount.total }} cartes</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton "Voir plus" si nécessaire -->
          <div v-if="serie.hasMore" class="view-more-section">
            <button @click="toggleSeries(serie.name)" class="view-more-btn">
              {{
                expandedSeries.has(serie.name)
                  ? 'Voir moins'
                  : `Voir plus (${serie.totalSets - 4} autres)`
              }}
            </button>
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
import type { Set as SetType } from '@/types'

const router = useRouter()
const setsStore = useSetsStore()

// Reactive data
const searchQuery = ref<string>('')
const expandedSeries = ref<Set<string>>(new Set())

// Utiliser les données du store
const sets = computed(() => setsStore.sets)
const loading = computed(() => setsStore.isLoading)
const error = computed(() => setsStore.error)

// Computed properties
const filteredSets = computed(() => {
  return setsStore.filteredSets(searchQuery.value)
})

// Group sets by series
const groupedSets = computed(() => {
  const groups: Record<string, SetType[]> = {}

  filteredSets.value.forEach((set) => {
    const serieName = set.serie?.name || 'Autres'
    if (!groups[serieName]) {
      groups[serieName] = []
    }
    groups[serieName].push(set)
  })

  // Convert to array and sort by most recent release date in each serie
  return Object.entries(groups)
    .map(([name, sets]) => ({
      name,
      sets,
      totalSets: sets.length,
      displayedSets: expandedSeries.value.has(name) ? sets : sets.slice(0, 4),
      hasMore: sets.length > 4,
      latestDate: Math.max(...sets.map((set) => new Date(set.releaseDate || 0).getTime())),
    }))
    .sort((a, b) => b.latestDate - a.latestDate) // Most recent first
})

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

const goToSet = (set: SetType) => {
  router.push(`/sets/${set.id}`)
}

const toggleSeries = (serieName: string) => {
  if (expandedSeries.value.has(serieName)) {
    expandedSeries.value.delete(serieName)
  } else {
    expandedSeries.value.add(serieName)
  }
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
  padding: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}

.page-title {
  color: white;
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.search-container {
  position: relative;
  max-width: 300px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1.2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
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
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #666;
  pointer-events: none;
  z-index: 1;
}

/* Main Content */
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
}

/* Serie Section */
.serie-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.serie-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
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
  height: 325px; /* Hauteur fixe pour toutes les cartes */
}

.set-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(43, 73, 155, 0.25);
}

.set-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
}

.set-name {
  background: #2b499b;
  color: white;
  padding: 0.8rem 1rem;
  text-align: center;
  height: 85px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.set-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1.3;
  margin-bottom: 0.5rem;
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

/* View More Section */
.view-more-section {
  text-align: center;
  margin-top: 2rem;
}

.view-more-btn {
  background: #facf19;
  color: #2b499b;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-more-btn:hover {
  background: #e6ba00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(250, 207, 25, 0.3);
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
  .series-header {
    padding: 1.5rem 1rem;
  }

  .header-content {
    gap: 1rem;
    text-align: left;
  }

  .page-title {
    font-size: 28px;
  }

  .search-container {
    max-width: 100%;
  }

  .main-content {
    padding: 1rem;
  }

  .serie-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .sets-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .serie-title {
    font-size: 28px;
  }
}
</style>
