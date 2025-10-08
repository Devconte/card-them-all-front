<template>
  <nav class="app-navbar">
    <!-- Logo à gauche -->
    <div class="navbar-left">
      <router-link to="/" class="logo-link">
        <img src="/logocardlong.png" alt="Card Them All" class="logo logo-desktop" />
        <img src="/logocard.png" alt="Card Them All" class="logo logo-mobile" />
      </router-link>
    </div>

    <!-- Menu desktop (caché sur mobile) -->
    <div class="navbar-menu desktop-menu">
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

    <!-- Burger menu (visible sur mobile) -->
    <button
      class="burger-menu"
      @click="toggleMenu"
      :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
      :aria-expanded="isMenuOpen"
    >
      <span class="burger-line" :class="{ open: isMenuOpen }"></span>
      <span class="burger-line" :class="{ open: isMenuOpen }"></span>
      <span class="burger-line" :class="{ open: isMenuOpen }"></span>
    </button>

    <!-- Menu mobile -->
    <div class="mobile-menu" :class="{ open: isMenuOpen }">
      <div class="mobile-menu-content">
        <router-link to="/sets" class="mobile-item" @click="closeMenu">Séries</router-link>
        <router-link to="/collection" class="mobile-item" @click="closeMenu"
          >Collection</router-link
        >

        <!-- Si connecté -->
        <template v-if="authStore.isAuthenticated">
          <div class="mobile-user-info">
            <span class="mobile-username">{{ authStore.user?.username }}</span>
          </div>
          <router-link to="/profile" class="mobile-item" @click="closeMenu">Profil</router-link>
          <button @click="handleLogout" class="mobile-logout">Déconnexion</button>
        </template>

        <!-- Si pas connecté -->
        <template v-else>
          <router-link to="/login" class="mobile-item primary" @click="closeMenu"
            >Se connecter</router-link
          >
          <router-link to="/register" class="mobile-item secondary" @click="closeMenu"
            >S'inscrire</router-link
          >
        </template>
      </div>
    </div>

    <!-- Overlay pour fermer le menu -->
    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeMenu();
  router.push('/');
};
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

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-link {
  display: block;
  text-decoration: none;
}

.logo {
  transition: transform 0.3s ease;
}

.logo-desktop {
  width: 212px;
  height: 93px;
}

.logo-mobile {
  width: 80px;
  height: 80px;
  display: none;
  object-fit: contain;
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

/* Burger Menu */
.burger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.desktop-menu {
  display: flex;
}

.burger-line {
  width: 100%;
  height: 3px;
  background: #2b499b;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.burger-line.open:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.burger-line.open:nth-child(2) {
  opacity: 0;
}

.burger-line.open:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 127px;
  right: -100%;
  width: 280px;
  height: calc(100vh - 127px);
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.mobile-menu.open {
  right: 0;
}

.mobile-menu-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 18px;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
}

.mobile-item:hover {
  background: #f0f4ff;
  color: #2b499b;
}

.mobile-item.router-link-active {
  background: #2b499b;
  color: white;
}

.mobile-item.primary {
  background: #2b499b;
  color: white;
  text-align: center;
  font-weight: 600;
}

.mobile-item.secondary {
  background: #facf19;
  color: #2b499b;
  text-align: center;
  font-weight: 600;
}

.mobile-user-info {
  padding: 1rem;
  background: #f0f4ff;
  border-radius: 8px;
  text-align: center;
}

.mobile-username {
  color: #2b499b;
  font-weight: 600;
  font-size: 18px;
  font-family: 'Montserrat Alternates', sans-serif;
}

.mobile-logout {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
  margin-top: 1rem;
}

.mobile-logout:hover {
  background: #c53030;
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 127px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .app-navbar {
    padding: 0 2rem;
  }

  .logo-desktop {
    display: none;
  }

  .logo-mobile {
    display: block;
    width: 74px;
    height: 86px;
  }

  .desktop-menu {
    display: none;
  }

  .burger-menu {
    display: flex;
  }
}

@media (max-width: 480px) {
  .app-navbar {
    padding: 0 1rem;
    height: 80px;
  }

  .logo-mobile {
    width: 60px;
    height: 60px;
  }

  .mobile-menu {
    top: 80px;
    height: calc(100vh - 80px);
    width: 100%;
  }

  .menu-overlay {
    top: 80px;
  }
}
</style>
