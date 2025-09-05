<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <img src="/logocardlong.png" alt="Card Them All" class="logo" />
    </div>

    <div class="navbar-menu">
      <router-link to="/" class="navbar-item">Accueil</router-link>
      <router-link to="/series" class="navbar-item">Séries</router-link>
      <router-link to="/pokedex" class="navbar-item">Pokédex</router-link>
      <router-link to="/collection" class="navbar-item">Collection</router-link>
    </div>

    <div class="navbar-actions">
      <router-link to="/login" class="btn btn-outline">Connexion</router-link>
      <router-link to="/register" class="btn btn-primary">Inscription</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Pas besoin de script pour l'instant
</script>

<style scoped>
.navbar {
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

.logo {
  height: 100px;
  width: auto;
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
  font-size: 1rem;
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

/* Responsive */
@media (max-width: 768px) {
  .navbar {
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
