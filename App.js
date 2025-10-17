import React, { useEffect, useRef } from 'react';
import { StatusBar, LogBox, View } from 'react-native';
import { UserProgressProvider } from './src/context/UserProgressContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import { CharacterProvider } from './src/context/CharacterContext';
import * as Notifications from 'expo-notifications';
import { NotificationService } from './src/utils/notificationService';
import { SoundService } from './src/utils/soundService';
import { COLORS } from './src/theme';
import { useFonts as useFredoka, Fredoka_400Regular } from '@expo-google-fonts/fredoka';
import { useFonts as useAtkinson, AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible';
import { useFonts as usePoppins, Poppins_400Regular } from '@expo-google-fonts/poppins';

// Ignorar advertencias específicas si es necesario
LogBox.ignoreLogs(['Reanimated 2']);

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Solicitar permisos de notificación al iniciar la app
    NotificationService.requestPermissions();

    // Configurar listeners para notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // notification received - kept intentionally silent in production
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // handle response data if needed (navigation can be triggered here)
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

  const [fredokaLoaded] = useFredoka({ Fredoka_400Regular });
  const [atkinsonLoaded] = useAtkinson({ AtkinsonHyperlegible_400Regular });
  const [poppinsLoaded] = usePoppins({ Poppins_400Regular });
  const fontsLoaded = fredokaLoaded && atkinsonLoaded && poppinsLoaded;

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <UserProgressProvider>
        <CharacterProvider>
          <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <MainApp />
          </View>
        </CharacterProvider>
      </UserProgressProvider>
    </AuthProvider>
  );
}

const MainApp = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <AppNavigator /> : <LoginScreen />;
};
