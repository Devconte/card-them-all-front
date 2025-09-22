<template>
  <nav class="app-navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo-link">
        <img src="/logocardlong.png" alt="Card Them All" class="logo" />
      </router-link>
    </div>

    <div class="navbar-menu">
      <router-link to="/sets" class="navbar-item">Sets</router-link>
      <router-link to="/collection" class="navbar-item">Collection</router-link>
    </div>

    <div class="navbar-actions">
      <!-- Si connecté -->
      <div v-if="authStore.isAuthenticated" class="user-menu">
        <span class="user-name">Bonjour {{ authStore.user?.name }}</span>
        <button @click="authStore.logout" class="logout-btn">Déconnexion</button>
      </div>

      <!-- Si pas connecté -->
      <div v-else class="auth-buttons">
        <router-link to="/login" class="login-btn">Connexion</router-link>
        <router-link to="/register" class="register-btn">Inscription</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-link {
  display: block;
  text-decoration: none;
}

.logo {
  height: 100px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-link:hover .logo {
  transform: scale(1.05);
}

.navbar-brand h2 {
  margin: 0;
  color: #2c5aa0;
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.navbar-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 17px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.navbar-item:hover {
  background: #f0f0f0;
  color: #2c5aa0;
}

.navbar-item.router-link-active {
  background: #2c5aa0;
  color: white;
}

.navbar-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.btn-outline {
  color: #2c5aa0;
  border-color: #2c5aa0;
}

.btn-outline:hover {
  background: #2c5aa0;
  color: white;
}

.btn-primary {
  background: #2c5aa0;
  color: white;
}

.btn-primary:hover {
  background: #1e3d6f;
}

/* User menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #2b499b;
  font-weight: 600;
  font-size: 17px;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 17px;
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
}

/* Auth buttons */
.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.login-btn {
  background: linear-gradient(135deg, #2b499b 0%, #1e3a8a 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 17px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(43, 73, 155, 0.4);
}

.register-btn {
  background: linear-gradient(135deg, #facf19 0%, #f0b300 100%);
  color: #2b499b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 17px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(250, 207, 25, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .app-navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .navbar-menu {
    gap: 1rem;
  }

  .navbar-actions {
    gap: 0.5rem;
  }
}
</style>
