import axios from 'axios';

// Configuration de base pour communiquer avec Flask
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gestion du token d'authentification
let authToken = localStorage.getItem('authToken');

// Intercepteur pour ajouter automatiquement le token
API.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      setAuthToken(null);
      window.location.reload(); // Rediriger vers la page de connexion
    }
    return Promise.reject(error);
  }
);

// Fonction pour définir le token
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
    API.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete API.defaults.headers.Authorization;
  }
};

// Initialiser le token au chargement
if (authToken) {
  setAuthToken(authToken);
}

// ==================== ROUTES PUBLIQUES ====================

// Fonction pour tester la connexion
export const testConnection = async () => {
  try {
    const response = await API.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Fonction de connexion
export const login = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Fonction d'inscription
export const register = async (email, password, name) => {
  try {
    const response = await API.post('/register', { email, password, name });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur d\'inscription');
  }
};

// Fonction de déconnexion
export const logout = () => {
  setAuthToken(null);
};

// ==================== ROUTES AUTHENTIFIÉES ====================

// Fonction pour analyser un texte
export const analyzeText = async (text) => {
  try {
    const response = await API.post('/analyze', { text });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'analyse');
  }
};

// Fonction pour récupérer les commentaires avec filtres
export const getComments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Ajouter les filtres comme paramètres de requête
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await API.get(`/comments?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des commentaires');
  }
};

// Fonction pour récupérer les statistiques
export const getStatistics = async (period = '30') => {
  try {
    const response = await API.get(`/statistics?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des statistiques');
  }
};

// Fonction pour supprimer un commentaire
export const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la suppression');
  }
};

// Fonction pour analyser plusieurs textes (si vous l'implémentez plus tard)
export const analyzeBatch = async (texts) => {
  try {
    const response = await API.post('/analyze-batch', { texts });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'analyse en lot');
  }
};

// ==================== FONCTIONS UTILITAIRES ====================

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!authToken;
};

// Récupérer le token actuel
export const getAuthToken = () => {
  return authToken;
};

// Fonction pour exporter des données
export const exportData = async (type = 'comments', filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('format', 'csv');
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await API.get(`/export/${type}?${params.toString()}`, {
      responseType: 'blob' // Pour télécharger le fichier
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true, message: 'Export réussi' };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'export');
  }
};

export default API;