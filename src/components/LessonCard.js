import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserProgress } from '../context/UserProgressContext';
import { SpeechService } from '../utils/speechService';

const LessonCard = ({
  lesson,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const navigation = useNavigation();
  const { accessibilitySettings } = useUserProgress();

  const handlePress = () => {
    // Proporcionar feedback auditivo si está habilitado
    if (accessibilitySettings?.textToSpeech) {
      const textToSpeak = `Lección: ${lesson.title}. ${lesson.description}`;
      SpeechService.speak(textToSpeak, {
        language: 'es',
        pitch: 1.0,
        rate: 0.8
      });
    }

    if (onPress) {
      onPress(lesson);
    } else {
      navigation.navigate('Lesson', { lessonId: lesson.id });
    }
  };

  // Determinar el tamaño de fuente basado en la configuración de accesibilidad
  const getFontSize = (baseSize) => {
    if (!accessibilitySettings) return baseSize;

    switch (accessibilitySettings.fontSize) {
      case 'small': return baseSize - 2;
      case 'large': return baseSize + 2;
      case 'xlarge': return baseSize + 4;
      default: return baseSize; // medium
    }
  };

  // Aplicar alto contraste si está habilitado
  const getColors = () => {
    if (accessibilitySettings?.highContrast) {
      return {
        background: '#000000',
        text: '#FFFFFF',
        border: '#FFFFFF'
      };
    }
    return {
      background: lesson.backgroundColor || '#FFFFFF',
      text: lesson.textColor || '#333333',
      border: lesson.borderColor || '#EEEEEE'
    };
  };

  const colors = getColors();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border
        },
        style
      ]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel || `Lección: ${lesson.title}`}
      accessibilityHint={lesson.description}
      accessible={true}
    >
      {lesson.image && (
        <Image
          source={lesson.image}
          style={styles.image}
          accessibilityLabel={`Imagen para ${lesson.title}`}
        />
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: getFontSize(16)
            }
          ]}
        >
          {lesson.title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.text,
              fontSize: getFontSize(14)
            }
          ]}
        >
          {lesson.description}
        </Text>

        {lesson.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${lesson.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {`${lesson.completedLessons || 0}/${lesson.totalLessons || 10}`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    margin: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
});

export default LessonCard;
