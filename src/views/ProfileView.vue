<template>
  <div class="profile-page">
    <AppNavbar />

    <main class="main-content">
      <!-- Si pas connecté : redirection -->
      <div v-if="!authStore.isAuthenticated" class="login-prompt">
        <div class="login-prompt-content">
          <h1>Accès refusé</h1>
          <p>Vous devez être connecté pour accéder à votre profil.</p>
          <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
        </div>
      </div>

      <!-- Si connecté : contenu du profil -->
      <div v-else class="profile-content">
        <!-- Header -->
        <div class="profile-header">
          <div class="title-container">
            <img src="/pokeball.png" alt="Pokéball" class="pokeball-icon" />
            <h1>Mon Profil</h1>
          </div>
        </div>

        <!-- Profile Cards -->
        <div class="profile-cards">
          <!-- User Information Card -->
          <div class="profile-card">
            <h2 class="card-title">Informations personnelles</h2>

            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="form-input"
                  :disabled="isUpdating"
                  required
                />
              </div>

              <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  v-model="profileForm.username"
                  type="text"
                  class="form-input"
                  :disabled="isUpdating"
                  required
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isUpdating || !hasProfileChanged"
                >
                  {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour' }}
                </button>
                <button
                  type="button"
                  @click="resetProfileForm"
                  class="btn btn-secondary"
                  :disabled="isUpdating"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password Card -->
          <div class="profile-card">
            <h2 class="card-title">Changer le mot de passe</h2>

            <form @submit.prevent="changePassword" class="profile-form">
              <div class="form-group">
                <label for="currentPassword">Mot de passe actuel</label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  :disabled="isChangingPassword"
                  required
                />
              </div>

              <div class="form-group">
                <label for="newPassword">Nouveau mot de passe</label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  :disabled="isChangingPassword"
                  minlength="6"
                  required
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  :disabled="isChangingPassword"
                  required
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isChangingPassword || !canChangePassword"
                >
                  {{ isChangingPassword ? 'Changement...' : 'Changer le mot de passe' }}
                </button>
                <button
                  type="button"
                  @click="resetPasswordForm"
                  class="btn btn-secondary"
                  :disabled="isChangingPassword"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>

          <!-- Account Actions Card -->
          <div class="profile-card danger-card">
            <h2 class="card-title">Actions du compte</h2>

            <div class="danger-actions">
              <div class="action-item">
                <div class="action-info">
                  <h3>Déconnexion</h3>
                  <p>Se déconnecter de votre compte</p>
                </div>
                <button @click="logout" class="btn btn-secondary">Déconnexion</button>
              </div>

              <div class="action-item">
                <div class="action-info">
                  <h3>Supprimer le compte</h3>
                  <p>Supprimer définitivement votre compte et toutes vos données</p>
                </div>
                <button @click="showDeleteModal = true" class="btn btn-danger">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Account Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <h3>Confirmer la suppression</h3>
          <p>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et
            supprimera toutes vos données.
          </p>

          <form @submit.prevent="deleteAccount" class="delete-form">
            <div class="form-group">
              <label for="deletePassword">Mot de passe pour confirmer</label>
              <input
                id="deletePassword"
                v-model="deleteForm.password"
                type="password"
                class="form-input"
                :disabled="isDeleting"
                required
              />
            </div>

            <div class="modal-actions">
              <button
                type="button"
                @click="showDeleteModal = false"
                class="btn btn-secondary"
                :disabled="isDeleting"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="btn btn-danger"
                :disabled="isDeleting || !deleteForm.password"
              >
                {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppNavbar from '@/components/AppNavbar.vue';

// Stores
const authStore = useAuthStore();
const router = useRouter();

// Reactive data
const profileForm = ref({
  email: '',
  username: '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const deleteForm = ref({
  password: '',
});

// Loading states
const isUpdating = ref(false);
const isChangingPassword = ref(false);
const isDeleting = ref(false);

// UI states
const showDeleteModal = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// Original data for comparison
const originalProfile = ref({
  email: '',
  username: '',
});

// Computed
const hasProfileChanged = computed(() => {
  return (
    profileForm.value.email !== originalProfile.value.email ||
    profileForm.value.username !== originalProfile.value.username
  );
});

const canChangePassword = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword.length >= 6
  );
});

// Methods
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

const loadUserProfile = () => {
  if (authStore.user) {
    profileForm.value = {
      email: authStore.user.email || '',
      username: authStore.user.username || '',
    };
    originalProfile.value = { ...profileForm.value };
  }
};

const resetProfileForm = () => {
  profileForm.value = { ...originalProfile.value };
};

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

const updateProfile = async () => {
  if (!authStore.user?.id) return;

  isUpdating.value = true;

  try {
    const response = await fetch(`http://localhost:3000/user/${authStore.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify({
        email: profileForm.value.email,
        username: profileForm.value.username,
      }),
    });

    if (response.ok) {
      const updatedUser = await response.json();

      // Update auth store
      authStore.user = {
        ...authStore.user,
        email: updatedUser.email,
        username: updatedUser.username,
      };

      // Update sessionStorage
      sessionStorage.setItem('user', JSON.stringify(authStore.user));

      originalProfile.value = { ...profileForm.value };
      showMessage('Profil mis à jour avec succès !');
    } else {
      const error = await response.json();
      showMessage(error.message || 'Erreur lors de la mise à jour', 'error');
    }
  } catch (error) {
    showMessage('Erreur de connexion', error as 'error');
  } finally {
    isUpdating.value = false;
  }
};

const changePassword = async () => {
  if (!authStore.user?.id) return;

  isChangingPassword.value = true;

  try {
    const response = await fetch(`http://localhost:3000/user/${authStore.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify({
        password: passwordForm.value.newPassword,
      }),
    });

    if (response.ok) {
      resetPasswordForm();
      showMessage('Mot de passe changé avec succès !');
    } else {
      const error = await response.json();
      showMessage(error.message || 'Erreur lors du changement de mot de passe', 'error');
    }
  } catch (error) {
    showMessage('Erreur de connexion', error as 'error');
  } finally {
    isChangingPassword.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push('/');
};

const deleteAccount = async () => {
  if (!authStore.user?.id || !deleteForm.value.password) return;

  isDeleting.value = true;

  try {
    // First verify password by trying to login
    const loginResponse = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authStore.user.email,
        password: deleteForm.value.password,
      }),
    });

    if (!loginResponse.ok) {
      showMessage('Mot de passe incorrect', 'error');
      return;
    }

    // If password is correct, proceed with deletion
    const deleteResponse = await fetch(`http://localhost:3000/user/${authStore.user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (deleteResponse.ok) {
      showMessage('Compte supprimé avec succès', 'success');
      // Logout and redirect
      setTimeout(() => {
        authStore.logout();
        router.push('/');
      }, 2000);
    } else {
      const error = await deleteResponse.json();
      showMessage(error.message || 'Erreur lors de la suppression', 'error');
    }
  } catch (error) {
    showMessage('Erreur de connexion', error as 'error');
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
    deleteForm.value.password = '';
  }
};

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  loadUserProfile();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Montserrat Alternates', sans-serif;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.profile-header {
  margin-bottom: 2rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pokeball-icon {
  width: 40px;
  height: 40px;
}

.title-container h1 {
  font-size: 2.5rem;
  color: #2b499b;
  margin: 0;
}

/* Login Prompt */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.login-prompt-content {
  text-align: center;
  max-width: 400px;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-prompt-content h1 {
  color: #2b499b;
  margin-bottom: 1rem;
}

/* Profile Cards */
.profile-cards {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.profile-card.danger-card {
  grid-column: 1 / -1;
  border-color: #dc3545;
}

.card-title {
  font-size: 1.5rem;
  color: #2b499b;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.danger-card .card-title {
  color: #dc3545;
}

/* Forms */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2b499b;
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #2b499b;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1e3d6f;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Danger Actions */
.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
}

.action-info h3 {
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.action-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Messages */
.message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  z-index: 1001;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .profile-cards {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
