import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios, { type AxiosResponse, type AxiosError as AxiosErrorType } from 'axios';

// Configuration d'axios
axios.defaults.baseURL = 'http://localhost:3000';

// Extension du type pour ajouter _retry
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthError {
  message: string;
  status?: number;
  field?: string;
}

interface AxiosErrorResponse {
  message?: string;
  field?: string;
}

interface AxiosError {
  response?: {
    data?: AxiosErrorResponse;
    status?: number;
  };
}

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const isLoggedIn = ref(false);
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(sessionStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(sessionStorage.getItem('refresh_token'));
  const loading = ref(false);
  const error = ref<AuthError | null>(null);

  // Computed
  const isAuthenticated = computed(() => isLoggedIn.value && !!accessToken.value);

  // Actions
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      return false;
    }

    try {
      const response = await axios.post('/auth/refresh', {
        refresh_token: refreshToken.value,
      });

      const { access_token } = response.data;
      accessToken.value = access_token;
      sessionStorage.setItem('access_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return true;
    } catch {
      // Refresh token invalide, déconnecter l'utilisateur
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      // Les tokens sont dans response.data.data, l'utilisateur dans response.data.user
      const { access_token, refresh_token } = response.data.data || {};
      const userData = response.data.user;

      // Mettre à jour l'état
      isLoggedIn.value = true;
      user.value = userData;
      accessToken.value = access_token;
      refreshToken.value = refresh_token;

      // Sauvegarder dans sessionStorage
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('user', JSON.stringify(userData));

      // Configurer axios pour les requêtes suivantes
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      error.value = {
        message: axiosError?.response?.data?.message || 'Erreur de connexion',
        status: axiosError?.response?.status,
        field: axiosError?.response?.data?.field,
      };
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post('/auth/register', {
        email,
        password,
        confirmPassword,
        username,
      });

      const { user: userData, access_token, refresh_token } = response.data;

      // Mettre à jour l'état
      isLoggedIn.value = true;
      user.value = userData;
      accessToken.value = access_token;
      refreshToken.value = refresh_token;

      // Sauvegarder dans sessionStorage
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('user', JSON.stringify(userData));

      // Configurer axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      error.value = {
        message: axiosError?.response?.data?.message || "Erreur d'inscription",
        status: axiosError?.response?.status,
        field: axiosError?.response?.data?.field,
      };
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    isLoggedIn.value = false;
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    // Nettoyer sessionStorage
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');

    // Supprimer le header Authorization
    delete axios.defaults.headers.common['Authorization'];
  };

  const initializeAuth = () => {
    const savedAccessToken = sessionStorage.getItem('access_token');
    const savedRefreshToken = sessionStorage.getItem('refresh_token');
    const savedUser = sessionStorage.getItem('user');

    if (savedAccessToken && savedRefreshToken && savedUser) {
      try {
        user.value = JSON.parse(savedUser);
        accessToken.value = savedAccessToken;
        refreshToken.value = savedRefreshToken;
        isLoggedIn.value = true;

        // Configurer axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedAccessToken}`;
      } catch (error) {
        console.error('❌ Error parsing saved auth data:', error);
        // Si erreur de parsing, nettoyer
        logout();
      }
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const getFieldError = (fieldName: string): string | null => {
    if (error.value?.field === fieldName) {
      return error.value.message;
    }
    return null;
  };

  // Interceptor pour refresh automatique
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    failedQueue = [];
  };

  // Interceptor de réponse pour gérer les 401
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosErrorType) => {
      const originalRequest = error.config;

      // Enlever l'intercepteur pour les routes publiques
      if (
        originalRequest?.url?.includes('/cards/sets/list') ||
        originalRequest?.url?.includes('/cards/sets/') ||
        originalRequest?.url?.includes('/api/cards/sets/') ||
        originalRequest?.url?.includes('/booster-pack/sets/')
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest?._retry) {
        if (isRefreshing) {
          // Si on est déjà en train de refresh, on met en queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axios(originalRequest!);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest!._retry = true;
        isRefreshing = true;

        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            processQueue(null, accessToken.value);
            return axios(originalRequest!);
          } else {
            processQueue(error, null);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return {
    // État
    isLoggedIn,
    user,
    accessToken,
    refreshToken,
    loading,
    error,

    // Computed
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    initializeAuth,
    clearError,
    getFieldError,
  };
});
