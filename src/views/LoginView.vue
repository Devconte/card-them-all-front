<template>
  <div class="login-page">
    <Navbar />

    <div class="auth-container">
      <div class="auth-content">
        <!-- Formulaire de connexion -->
        <div class="auth-form-section">
          <div class="auth-form-card">
            <div class="auth-header">
              <div class="auth-logo">
                <img src="/logocard.png" alt="Card Them All" class="logo-image" />
                <h1>CARD THEM ALL</h1>
              </div>
              <h2>Connexion</h2>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label for="email">Identifiant</label>
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

              <div class="forgot-password">
                <router-link to="/forgot-password" class="forgot-link">
                  Mot de passe oublié ?
                </router-link>
              </div>

              <div v-if="authStore.error" class="error-message">
                {{ authStore.error.message }}
              </div>

              <button type="submit" class="primary-btn" :disabled="authStore.loading">
                <span v-if="authStore.loading">Connexion...</span>
                <span v-else>Se connecter</span>
              </button>
            </form>

            <div class="auth-footer">
              <p class="register-prompt">
                Vous n'avez pas encore de compte ?
                <router-link to="/register" class="register-link">S'inscrire</router-link>
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

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  authStore.clearError()

  const success = await authStore.login(email.value, password.value)

  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.auth-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 140px);
}

.auth-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

.auth-form-section {
  display: flex;
  justify-content: center;
}

.auth-form-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logo-image {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.auth-logo h1 {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2b499b;
  margin: 0;
  letter-spacing: 1px;
}

.auth-header h2 {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
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
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
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

.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}

.forgot-link {
  color: #2b499b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #1e3a8a;
  text-decoration: underline;
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
  font-size: 1rem;
  font-weight: 600;
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

.register-prompt {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.register-link {
  color: #2b499b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #1e3a8a;
  text-decoration: underline;
}

.auth-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  border: 3px solid #87ceeb;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 500px;
  }

  .auth-illustration {
    order: -1;
  }

  .illustration-image {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-form-card {
    padding: 2rem;
  }

  .auth-logo h1 {
    font-size: 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .auth-form-card {
    padding: 1.5rem;
  }

  .auth-logo h1 {
    font-size: 1.3rem;
  }

  .auth-header h2 {
    font-size: 1.2rem;
  }

  .illustration-image {
    max-width: 300px;
  }
}
</style>
