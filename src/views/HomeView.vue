<template>
  <div class="home">
    <Navbar />

    <h1>Bienvenue sur Card Them All !</h1>

    <div class="home-description">
      <p>
        Card Them All est un site de collection de cartes de jeu de société. Vous pouvez créer votre
        collection, ajouter des cartes, et les échanger avec d'autres joueurs.
      </p>
    </div>

    <div v-if="loading" class="loading">Chargement des séries...</div>

    <div v-else-if="error" class="error">Erreur : {{ error }}</div>

    <div v-else class="series-grid">
      <div v-for="set in series" :key="set.id" class="serie-card">
        <h3>{{ set.name }}</h3>
        <p v-if="set.cardCount">Cartes: {{ set.cardCount.total }}</p>
        <p v-if="set.releaseDate" class="release-date">
          Sortie: {{ new Date(set.releaseDate).toLocaleDateString('fr-FR') }}
        </p>
        <p class="set-id">ID: {{ set.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'

const series = ref([])
const loading = ref(false)
const error = ref(null)

const fetchSeries = async () => {
  loading.value = true
  error.value = null

  try {
    // Récupérer la liste des sets
    const response = await axios.get('/api/cards/sets/list')
    const allSets = response.data

    // Prendre les 10 derniers sets (pour avoir plus de choix)
    // Filtrer les sets Pokémon Pocket (tcgp, A1, A2, A3, A4, etc.)
    const filteredSets = allSets.filter(
      (set) => !set.id.includes('tcgp') && !set.id.startsWith('A') && !set.id.includes('P-A'),
    )
    const lastSets = filteredSets.slice(-5)

    // Récupérer les détails de chaque set pour avoir les dates
    const setsWithDates = await Promise.all(
      lastSets.map(async (set) => {
        try {
          const detailResponse = await axios.get(`/api/cards/sets/${set.id}`)
          return {
            ...set,
            releaseDate: detailResponse.data.releaseDate,
          }
        } catch (err) {
          // Si erreur, garder le set sans date
          return { ...set, releaseDate: null }
        }
      }),
    )

    // Trier par date de sortie (les plus récents en premier)
    const sortedSets = setsWithDates
      .filter((set) => set.releaseDate) // Garder seulement ceux avec une date
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 5) // Prendre les 5 plus récents

    series.value = sortedSets
  } catch (err) {
    error.value = 'Erreur lors du chargement des séries'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSeries()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.serie-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.serie-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.set-id {
  font-size: 0.8em;
  color: #666;
  margin-top: 10px;
}

.release-date {
  font-size: 0.9em;
  color: #2c5aa0;
  font-weight: 500;
  margin: 5px 0;
}
</style>
