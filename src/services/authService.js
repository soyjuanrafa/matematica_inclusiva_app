import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './apiService';

export const authService = {
  async signIn(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
      await AsyncStorage.setItem('@auth_token', token);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en login');
    }
  },

  async signOut() {
    await AsyncStorage.removeItem('@auth_user');
    await AsyncStorage.removeItem('@auth_token');
  },

  async signUp(email, password) {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { user, token } = response.data;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
      await AsyncStorage.setItem('@auth_token', token);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en registro');
    }
  },

  async getCurrentUser() {
    try {
      const raw = await AsyncStorage.getItem('@auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // CRUD adicional: actualizar usuario
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      const updatedUser = response.data;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error actualizando usuario');
    }
  },

  // CRUD: eliminar usuario
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      await this.signOut();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error eliminando usuario');
    }
  }
};
