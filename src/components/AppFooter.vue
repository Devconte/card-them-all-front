<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Left Section - Logo and Navigation -->
      <div class="footer-left">
        <div class="footer-logo">
          <img src="/logocardlong.png" alt="Card Them All" class="footer-logo-img" />
        </div>
        <div class="footer-nav">
          <router-link to="/sets" class="footer-link">Sets</router-link>
          <router-link to="/collection" class="footer-link">Collection</router-link>
        </div>
      </div>

      <!-- Center Section - Copyright and Legal -->
      <div class="footer-center">
        <p class="footer-copyright">@2025 CardThemAll</p>
        <p class="footer-disclaimer">
          Les informations présentées sur ce site concernant le Jeu de Cartes à Collectionner
          Pokémon, y compris les images et les textes, sont la propriété intellectuelle de The
          Pokémon Company, Nintendo, Game Freak, Creatures et/ou Wizards of the Coast. Card them all
          n'est ni produit, ni approuvé, ni soutenu, ni affilié à aucune de ces sociétés.
        </p>
      </div>

      <!-- Right Section - Social Media -->
      <div class="footer-right">
        <h4 class="footer-social-title">Rejoins nous sur nos réseaux</h4>
        <div class="footer-social">
          <a href="#" class="social-link facebook">
            <span class="social-icon">f</span>
          </a>
          <a href="#" class="social-link instagram">
            <span class="social-icon">📷</span>
          </a>
          <a href="#" class="social-link twitter">
            <span class="social-icon">X</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Pas besoin de script pour l'instant
</script>

<style scoped>
.app-footer {
  background: #2b499b;
  padding: 2rem 0 3.5rem 0;
  margin-top: 4rem;
  border-radius: 20px 20px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: start;
  position: relative;
  min-height: 180px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-logo-img {
  height: 80px;
  width: auto;
}

.footer-brand {
  color: #facf19;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Montserrat Alternates', sans-serif;
}

.footer-nav {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: #e8e8e8;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.3s ease;
  font-family: 'Montserrat Alternates', sans-serif;
}

.footer-link:hover {
  color: #facf19;
}

.footer-center {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.footer-copyright {
  color: #e8e8e8;
  font-size: 15px;
  margin: 0 0 1rem 0;
  text-align: center;
  font-family: 'Montserrat Alternates', sans-serif;
  letter-spacing: 0.5px;
  line-height: 1.4;
  word-spacing: 0.3em;
}

.footer-disclaimer {
  color: #c0c0c0;
  font-size: 14px;
  margin: 0;
  text-align: center;
  font-family: 'Montserrat Alternates', sans-serif;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  justify-self: end;
}

.footer-social-title {
  color: #e8e8e8;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  font-family: 'Montserrat Alternates', sans-serif;
}

.footer-social {
  display: flex;
  gap: 0.8rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
}

.social-link.facebook {
  background: #1877f2;
}

.social-link.instagram {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-link.twitter {
  background: #000000;
}

.social-icon {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    min-height: 200px;
  }

  .footer-center {
    position: static;
    transform: none;
    margin-top: 2rem;
  }

  .footer-right {
    align-items: center;
    justify-self: center;
  }

  .footer-nav {
    justify-content: center;
  }

  .footer-social {
    justify-content: center;
  }

  .footer-disclaimer {
    font-size: 13px;
    line-height: 1.5;
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 1.5rem 0;
  }

  .footer-content {
    padding: 0 1rem;
  }

  .footer-nav {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-disclaimer {
    font-size: 12px;
    line-height: 1.4;
    padding: 0 0.25rem;
  }
}
</style>
