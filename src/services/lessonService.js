import api from './apiService';

export const lessonService = {
  // Obtener todas las lecciones
  async getLessons() {
    try {
      const response = await api.get('/lessons');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo lecciones');
    }
  },

  // Obtener lección por ID
  async getLessonById(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo lección');
    }
  },

  // Crear nueva lección
  async createLesson(lessonData) {
    try {
      const response = await api.post('/lessons', lessonData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creando lección');
    }
  },

  // Actualizar lección
  async updateLesson(lessonId, lessonData) {
    try {
      const response = await api.put(`/lessons/${lessonId}`, lessonData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error actualizando lección');
    }
  },

  // Eliminar lección
  async deleteLesson(lessonId) {
    try {
      await api.delete(`/lessons/${lessonId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error eliminando lección');
    }
  },

  // Obtener progreso de usuario en lecciones
  async getUserProgress(userId) {
    try {
      const response = await api.get(`/users/${userId}/progress`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo progreso');
    }
  },

  // Actualizar progreso de usuario
  async updateUserProgress(userId, progressData) {
    try {
      const response = await api.put(`/users/${userId}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error actualizando progreso');
    }
  }
};
