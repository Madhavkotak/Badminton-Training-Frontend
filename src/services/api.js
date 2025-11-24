/**
 * API Service for Badminton Training App
 * Handles all HTTP requests to the backend server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Set current user in localStorage
const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Remove current user from localStorage
const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

// Generic request handler with error handling
const apiRequest = async (url, method = 'GET', data = null, requiresAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ========== AUTH API ==========
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const result = await apiRequest('/auth/register', 'POST', userData, false);
    if (result.success && result.data) {
      const token = result.data.token;
      if (token) {
        setAuthToken(token);
        setCurrentUser(result.data);
      }
    }
    return result;
  },

  // Login user
  login: async (credentials) => {
    const result = await apiRequest('/auth/login', 'POST', credentials, false);
    if (result.success && result.data) {
      // Extract token from the response - backend returns it inside data object
      const token = result.data.token;
      if (token) {
        setAuthToken(token);
        setCurrentUser(result.data);
      }
    }
    return result;
  },

  // Get current user
  getMe: async () => {
    const result = await apiRequest('/auth/me', 'GET');
    if (result.data) {
      setCurrentUser(result.data);
    }
    return result;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const result = await apiRequest('/auth/updateprofile', 'PUT', profileData);
    if (result.data) {
      setCurrentUser(result.data);
    }
    return result;
  },

  // Logout user
  logout: () => {
    removeAuthToken();
    removeCurrentUser();
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user from storage
  getCurrentUser: getCurrentUser,
};

// ========== DRILLS API ==========
export const drillsAPI = {
  // Get all drills with optional filters
  getDrills: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.day) queryParams.append('day', filters.day);
    if (filters.search) queryParams.append('search', filters.search);
    
    const url = `/drills${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single drill
  getDrill: async (id) => {
    console.log('Fetching drill with id:', id);
    return await apiRequest(`/drills/${id}`, 'GET', null, false);
  },

  // Get drill types
  getDrillTypes: async () => {
    console.log('Fetching drill types');
    return await apiRequest('/drills/types', 'GET', null, false);
  },

  // Create new drill (admin only)
  createDrill: async (drillData) => {
    return await apiRequest('/drills', 'POST', drillData);
  },

  // Update drill (admin only)
  updateDrill: async (id, drillData) => {
    return await apiRequest(`/drills/${id}`, 'PUT', drillData);
  },

  // Delete drill (admin only)
  deleteDrill: async (id) => {
    return await apiRequest(`/drills/${id}`, 'DELETE');
  },
};

// ========== EXERCISES API ==========
export const exercisesAPI = {
  // Get all exercises with optional filters
  getExercises: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.search) queryParams.append('search', filters.search);
    
    const url = `/exercises${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single exercise
  getExercise: async (id) => {
    return await apiRequest(`/exercises/${id}`, 'GET', null, false);
  },

  // Get exercise categories
  getCategories: async () => {
    return await apiRequest('/exercises/categories', 'GET', null, false);
  },

  // Create new exercise (admin only)
  createExercise: async (exerciseData) => {
    return await apiRequest('/exercises', 'POST', exerciseData);
  },

  // Update exercise (admin only)
  updateExercise: async (id, exerciseData) => {
    return await apiRequest(`/exercises/${id}`, 'PUT', exerciseData);
  },

  // Delete exercise (admin only)
  deleteExercise: async (id) => {
    return await apiRequest(`/exercises/${id}`, 'DELETE');
  },
};

// ========== SESSIONS API ==========
export const sessionsAPI = {
  // Get all sessions with optional filters
  getSessions: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.sessionType) queryParams.append('sessionType', filters.sessionType);
    if (filters.day) queryParams.append('day', filters.day);
    if (filters.userName) queryParams.append('userName', filters.userName);
    
    const url = `/sessions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single session
  getSession: async (id) => {
    return await apiRequest(`/sessions/${id}`, 'GET', null, false);
  },

  // Get calendar sessions (grouped by date)
  getCalendarSessions: async (month, year) => {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    if (year) queryParams.append('year', year);
    
    const url = `/sessions/calendar${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Create new session
  createSession: async (sessionData) => {
    console.log(sessionData)
    return await apiRequest('/sessions', 'POST', sessionData, false);
  },

  // Update session
  updateSession: async (id, sessionData) => {
    return await apiRequest(`/sessions/${id}`, 'PUT', sessionData, false);
  },

  // Delete session
  deleteSession: async (id) => {
    return await apiRequest(`/sessions/${id}`, 'DELETE', null, false);
  },
};

// ========== MATCHES API ==========
export const matchesAPI = {
  // Get all matches with optional filters
  getMatches: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.matchType) queryParams.append('matchType', filters.matchType);
    if (filters.result) queryParams.append('result', filters.result);
    if (filters.userName) queryParams.append('userName', filters.userName);
    
    const url = `/matches${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single match
  getMatch: async (id) => {
    return await apiRequest(`/matches/${id}`, 'GET', null, false);
  },

  // Create new match
  createMatch: async (matchData) => {
    return await apiRequest('/matches', 'POST', matchData, false);
  },

  // Update match
  updateMatch: async (id, matchData) => {
    return await apiRequest(`/matches/${id}`, 'PUT', matchData, false);
  },

  // Delete match
  deleteMatch: async (id) => {
    return await apiRequest(`/matches/${id}`, 'DELETE', null, false);
  },
};

// ========== ANALYTICS API ==========
export const analyticsAPI = {
  // Get overall analytics
  getAnalytics: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const url = `/analytics${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET');
  },

  // Get progress data
  getProgress: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.period) queryParams.append('period', filters.period);
    
    const url = `/analytics/progress${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET');
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    return await apiRequest(`/analytics/recent?limit=${limit}`, 'GET');
  },

  // Get personal bests
  getPersonalBests: async () => {
    return await apiRequest('/analytics/bests', 'GET');
  },
};

// ========== USERS API (Admin only) ==========
export const usersAPI = {
  // Get all users
  getUsers: async () => {
    return await apiRequest('/users', 'GET');
  },

  // Get single user
  getUser: async (id) => {
    return await apiRequest(`/users/${id}`, 'GET');
  },

  // Update user
  updateUser: async (id, userData) => {
    return await apiRequest(`/users/${id}`, 'PUT', userData);
  },

  // Delete user
  deleteUser: async (id) => {
    return await apiRequest(`/users/${id}`, 'DELETE');
  },
};

// ========== PLAYERS API ==========
export const playersAPI = {
  // Get all players
  getPlayers: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const url = `/players${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single player
  getPlayer: async (id) => {
    return await apiRequest(`/players/${id}`, 'GET', null, false);
  },

  // Create new player
  createPlayer: async (playerData) => {
    return await apiRequest('/players', 'POST', playerData, false);
  },

  // Update player
  updatePlayer: async (id, playerData) => {
    return await apiRequest(`/players/${id}`, 'PUT', playerData, false);
  },

  // Delete player
  deletePlayer: async (id) => {
    return await apiRequest(`/players/${id}`, 'DELETE', null, false);
  },
};

// Export all APIs as default
const api = {
  auth: authAPI,
  drills: drillsAPI,
  exercises: exercisesAPI,
  sessions: sessionsAPI,
  matches: matchesAPI,
  analytics: analyticsAPI,
  users: usersAPI,
  players: playersAPI,
};

export default api;
