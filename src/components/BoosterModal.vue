<template>
  <!-- Full Screen Overlay -->
  <div v-if="isOpen" class="booster-overlay" @click="closeModal">
    <!-- Close Button (Top Right) -->
    <button @click="closeModal" class="close-btn">&times;</button>

    <!-- Cards Container (Center) -->
    <div class="cards-container" @click.stop>
      <!-- Cards Grid -->
      <div class="cards-grid">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card-slot"
          :class="{ 'card-revealed': card.revealed }"
          :style="{ '--delay': `${index * 200}ms` }"
        >
          <div class="card-inner">
            <!-- Dos de la carte -->
            <div class="card-back">
              <img src="/backcard.png" alt="Dos de carte" class="card-back-image" />
            </div>
            <!-- Face de la carte -->
            <div class="card-front">
              <img :src="card.image" :alt="card.name" class="card-image" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="bottom-actions">
        <button
          v-if="!isRevealed"
          @click="revealCards"
          class="action-btn primary"
          :disabled="isRevealing"
        >
          {{ isRevealing ? 'Ouverture...' : 'Ouvrir le Booster' }}
        </button>

        <div v-if="isRevealed" class="revealed-actions">
          <button @click="openAnother" class="action-btn secondary">Ouvrir un autre Booster</button>
          <button @click="closeModal" class="action-btn primary">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Card {
  id: string;
  name: string;
  image: string;
  rarity?: {
    name: string;
  };
  revealed?: boolean;
}

interface Props {
  isOpen: boolean;
  cards: Card[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  revealCard: [index: number];
  openAnother: [];
}>();

// State
const isRevealing = ref(false);
const isRevealed = ref(false);

// Methods
const closeModal = () => {
  emit('close');
  // Reset state
  isRevealing.value = false;
  isRevealed.value = false;
  // Reset cards revealed state
  props.cards.forEach((card) => {
    card.revealed = false;
  });
};

const revealCards = async () => {
  isRevealing.value = true;

  // Reveal cards one by one with delay
  for (let i = 0; i < props.cards.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    emit('revealCard', i);
  }

  isRevealing.value = false;
  isRevealed.value = true;
};

const openAnother = () => {
  emit('openAnother');
  // Reset state for new booster
  isRevealing.value = false;
  isRevealed.value = false;
  props.cards.forEach((card) => {
    card.revealed = false;
  });
};
</script>

<style scoped>
/* Full Screen Overlay */
.booster-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.3rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

/* Cards Container */
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
}

.card-slot {
  perspective: 1000px;
  width: 100%;
  aspect-ratio: 2/3;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-revealed .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.card-front {
  transform: rotateY(180deg);
  background: transparent;
}

.card-back-image,
.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Bottom Actions */
.bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.revealed-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  backdrop-filter: blur(10px);
  font-family: 'Montserrat Alternates', sans-serif;
}

.action-btn.primary {
  background: linear-gradient(135deg, #facf19 0%, #e6ba00 100%);
  color: #2b499b;
  box-shadow: 0 4px 15px rgba(250, 207, 25, 0.4);
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e6ba00 0%, #d4a700 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(250, 207, 25, 0.6);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 180px;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .booster-overlay {
    padding: 1rem;
  }

  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }

  .close-btn {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .action-btn {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    min-width: 150px;
  }

  .revealed-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}
</style>
