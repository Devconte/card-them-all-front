<template>
  <nav class="app-navbar">
    <!-- Section gauche : Logo -->
    <div class="navbar-left">
      <router-link to="/" class="logo-link">
        <img src="/logocardlong.png" alt="Card Them All" class="logo" />
      </router-link>
    </div>

    <!-- Section droite : Séries + Collection + Auth -->
    <div class="navbar-right">
      <router-link to="/sets" class="navbar-item">Séries</router-link>
      <router-link to="/collection" class="navbar-item">Collection</router-link>

      <!-- Si connecté -->
      <div v-if="authStore.isAuthenticated" class="user-menu">
        <span class="user-name">{{ authStore.user?.username }}</span>
        <router-link to="/profile" class="profile-link">Profil</router-link>
        <button @click="authStore.logout" class="logout-btn">Déconnexion</button>
      </div>

      <!-- Si pas connecté -->
      <div v-else class="auth-buttons">
        <router-link to="/login" class="profile-icon-link">
          <img src="/Icon profil.png" alt="Se connecter" class="profile-icon" />
        </router-link>
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
  padding: 0 80px;
  height: 127px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-left {
  flex: 1;
  justify-content: flex-start;
}

.navbar-center {
  flex: 0;
  justify-content: center;
}

.navbar-right {
  flex: 1;
  justify-content: flex-end;
}

.logo-link {
  display: block;
  text-decoration: none;
}

.logo {
  width: 212px;
  height: 93px;
  transition: transform 0.3s ease;
}

.logo-link:hover .logo {
  transform: scale(1.05);
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
  background: transparent;
  color: #2c5aa0;
  border-radius: 0;
  position: relative;
}

.navbar-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 20%;
  width: 60%;
  height: 3px;
  background: #2c5aa0;
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

.profile-link {
  color: #2b499b;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 2px solid #2b499b;
}

.profile-link:hover {
  background: #2b499b;
  color: white;
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

/* Profile icon */
.profile-icon-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.profile-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.profile-icon-link:hover .profile-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(43, 73, 155, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .app-navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .navbar-left,
  .navbar-center,
  .navbar-right {
    gap: 0.5rem;
  }

  .navbar-center {
    order: -1; /* Logo en premier sur mobile */
  }
}
</style>
