import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async signIn(email, password) {
    // Very simple mock: accept any non-empty email/password
    if (!email || !password) throw new Error('Credenciales inválidas');

    const user = { id: 'user-1', email };
    await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
    return user;
  },

  async signOut() {
    await AsyncStorage.removeItem('@auth_user');
  },

  async signUp(email, password) {
    // Very simple mock sign up: accept any non-empty email/password
    if (!email || !password) throw new Error('Credenciales inválidas');

    const user = { id: `user-${Date.now()}`, email };
    await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
    return user;
  },

  async getCurrentUser() {
    try {
      const raw = await AsyncStorage.getItem('@auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
