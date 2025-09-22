import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

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

export const useCollectionStore = defineStore('collection', () => {
  // State
  const collection = ref<UserCard[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchCollection = async () => {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const token = authStore.accessToken;

      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await axios.get('http://localhost:3000/collections', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      collection.value = response.data || [];
    } catch (err: unknown) {
      console.error('❌ Error fetching collection:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      error.value = errorMessage;
    } finally {
      loading.value = false;
    }
  };

  return {
    collection,
    loading,
    error,
    fetchCollection,
  };
});
