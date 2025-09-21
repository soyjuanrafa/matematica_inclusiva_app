import React, { useEffect, useRef } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { UserProgressProvider } from './src/context/UserProgressContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { NotificationService } from './src/utils/notificationService';
import { SoundService } from './src/utils/soundService';

// Ignorar advertencias específicas si es necesario
LogBox.ignoreLogs(['Reanimated 2']);

// Configurar el comportamiento de las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
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
    <UserProgressProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </UserProgressProvider>
  );
}