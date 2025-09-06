<template>
  <div class="login-page">
    <Navbar />

    <main class="main-content">
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">Connexion</h1>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="form-input"
                :class="{ error: authStore.error }"
                placeholder="votre@email.com"
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
                placeholder="Votre mot de passe"
              />
            </div>

            <div v-if="authStore.error" class="error-message">
              {{ authStore.error.message }}
            </div>

            <button type="submit" class="login-btn" :disabled="authStore.loading">
              <span v-if="authStore.loading">Connexion...</span>
              <span v-else>Se connecter</span>
            </button>
          </form>

          <div class="login-footer">
            <p>Pas encore de compte ?</p>
            <router-link to="/register" class="register-link"> Créer un compte </router-link>
          </div>
        </div>
      </div>
    </main>

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
}

.main-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

.login-title {
  text-align: center;
  color: #2b499b;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.login-form {
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
  color: #2b499b;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e0e7ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2b499b;
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #fed7d7;
  border-radius: 6px;
}

.login-btn {
  background: linear-gradient(135deg, #2b499b 0%, #1e3a8a 100%);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(43, 73, 155, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ed;
}

.login-footer p {
  color: #666;
  margin-bottom: 0.5rem;
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

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
