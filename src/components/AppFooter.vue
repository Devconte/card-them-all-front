<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Left Section - Logo and Navigation -->
      <div class="footer-left">
        <div class="footer-logo">
          <img
            src="/logocardlong.png"
            alt="Card Them All"
            class="footer-logo-img footer-logo-desktop"
          />
          <img src="/logocard.png" alt="Card Them All" class="footer-logo-img footer-logo-mobile" />
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

        <!-- Layout mobile pour le bas -->
        <div class="footer-bottom-mobile">
          <p class="footer-copyright-mobile">@2025 CardThemAll</p>
          <div class="footer-social-mobile">
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
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
}

/* Desktop: garde les coins arrondis */
@media (min-width: 769px) {
  .app-footer {
    border-radius: 20px 20px 0 0;
  }

  /* Cacher les éléments mobile sur desktop */
  .footer-bottom-mobile {
    display: none;
  }
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
  transition: transform 0.3s ease;
}

.footer-logo-desktop {
  height: 80px;
  width: auto;
}

.footer-logo-mobile {
  height: 80px;
  width: 80px;
  display: none;
  object-fit: contain;
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
  .app-footer {
    padding: 2rem 0;
    border-radius: 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
    min-height: auto;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-left {
    align-items: center;
    gap: 1.5rem;
  }

  .footer-logo-desktop {
    display: none;
  }

  .footer-logo-mobile {
    display: block;
    height: 86px;
    width: 74px;
  }

  .footer-nav {
    justify-content: center;
    gap: 2rem;
  }

  .footer-center {
    position: static;
    transform: none;
    order: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .footer-right {
    align-items: center;
    justify-self: center;
    order: 2;
    gap: 1.5rem;
  }

  /* Layout mobile spécifique pour le bas */
  .footer-bottom-mobile {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    margin-top: 1rem;
  }

  .footer-copyright-mobile {
    color: #e8e8e8;
    font-size: 12px;
    margin: 0;
    font-family: 'Montserrat Alternates', sans-serif;
  }

  .footer-social-mobile {
    display: flex;
    gap: 0.8rem;
  }

  /* Cacher les éléments desktop sur mobile */
  .footer-copyright {
    display: none;
  }

  .footer-right {
    display: none;
  }

  .footer-social-title {
    font-size: 16px;
    margin-bottom: 0.5rem;
  }

  .footer-social {
    justify-content: center;
    gap: 1rem;
  }

  .social-link {
    width: 45px;
    height: 45px;
  }

  .footer-copyright {
    font-size: 14px;
    margin: 0 0 0.5rem 0;
  }

  .footer-disclaimer {
    font-size: 12px;
    line-height: 1.4;
    padding: 0;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 1.5rem 0;
  }

  .footer-content {
    padding: 0 1rem;
    max-width: 320px;
  }

  .footer-logo-mobile {
    height: 60px;
    width: 60px;
  }

  .footer-nav {
    flex-direction: row;
    gap: 1.5rem;
  }

  .footer-social {
    gap: 0.8rem;
  }

  .social-link {
    width: 40px;
    height: 40px;
  }

  .footer-disclaimer {
    font-size: 11px;
    line-height: 1.3;
  }
}
</style>
