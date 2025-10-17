import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration
} from 'react-native';
import { useUserProgress } from '../context/UserProgressContext';
import { SoundService } from '../utils/soundService';
import { SpeechService } from '../utils/speechService';

const AccessibleButton = ({
  title,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  icon,
  vibrationPattern = 50,
  soundFeedback = true,
  disabled = false
}) => {
  const { accessibilitySettings } = useUserProgress();

  const handlePress = () => {
    // Proporcionar feedback auditivo con sonido
    SoundService.playSound('button', 0.7);

    // Proporcionar feedback táctil si está disponible
    if (accessibilitySettings?.vibration) {
      Vibration.vibrate(vibrationPattern);
    }

    // Proporcionar feedback auditivo si está habilitado
    if (accessibilitySettings?.textToSpeech && soundFeedback) {
      const textToSpeak = accessibilityLabel || title;
      SpeechService.speak(textToSpeak, {
        language: 'es',
        pitch: 1.0,
        rate: 0.8
      });
    }

    // Llamar a la función onPress proporcionada
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
    >
      {icon && icon}
      <Text style={[styles.buttonText, textStyle, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  disabledText: {
    color: '#888888',
  },
});

export default AccessibleButton;
