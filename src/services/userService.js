import api from './apiService';

export const getUserAchievements = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/achievements`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error obteniendo logros');
  }
};

export const getUserLevel = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/level`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error obteniendo nivel');
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error obteniendo estadísticas');
  }
};

// CRUD para logros
export const createAchievement = async (userId, achievementData) => {
  try {
    const response = await api.post(`/users/${userId}/achievements`, achievementData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creando logro');
  }
};

export const updateAchievement = async (userId, achievementId, achievementData) => {
  try {
    const response = await api.put(`/users/${userId}/achievements/${achievementId}`, achievementData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error actualizando logro');
  }
};

export const deleteAchievement = async (userId, achievementId) => {
  try {
    await api.delete(`/users/${userId}/achievements/${achievementId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error eliminando logro');
  }
};
