import axios from 'axios';

// Configurar instancia de axios con base URL genérica
const api = axios.create({
  baseURL: 'https://api.example.com', // Cambiar por URL real del backend
  timeout: 10000,
});

// Interceptor para agregar token de auth si existe
api.interceptors.request.use(
  async (config) => {
    // Aquí se puede agregar lógica para incluir token JWT si es necesario
    // const token = await AsyncStorage.getItem('@auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores globales, como 401 para logout
    if (error.response?.status === 401) {
      // Lógica para logout automático
    }
    return Promise.reject(error);
  }
);

export default api;
