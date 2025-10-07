<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="close-btn" @click="closeModal" aria-label="Fermer">
        <span class="close-icon">×</span>
      </button>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Left Side - Card Image -->
        <div class="card-image-section">
          <picture>
            <source :srcset="getOptimizedCardImage(card)" type="image/webp" />
            <img
              :src="getCardImage(card)"
              :alt="card.name"
              class="card-detail-image"
              @error="handleImageError"
            />
          </picture>
        </div>

        <!-- Right Side - Card Details -->
        <div class="card-details-section">
          <div class="card-header">
            <h2 class="card-title">{{ card.name }}</h2>
            <div class="card-badges">
              <span v-if="card.rarity" class="rarity-badge">{{ card.rarity.name }}</span>
              <span v-if="card.category" class="category-badge">{{ card.category }}</span>
            </div>
          </div>

          <div class="card-info">
            <!-- Basic Info -->
            <div class="info-section">
              <h3 class="section-title">Informations</h3>
              <div class="info-grid">
                <div v-if="card.localId" class="info-item">
                  <span class="info-label">Numéro :</span>
                  <span class="info-value">{{ card.localId }}/{{ getTotalCardsInSet() }}</span>
                </div>
                <div v-if="card.set" class="info-item">
                  <span class="info-label">Série :</span>
                  <span class="info-value">{{ card.set.name }}</span>
                </div>
                <div v-if="card.illustrator" class="info-item">
                  <span class="info-label">Illustrateur :</span>
                  <span class="info-value">{{ card.illustrator }}</span>
                </div>
                <div v-if="card.regulationMark" class="info-item">
                  <span class="info-label">Marque de régulation :</span>
                  <span class="info-value">{{ card.regulationMark }}</span>
                </div>
              </div>
            </div>

            <!-- Pokémon Stats -->
            <div v-if="card.hp || card.types || card.stage" class="info-section">
              <h3 class="section-title">Caractéristiques</h3>
              <div class="info-grid">
                <div v-if="card.hp" class="info-item">
                  <span class="info-label">PV :</span>
                  <span class="info-value">{{ card.hp }}</span>
                </div>
                <div v-if="card.stage" class="info-item">
                  <span class="info-label">Stade :</span>
                  <span class="info-value">{{ card.stage }}</span>
                </div>
                <div v-if="card.retreat" class="info-item">
                  <span class="info-label">Coût de retraite :</span>
                  <span class="info-value">{{ card.retreat }}</span>
                </div>
              </div>

              <!-- Types -->
              <div v-if="card.types && card.types.length > 0" class="types-section">
                <span class="info-label">Types :</span>
                <div class="types-list">
                  <span v-for="type in card.types" :key="type" class="type-badge">
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Collection Info -->
            <div v-if="authStore.isAuthenticated" class="info-section">
              <h3 class="section-title">Collection</h3>
              <div class="collection-info">
                <div class="quantity-display">
                  <span class="quantity-label">Quantité possédée :</span>
                  <span class="quantity-value">{{ getUserCardQuantity(card.id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { useCollectionStore } from '@/stores/collection';

const authStore = useAuthStore();
const collectionStore = useCollectionStore();

const props = defineProps<{
  card: Card;
  isOpen: boolean;
  totalCardsInSet?: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const closeModal = () => {
  emit('close');
};

// Image handling
const getCardImage = (card: Card): string => {
  const baseImage = card.image || '/logocard.png';
  if (baseImage.includes('tcgdx.net') || baseImage.includes('tcgdex.net')) {
    return `${baseImage}/high.webp`;
  }
  return baseImage;
};

const getOptimizedCardImage = (card: Card): string => {
  const baseImage = card.image || '/logocard.png';
  if (baseImage.includes('tcgdex.net')) {
    return `${baseImage}/high.webp`;
  }
  return baseImage;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/logocard.png';
};

// Collection functions
const getUserCardQuantity = (cardId: string): number => {
  if (!authStore.isAuthenticated || !collectionStore.collection) return 0;
  const userCard = collectionStore.collection.find((uc) => uc.cardId === cardId);
  return userCard ? userCard.quantity : 0;
};

// Get total cards in set
const getTotalCardsInSet = (): string => {
  return props.totalCardsInSet ? props.totalCardsInSet.toString() : '?';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.close-icon {
  font-size: 24px;
  font-weight: bold;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
}

.card-image-section {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card-detail-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-details-section {
  padding: 2rem;
  overflow-y: auto;
}

.card-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 28px;
  color: #2b499b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rarity-badge {
  background: linear-gradient(135deg, #facf19, #f4a623);
  color: #2b499b;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.category-badge {
  background: #2b499b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.info-section {
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 18px;
  color: #2b499b;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.types-section {
  margin-top: 1rem;
}

.types-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.type-badge {
  background: #e8f4f8;
  color: #2b499b;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.collection-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #facf19;
}

.quantity-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-label {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.quantity-value {
  font-family: 'Luckiest Guy', cursive;
  font-size: 24px;
  color: #facf19;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
  }

  .card-image-section {
    padding: 1rem;
    min-height: 300px;
  }

  .card-details-section {
    padding: 1rem;
  }

  .card-title {
    font-size: 24px;
  }

  .modal-content {
    max-height: 95vh;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .card-title {
    font-size: 20px;
  }

  .info-grid {
    gap: 0.5rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
