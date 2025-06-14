import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '../../stores/useAppStore';

// Configuration de base de l'API
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.moodcycle.app';

// Instance Axios principale
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  async (config) => {
    // Vérifier la connexion réseau
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      // Si pas de réseau, stocker la requête pour plus tard
      await storeOfflineRequest(config);
      throw new Error('OFFLINE_REQUEST_QUEUED');
    }
    
    // Ajouter le token d'authentification si disponible
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter des headers personnalisés
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-Platform'] = 'mobile';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    // Mettre à jour le statut online
    useAppStore.getState().setOnlineStatus(true);
    return response;
  },
  async (error) => {
    const { response, config } = error;
    
    // Gestion des erreurs réseau
    if (!response) {
      useAppStore.getState().setOnlineStatus(false);
      
      // Stocker pour retry plus tard
      if (config && !config._retry) {
        await storeOfflineRequest(config);
      }
      
      return Promise.reject(new Error('NETWORK_ERROR'));
    }
    
    // Gestion des erreurs HTTP
    switch (response.status) {
      case 401:
        // Token expiré, rediriger vers login
        await handleAuthExpired();
        break;
      case 403:
        // Accès refusé
        console.warn('Access denied:', response.data);
        break;
      case 429:
        // Rate limiting
        console.warn('Rate limit exceeded');
        break;
      case 500:
        // Erreur serveur
        console.error('Server error:', response.data);
        break;
    }
    
    return Promise.reject(error);
  }
);

// Fonctions utilitaires
async function getAuthToken() {
  try {
    // TODO: Implémenter récupération token depuis AsyncStorage
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

async function storeOfflineRequest(config) {
  try {
    // TODO: Implémenter queue offline avec AsyncStorage
    console.log('Storing offline request:', config.url);
  } catch (error) {
    console.error('Error storing offline request:', error);
  }
}

async function handleAuthExpired() {
  try {
    // TODO: Implémenter gestion expiration auth
    console.log('Auth token expired');
  } catch (error) {
    console.error('Error handling auth expiration:', error);
  }
}

// Wrapper pour les requêtes avec gestion d'erreur simplifiée
export const api = {
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
  
  post: async (url, data, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
  
  put: async (url, data, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
  
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};

export default apiClient; 