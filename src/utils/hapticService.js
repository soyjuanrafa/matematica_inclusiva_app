import { Platform } from 'react-native';
import * as HapticFeedback from 'expo-haptics';

export const HapticService = {
  impactAsync(style = HapticFeedback.ImpactFeedbackStyle.Medium) {
    if (Platform.OS === 'web') {
      console.debug('HapticService: Skipping haptic feedback on web platform');
      return;
    }

    try {
      HapticFeedback.impactAsync(style);
    } catch (error) {
      console.error('HapticService: Error providing haptic feedback:', error);
    }
  },

  notificationAsync(type = HapticFeedback.NotificationFeedbackType.Success) {
    if (Platform.OS === 'web') {
      console.debug('HapticService: Skipping notification haptic feedback on web platform');
      return;
    }

    try {
      HapticFeedback.notificationAsync(type);
    } catch (error) {
      console.error('HapticService: Error providing notification haptic feedback:', error);
    }
  },

  selectionAsync() {
    if (Platform.OS === 'web') {
      console.debug('HapticService: Skipping selection haptic feedback on web platform');
      return;
    }

    try {
      HapticFeedback.selectionAsync();
    } catch (error) {
      console.error('HapticService: Error providing selection haptic feedback:', error);
    }
  }
};
