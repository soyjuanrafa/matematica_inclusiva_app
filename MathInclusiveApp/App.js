import React, { useEffect, useRef } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { UserProgressProvider } from './src/context/UserProgressContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import * as Notifications from 'expo-notifications';
import { NotificationService } from './src/utils/notificationService';
import { SoundService } from './src/utils/soundService';

// Ignorar advertencias específicas si es necesario
LogBox.ignoreLogs(['Reanimated 2']);

// Notification handler is configured in notificationService.js

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Solicitar permisos de notificación al iniciar la app
    NotificationService.requestPermissions();

    // Configurar listeners para notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Notificación presionada:', data);
      
      // Aquí podrías implementar la navegación a pantallas específicas
      // basado en los datos de la notificación
    });

    // Limpiar listeners al desmontar
    return () => {
      try {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  useEffect(() => {
    // Load sounds when the app starts
    const loadAppSounds = async () => {
      await SoundService.loadSounds();
    };
    
    loadAppSounds();
    
    // Cleanup sounds when the app is closed
    return () => {
      SoundService.unloadSounds();
    };
  }, []);

  return (
    <AuthProvider>
      <UserProgressProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <MainApp />
      </UserProgressProvider>
    </AuthProvider>
  );
}

const MainApp = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <AppNavigator /> : <LoginScreen />;
};