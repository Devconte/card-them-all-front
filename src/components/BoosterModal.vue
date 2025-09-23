<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          <img src="/pokeball.png" alt="Pokéball" class="pokeball-icon" />
          Ouvrir un Booster
        </h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <!-- Booster Content -->
      <div class="booster-content">
        <!-- Cards Grid -->
        <div class="cards-grid" :class="`grid-${cardsPerRow}`">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="card-slot"
            :class="{ 'card-revealed': card.revealed }"
            :style="{ '--delay': `${index * 200}ms` }"
          >
            <div class="card-inner">
              <div class="card-back">
                <img src="/card-back.webp" alt="Dos de carte" class="card-back-image" />
              </div>
              <div class="card-front">
                <img :src="card.image" :alt="card.name" class="card-image" />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button
            v-if="!isRevealed"
            @click="revealCards"
            class="reveal-btn"
            :disabled="isRevealing"
          >
            {{ isRevealing ? 'Ouverture...' : 'Ouvrir le Booster' }}
          </button>
          <button v-if="isRevealed" @click="closeModal" class="close-modal-btn">Fermer</button>
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
  revealed: boolean;
}

interface Props {
  isOpen: boolean;
  cards: Card[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  revealCard: [index: number];
}>();

// State
const isRevealing = ref(false);
const isRevealed = ref(false);

// Computed
const cardsPerRow = computed(() => {
  const count = props.cards.length;
  if (count <= 5) return 5;
  if (count <= 10) return 5; // 2 rows of 5 for 10 cards
  if (count <= 15) return 5;
  return 5;
});

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
    // Use emit to notify parent to update the card
    emit('revealCard', i);
  }

  isRevealing.value = false;
  isRevealed.value = true;
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
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 95vw;
  max-height: 95vh;
  width: 1200px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #2b499b, #1e3d6f);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1.5rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pokeball-icon {
  width: 32px;
  height: 32px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.booster-content {
  padding: 2rem;
  text-align: center;
}

.cards-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  padding: 1rem;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.card-slot {
  aspect-ratio: 2/3;
  max-width: 180px;
  width: 100%;
  perspective: 1000px;
  animation: cardAppear 0.5s ease-out;
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}

.card-slot.card-revealed .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-back {
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-front {
  transform: rotateY(180deg);
  background: transparent;
  display: flex;
  flex-direction: column;
}

.card-back-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.reveal-btn,
.add-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reveal-btn {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  color: white;
}

.reveal-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e55a2b, #e67e47);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.add-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.add-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a34a, #15803d);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 222, 128, 0.3);
}

.close-modal-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.close-modal-btn:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
}

.reveal-btn:disabled,
.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 95vw;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .booster-content {
    padding: 1.5rem;
  }

  .card-slot {
    max-width: 120px;
  }

  .cards-grid {
    gap: 0.5rem;
  }

  .reveal-btn,
  .add-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
