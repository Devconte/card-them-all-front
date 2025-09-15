<template>
  <div class="set-detail">
    <Navbar />

    <!-- Header Section -->
    <section class="detail-header">
      <div class="header-content">
        <h1 class="page-title">{{ set?.name || 'Série' }}</h1>
        <div class="header-actions">
          <span class="card-count">{{ cards.length }} cartes</span>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
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

            <!-- Rarity Filter -->
            <div class="filter-section">
              <h3 class="filter-title">Rareté</h3>
              <div class="filter-options">
                <label v-for="rarity in rarities" :key="rarity" class="checkbox-option">
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

            <!-- Open Booster Button -->
            <div class="booster-section">
              <button
                class="booster-btn"
                @click="openBooster"
                :disabled="!authStore.isLoggedIn"
                :title="!authStore.isLoggedIn ? 'Veuillez vous connecter' : ''"
              >
                <span class="booster-icon">+</span>
                J'ouvre un booster
              </button>
            </div>
          </div>
        </aside>

        <!-- Cards Grid -->
        <div class="cards-content">
          <div class="cards-header">
            <h2 class="cards-title">Collection</h2>
            <div class="collection-stats">
              <span class="owned-count"
                >{{ ownedCardsCount }} / {{ totalCardsCount }} possédées</span
              >
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading || isLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>Chargement des cartes...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error">
            <p>Erreur: {{ error }}</p>
            <button @click="fetchSetDetails" class="retry-btn">Réessayer</button>
          </div>

          <!-- Cards Grid -->
          <div v-else class="cards-grid">
            <div
              v-for="card in filteredCards"
              :key="card.id"
              class="card-item"
              @click="selectCard(card)"
            >
              <picture>
                <source :srcset="getOptimizedCardImage(card)" type="image/webp" />
                <img
                  :src="getCardImage(card)"
                  :alt="card.name"
                  class="card-image"
                  loading="lazy"
                  @error="handleImageError"
                />
              </picture>
              <div class="card-info">
                <h4 class="card-name">{{ card.name }}</h4>
                <p class="card-rarity">{{ card.rarity }}</p>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="!loading && filteredCards.length === 0" class="no-results">
            <p>Aucune carte trouvée avec ces filtres</p>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSetCardsStore } from '@/stores/setCards'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import type { Set as SetType } from '@/types'

interface Card {
  id: string
  name: string
  localId: string
  image: string
  rarity: string
  serie?: {
    name: string
  }
}

const route = useRoute()
const router = useRouter()
const setCardsStore = useSetCardsStore()
const authStore = useAuthStore()

// Reactive data
const loading = ref<boolean>(false)
const set = ref<SetType | null>(null)
const searchQuery = ref<string>('')
const selectedRarities = ref<string[]>([])

// Computed from store
const cards = computed(() => setCardsStore.getSetCards(route.params.id as string))
const rarities = computed(() => setCardsStore.getSetRarities(route.params.id as string))
const isLoading = computed(() => setCardsStore.isLoading(route.params.id as string))
const error = computed(() => setCardsStore.getError(route.params.id as string))

const filteredCards = computed(() => {
  let filtered = cards.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Rarity filter (multiple selection)
  if (selectedRarities.value.length > 0) {
    filtered = filtered.filter((card) => selectedRarities.value.includes(card.rarity))
  }

  return filtered
})

const ownedCardsCount = computed(() => {
  return cards.value.filter((card) => isCardOwned(card.id)).length
})

const totalCardsCount = computed(() => {
  return cards.value.length
})

// Methods
const fetchSetDetails = async () => {
  const setId = route.params.id as string
  if (!setId) return

  loading.value = true
  try {
    // Fetch set details
    const response = await fetch(`http://localhost:3000/cards/sets/${setId}`)
    const setData = await response.json()
    set.value = setData

    // Fetch cards using store (with cache)
    await setCardsStore.fetchSetCards(setId)
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error)
  } finally {
    loading.value = false
  }
}

const selectCard = (card: Card) => {
  // TODO: Show card details modal
  console.log('Card selected:', card)
}

const openBooster = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  // TODO: Implement booster opening logic
  console.log('Opening booster for set:', set.value?.id)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isCardOwned = (_cardId: string): boolean => {
  // For now, all cards are considered owned until collection integration
  return true
}

const getCardImage = (card: Card): string => {
  return card.image || '/logocard.png'
}

// Optimize image URL for WebP if supported
const getOptimizedCardImage = (card: Card): string => {
  const originalImage = card.image || '/logocard.png'

  // Si c'est une image TCGdx, on peut essayer de l'optimiser
  if (originalImage.includes('tcgdx.net') || originalImage.includes('tcgdex.net')) {
    // Remplacer l'extension par .webp si possible
    return originalImage.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  }

  return originalImage
}

// Image error handling
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/logocard.png' // Fallback image
}

// Lifecycle
onMounted(() => {
  fetchSetDetails()
})
</script>

<style scoped>
.set-detail {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header Section */
.detail-header {
  background: linear-gradient(135deg, #2b499b 0%, #1e3d6f 100%);
  padding: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  color: white;
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-count {
  color: white;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 17px;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  min-height: 600px;
}

/* Sidebar */
.sidebar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 20px;
  color: #2b499b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.checkbox-option:hover {
  background-color: #f5f5f5;
}

.checkbox-input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  color: #333;
  cursor: pointer;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
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

.filter-option {
  padding: 0.6rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.filter-option:hover {
  border-color: #2b499b;
  background: #f8f9fa;
}

.filter-option.active {
  background: #2b499b;
  color: white;
  border-color: #2b499b;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
}

.radio-input {
  margin: 0;
}

.radio-label {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  color: #333;
}

/* Booster Button */
.booster-section {
  margin-top: 2rem;
}

.booster-btn {
  width: 100%;
  background: #facf19;
  color: #2b499b;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.booster-btn:hover:not(:disabled) {
  background: #e6ba00;
  transform: translateY(-2px);
}

.booster-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booster-icon {
  font-size: 20px;
  font-weight: bold;
}

/* Cards Content */
.cards-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.cards-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 28px;
  color: #2b499b;
  margin: 0;
  text-transform: uppercase;
}

.collection-stats {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  color: #666;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  max-width: 100%;
  height: auto; /* Allow image to scale naturally */
  object-fit: contain; /* Ensure entire image is visible */
}

.card-info {
  padding: 1rem;
}

.card-name {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2b499b;
  margin: 0 0 0.5rem 0;
}

.card-rarity {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
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

/* No Results */
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

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .main-content {
    padding: 1rem;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>
