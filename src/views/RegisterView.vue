<template>
  <div class="register-page">
    <!-- Bouton retour accueil -->
    <div class="back-button">
      <router-link to="/" class="back-link">
        <span class="back-arrow">←</span>
      </router-link>
    </div>

    <!-- Contenu principal -->
    <div class="auth-container">
      <div class="auth-content">
        <!-- Formulaire -->
        <div class="auth-form-section">
          <div class="form-wrapper">
            <!-- Logo centré -->
            <div class="logo-container">
              <img src="/logocardlong.png" alt="Card Them All" class="logo-image" />
            </div>

            <!-- Titre -->
            <h1 class="page-title">CRÉER VOTRE COMPTE</h1>

            <!-- Formulaire -->
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

            <!-- Lien connexion -->
            <div class="login-link-container">
              <p class="login-prompt">
                Vous avez déjà un compte ?
                <router-link to="/login" class="login-link">Se connecter</router-link>
              </p>
            </div>
          </div>
        </div>

        <!-- Illustration (desktop only) -->
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

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une minuscule';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une majuscule';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)';
  }
  return null;
};

const handleRegister = async () => {
  authStore.clearError();

  // Validation du mot de passe
  const passwordError = validatePassword(password.value);
  if (passwordError) {
    authStore.error = { message: passwordError };
    return;
  }

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
  top: 1rem;
  left: 1rem;
  z-index: 10;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #2b499b;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #1e3a8a;
  transform: translateY(-2px);
}

.back-arrow {
  font-size: 20px;
  font-weight: bold;
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
}

.logo-container {
  margin-bottom: 3rem;
  text-align: center;
}

.logo-image {
  width: 250px;
  height: auto;
}

.page-title {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 3rem 0;
  text-align: center;
  text-transform: uppercase;
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 17px;
  font-family: 'Montserrat Alternates', sans-serif;
}

.form-input {
  padding: 1rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 400;
  background-color: #ffffff;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #2b499b;
  box-shadow: 0 0 0 3px rgba(43, 73, 155, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
  background-color: #fef5f5;
}

.info-message {
  color: #2b499b;
  font-size: 15px;
  text-align: center;
  padding: 0.75rem;
  background: #f0f4ff;
  border: 1px solid #d1e7ff;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-family: 'Montserrat Alternates', sans-serif;
}

.error-message {
  color: #e53e3e;
  font-size: 15px;
  text-align: center;
  padding: 0.75rem;
  background: #fef5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-family: 'Montserrat Alternates', sans-serif;
}

.primary-btn {
  background: #2b499b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
  width: 100%;
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

.login-link-container {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.login-prompt {
  color: #666;
  font-size: 15px;
  margin: 0;
  font-family: 'Montserrat Alternates', sans-serif;
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
}

.illustration-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-content {
    grid-template-columns: 1fr;
  }

  .auth-illustration {
    display: none;
  }

  .auth-form-section {
    padding: 3rem 2rem;
  }
}

@media (max-width: 768px) {
  .register-page {
    background-color: #ffffff;
  }

  .auth-form-section {
    padding: 2rem 1.5rem;
  }

  .form-wrapper {
    max-width: 400px;
  }

  .logo-image {
    width: 200px;
  }

  .page-title {
    font-size: 24px;
  }

  .login-link-container {
    border-top: none;
    padding-top: 0;
  }
}

@media (max-width: 480px) {
  .auth-form-section {
    padding: 1.5rem 1rem;
  }

  .form-wrapper {
    max-width: 320px;
  }

  .logo-image {
    width: 160px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 2rem;
  }

  .form-input {
    padding: 0.75rem 1rem;
    font-size: 16px;
  }

  .primary-btn {
    padding: 0.75rem 1.5rem;
    font-size: 16px;
  }
}
</style>
