import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Set } from '@/types'

export const useSetsStore = defineStore('sets', () => {
  // State
  const sets = ref<Set[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<Date | null>(null)

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  // Getters
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const setsCount = computed(() => sets.value.length)

  // Check if cache is still valid
  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false
    return Date.now() - lastFetch.value.getTime() < CACHE_DURATION
  })

  // Get latest sets (for homepage)
  const latestSets = computed(() => {
    return sets.value
      .filter((set) => set.releaseDate)
      .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
      .slice(0, 5)
  })

  // Get sets filtered by search
  const filteredSets = computed(() => {
    return (searchQuery: string) => {
      if (!searchQuery.trim()) return sets.value
      return sets.value.filter((set) => set.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
  })

  // Actions
  const fetchSets = async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (isCacheValid.value && !forceRefresh && sets.value.length > 0) {
      return sets.value
    }

    loading.value = true
    error.value = null

    try {
      // Utiliser le fichier JSON statique - plus de requêtes API !
      const response = await fetch('/sets.json')
      const setsData: Set[] = await response.json()

      // Les données sont déjà complètes avec releaseDate et serie
      const setsWithDetails = setsData

      // Filter out Pokémon Pocket sets (more robust filtering)
      const filteredSets = setsWithDetails.filter(
        (set) =>
          !set.id.includes('tcgp') &&
          !set.id.startsWith('A') &&
          !set.id.includes('P-A') &&
          !set.name.toLowerCase().includes('pokémon pocket'),
      )

      // Sort by release date (most recent first) and filter out sets without dates
      const sortedSets = filteredSets
        .filter((set) => set.releaseDate)
        .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())

      sets.value = sortedSets
      lastFetch.value = new Date()

      return sortedSets
    } catch (err) {
      error.value = 'Erreur lors du chargement des séries'
      console.error('Erreur:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSetById = async (setId: string) => {
    try {
      // Utiliser le fichier JSON statique
      const response = await fetch('/sets.json')
      const sets: Set[] = await response.json()
      const set = sets.find((s) => s.id === setId)

      if (!set) {
        throw new Error(`Set ${setId} not found`)
      }

      return set
    } catch (err) {
      error.value = `Erreur lors du chargement du set ${setId}`
      console.error('Erreur:', err)
      throw err
    }
  }

  const refreshSets = async () => {
    return fetchSets(true)
  }

  const clearError = () => {
    error.value = null
  }

  const clearCache = () => {
    sets.value = []
    lastFetch.value = null
  }

  // Initialize sets on store creation
  const initializeSets = async () => {
    if (sets.value.length === 0) {
      await fetchSets()
    }
  }

  return {
    // State
    sets,
    loading,
    error,
    lastFetch,

    // Getters
    isLoading,
    hasError,
    setsCount,
    isCacheValid,
    latestSets,
    filteredSets,

    // Actions
    fetchSets,
    fetchSetById,
    refreshSets,
    clearError,
    clearCache,
    initializeSets,
  }
})
