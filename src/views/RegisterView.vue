<template>
  <div class="register-page">
    <Navbar />

    <main class="main-content">
      <div class="register-container">
        <div class="register-card">
          <h1 class="register-title">Inscription</h1>

          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="form-input"
                :class="{ error: authStore.error }"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

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

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                required
                class="form-input"
                :class="{ error: authStore.error || passwordMismatch }"
                placeholder="Confirmer votre mot de passe"
              />
            </div>

            <div v-if="passwordMismatch" class="error-message">
              Les mots de passe ne correspondent pas
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
              class="register-btn"
              :disabled="authStore.loading || !isFormValid"
            >
              <span v-if="authStore.loading">Inscription...</span>
              <span v-else>Créer un compte</span>
            </button>
          </form>

          <div class="register-footer">
            <p>Déjà un compte ?</p>
            <router-link to="/login" class="login-link"> Se connecter </router-link>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

const isFormValid = computed(() => {
  return (
    username.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    !passwordMismatch.value
  )
})

const handleRegister = async () => {
  authStore.clearError()

  // Validation côté client
  if (passwordMismatch.value) {
    return
  }

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    return
  }

  const success = await authStore.register(
    email.value,
    password.value,
    username.value,
    confirmPassword.value,
  )

  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.register-page {
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

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

.register-title {
  text-align: center;
  color: #2b499b;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.register-form {
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

.info-message {
  color: #2b499b;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #e6f3ff;
  border-radius: 6px;
}

.register-btn {
  background: linear-gradient(135deg, #facf19 0%, #f0b300 100%);
  color: #2b499b;
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(250, 207, 25, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ed;
}

.register-footer p {
  color: #666;
  margin-bottom: 0.5rem;
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

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>
