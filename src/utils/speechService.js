import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export const SpeechService = {
  speak(text, options = {}) {
    if (Platform.OS === 'web') {
      console.debug('SpeechService: Skipping speech on web platform');
      return;
    }

    try {
      Speech.speak(text, options);
    } catch (error) {
      console.error('SpeechService: Error speaking text:', error);
    }
  },

  stop() {
    if (Platform.OS === 'web') {
      console.debug('SpeechService: Skipping speech stop on web platform');
      return;
    }

    try {
      Speech.stop();
    } catch (error) {
      console.error('SpeechService: Error stopping speech:', error);
    }
  },

  isSpeaking() {
    if (Platform.OS === 'web') {
      return false;
    }

    try {
      return Speech.isSpeakingAsync();
    } catch (error) {
      console.error('SpeechService: Error checking speech status:', error);
      return false;
    }
  }
};
