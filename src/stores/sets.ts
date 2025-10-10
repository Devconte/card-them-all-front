import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { Set } from '@/types';

export const useSetsStore = defineStore('sets', () => {
  // State
  const sets = ref<Set[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<Date | null>(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Getters
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);
  const setsCount = computed(() => sets.value.length);

  // Check if cache is still valid
  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false;
    return Date.now() - lastFetch.value.getTime() < CACHE_DURATION;
  });

  // Get latest sets (for homepage)
  const latestSets = computed(() => {
    return sets.value
      .filter((set) => set.releaseDate)
      .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
      .slice(0, 7);
  });

  // Check if a set has cards with images by fetching the cards
  const hasCardsWithImages = async (setId: string): Promise<boolean> => {
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + "/cards/sets/" + setId);
      if (!response.ok) return false;

      const data = await response.json();
      const cards = data.data || [];

      // Check if at least one card has an image
      return cards.some((card: { image: string | null }) => card.image);
    } catch {
      return false;
    }
  };

  // Get sets filtered by search
  const filteredSets = computed(() => {
    return (searchQuery: string) => {
      let filtered = sets.value;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter((set) =>
          set.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      return filtered;
    };
  });

  // Actions
  const fetchSets = async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (isCacheValid.value && !forceRefresh && sets.value.length > 0) {
      return sets.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get( "https://backend.cardthemall.fr/sets");
      // Fais ça :
      const apiResponse = response.data;
      const setsData = apiResponse.data as Set[];
      // Les données sont déjà complètes avec releaseDate et serie
      const setsWithDetails = setsData;
      // Filter out Pokémon Pocket sets
      const filteredSets = setsWithDetails.filter(
        (set: Set) =>
          !set.apiSetId.includes('tcgp') &&
          !set.apiSetId.startsWith('A') &&
          !set.apiSetId.includes('P-A') &&
          !set.name.toLowerCase().includes('pokémon pocket'),
      );

      // Sort by release date (most recent first) and filter out sets without dates
      const sortedSets = filteredSets
        .filter((set: Set) => set.releaseDate)
        .sort(
          (a: Set, b: Set) =>
            new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime(),
        );

      // Filter out sets without card images (async check)
      const setsWithCardImages = [];
      for (const set of sortedSets) {
        const hasImages = await hasCardsWithImages(set.id);
        if (hasImages) {
          setsWithCardImages.push(set);
        }
      }

      sets.value = setsWithCardImages;
      lastFetch.value = new Date();

      return setsWithCardImages;
    } catch (err) {
      error.value = 'Erreur lors du chargement des séries';
      console.error('Erreur:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSetById = async (setId: string) => {
    try {
      // Utiliser le fichier JSON statique
      const response = await fetch('/sets.json');
      const sets: Set[] = await response.json();
      const set = sets.find((s) => s.id === setId);

      if (!set) {
        throw new Error(`Set ${setId} not found`);
      }

      return set;
    } catch (err) {
      error.value = `Erreur lors du chargement du set ${setId}`;
      console.error('Erreur:', err);
      throw err;
    }
  };

  const refreshSets = async () => {
    return fetchSets(true);
  };

  const clearError = () => {
    error.value = null;
  };

  const clearCache = () => {
    sets.value = [];
    lastFetch.value = null;
  };

  // Initialize sets on store creation
  const initializeSets = async () => {
    if (sets.value.length === 0) {
      await fetchSets();
    }
  };

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
  };
});
