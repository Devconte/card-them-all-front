import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Card {
  id: string;
  name: string;
  localId: string;
  image: string;
  rarity: string;
  serie?: {
    name: string;
  };
}

interface SetCardsState {
  [setId: string]: {
    cards: Card[];
    rarities: string[];
    loading: boolean;
    error: string | null;
    lastFetch: number;
  };
}

export const useSetCardsStore = defineStore('setCards', () => {
  // État réactif
  const state = ref<SetCardsState>({});

  // Durée du cache : 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Actions
  const fetchSetCards = async (setId: string, force = false) => {
    const now = Date.now();
    const cached = state.value[setId];

    // Vérifier le cache
    if (!force && cached && now - cached.lastFetch < CACHE_DURATION) {
      console.log(`Cache hit for set ${setId}`);
      return cached.cards;
    }

    // Marquer comme en cours de chargement
    if (!state.value[setId]) {
      state.value[setId] = {
        cards: [],
        rarities: [],
        loading: false,
        error: null,
        lastFetch: 0,
      };
    }

    state.value[setId].loading = true;
    state.value[setId].error = null;

    try {
      console.log(`Fetching cards for set ${setId}`);
      const response = await fetch(`http://localhost:3000/booster-pack/sets/${setId}/cards`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      state.value[setId] = {
        cards: data.allCardsFromSet || [],
        rarities: data.availableRarities || [],
        loading: false,
        error: null,
        lastFetch: now,
      };

      console.log(`Cached ${state.value[setId].cards.length} cards for set ${setId}`);
      return state.value[setId].cards;
    } catch (error) {
      console.error(`Error fetching cards for set ${setId}:`, error);
      state.value[setId].error = error instanceof Error ? error.message : 'Unknown error';
      state.value[setId].loading = false;
      throw error;
    }
  };

  const clearCache = (setId?: string) => {
    if (setId) {
      delete state.value[setId];
    } else {
      state.value = {};
    }
  };

  // Getterss
  const getSetCards = computed(() => {
    return (setId: string) => state.value[setId]?.cards || [];
  });

  const getSetRarities = computed(() => {
    return (setId: string) => state.value[setId]?.rarities || [];
  });

  const isLoading = computed(() => {
    return (setId: string) => state.value[setId]?.loading || false;
  });

  const getError = computed(() => {
    return (setId: string) => state.value[setId]?.error || null;
  });

  const hasCachedData = computed(() => {
    return (setId: string) => {
      const cached = state.value[setId];
      return cached && cached.cards.length > 0 && !cached.loading;
    };
  });

  return {
    // État
    state,

    // Actions
    fetchSetCards,
    clearCache,

    // Getters
    getSetCards,
    getSetRarities,
    isLoading,
    getError,
    hasCachedData,
  };
});
