import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const NotificationService = {
  async requestPermissions() {
    // Skip on web
    if (Platform.OS === 'web') {
      console.debug('NotificationService: Skipping permissions request on web platform');
      return false;
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.debug('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6200EE',
        });
      }

      return true;
    } else {
      console.debug('Notifications require a physical device');
      return false;
    }
  },

  async scheduleReminder(title, body, data = {}, trigger = null) {
    // Skip on web
    if (Platform.OS === 'web') {
      console.debug('NotificationService: Skipping notification scheduling on web platform');
      return null;
    }

    // Si no se proporciona un trigger, programar para el día siguiente
    if (!trigger) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0); // 6:00 PM

      trigger = {
        hour: 18,
        minute: 0,
        repeats: true,
      };
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error al programar notificación:', error);
      return null;
    }
  },

  async cancelNotification(notificationId) {
    // Skip on web
    if (Platform.OS === 'web') {
      console.debug('NotificationService: Skipping notification cancellation on web platform');
      return true;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error('Error al cancelar notificación:', error);
      return false;
    }
  },

  async cancelAllNotifications() {
    // Skip on web
    if (Platform.OS === 'web') {
      console.debug('NotificationService: Skipping all notifications cancellation on web platform');
      return true;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error al cancelar todas las notificaciones:', error);
      return false;
    }
  },

  async scheduleStudyReminder() {
    const title = '¡Es hora de practicar!';
    const body = 'No pierdas tu racha de aprendizaje. ¡Vuelve a practicar matemáticas!';
    const data = { screen: 'LessonSelection' };

    return this.scheduleReminder(title, body, data);
  },
};
