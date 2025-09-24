<template>
  <div class="register-page">
    <!-- Bouton retour accueil -->
    <div class="back-button">
      <router-link to="/" class="back-link"> ← Retour à l'accueil </router-link>
    </div>

    <div class="auth-container">
      <div class="auth-content">
        <!-- Formulaire d'inscription -->
        <div class="auth-form-section">
          <!-- Logo en haut à gauche -->
          <div class="auth-logo-top">
            <img src="/logocardlong.png" alt="Card Them All" class="logo-image" />
          </div>

          <div class="auth-form-card">
            <!-- Titre en haut à gauche du formulaire -->
            <h2 class="auth-title">Inscription</h2>

            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="form-group">
                <label for="username">Nom du compte</label>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  required
                  class="form-input"
                  :class="{ error: authStore.error }"
                  placeholder="Strawberry37"
                />
              </div>

              <div class="form-group">
                <label for="password">Mot de passe</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="form-input"
                  :class="{ error: authStore.error }"
                  placeholder="••••••••"
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmer votre mot de passe</label>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  class="form-input"
                  :class="{ error: authStore.error }"
                  placeholder="••••••••"
                />
              </div>

              <div class="form-group">
                <label for="email">Adresse mail</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="form-input"
                  :class="{ error: authStore.error }"
                  placeholder="Strawberry37@gmail.com"
                />
              </div>

              <div
                v-if="!isFormValid && (username || email || password || confirmPassword)"
                class="info-message"
              >
                Veuillez remplir tous les champs et vérifier que les mots de passe correspondent
              </div>

              <div v-if="authStore.error" class="error-message">
                {{ authStore.error.message }}
              </div>

              <button
                type="submit"
                class="primary-btn"
                :disabled="authStore.loading || !isFormValid"
              >
                <span v-if="authStore.loading">Inscription...</span>
                <span v-else>S'inscrire</span>
              </button>
            </form>

            <div class="auth-footer">
              <p class="login-prompt">
                Vous avez déjà un compte ?
                <router-link to="/login" class="login-link">Se connecter</router-link>
              </p>
            </div>
          </div>
        </div>

        <!-- Illustration -->
        <div class="auth-illustration">
          <img src="/bannerlogin.png" alt="Pokémon illustration" class="illustration-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form data
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value;
});

const isFormValid = computed(() => {
  return (
    username.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    !passwordMismatch.value
  );
});

const handleRegister = async () => {
  authStore.clearError();

  if (passwordMismatch.value) {
    return;
  }

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    return;
  }

  const success = await authStore.register(
    email.value,
    password.value,
    username.value,
    confirmPassword.value,
  );

  if (success) {
    router.push('/');
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  padding: 0;
  margin: 0;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

.back-link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #2b499b;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.auth-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 0;
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  max-width: 100%;
  width: 100%;
  min-height: 100vh;
}

.auth-form-section {
  padding: 4rem 5rem;
  background: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.auth-form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
  pointer-events: none;
}

.auth-form-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* Logo en haut à gauche */
.auth-logo-top {
  position: absolute;
  top: 6rem;
  left: 4rem;
  z-index: 2;
}

.logo-image {
  width: 150px;
  height: auto;
}

/* Titre du formulaire */
.auth-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 35px;
  color: #333;
  margin: 0 0 2rem 0;
  text-align: left;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 400;
  font-size: 17px;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 400;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: #2b499b;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(43, 73, 155, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
  background-color: #fef5f5;
}

.info-message {
  color: #2b499b;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background: #f0f4ff;
  border: 1px solid #d1e7ff;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background: #fef5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.primary-btn {
  background: #2b499b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
  margin-top: 1rem;
}

.primary-btn:hover:not(:disabled) {
  background: #1e3a8a;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(43, 73, 155, 0.3);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.login-prompt {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.login-link {
  color: #2b499b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #1e3a8a;
  text-decoration: underline;
}

.auth-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
  min-height: 100vh;
  position: relative;
}

.illustration-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-content {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: 100%;
  }

  .auth-illustration {
    order: -1;
    padding: 0;
    min-height: 50vh;
  }

  .auth-form-section {
    padding: 3rem 2rem;
    min-height: 50vh;
  }

  .illustration-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 768px) {
  .register-page {
    padding: 0;
  }

  .back-button {
    top: 1rem;
    left: 1rem;
  }

  .auth-content {
    border-radius: 0;
    margin-top: 0;
  }

  .auth-form-section {
    padding: 2rem 1.5rem;
    min-height: 100vh;
  }

  .auth-illustration {
    display: none;
  }

  .auth-logo h1 {
    font-size: 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .auth-form-section {
    padding: 1.5rem 1rem;
  }

  .auth-logo h1 {
    font-size: 1.3rem;
  }

  .auth-header h2 {
    font-size: 1.2rem;
  }
}
</style>
