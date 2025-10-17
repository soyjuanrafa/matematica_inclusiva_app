import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import AccessibleButton from '../components/AccessibleButton';
import { SoundService } from '../utils/soundService';
import { SpeechService } from '../utils/speechService';

const LessonCompletionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { score, totalQuestions, lessonId } = route.params || {};
  const { progress, accessibilitySettings } = useUserProgress();

  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const isPerfectScore = score === totalQuestions;

  // Animation values
  const scaleAnim = new Animated.Value(0.5);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Play achievement sound
    SoundService.playSound('achievement');

    // Start animations
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();

    // Text to speech feedback if enabled
    if (accessibilitySettings?.textToSpeech) {
      const message = isPerfectScore
        ? '¡Felicidades! Has completado la lección con una puntuación perfecta.'
        : `Has completado la lección con ${score} de ${totalQuestions} respuestas correctas.`;

      SpeechService.speak(message, { language: 'es' });
    }
  }, []);

  const handleContinue = () => {
    navigation.navigate('Main', { screen: 'Lessons' });
  };

  const handleRetry = () => {
    navigation.navigate('Lesson', { lessonId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Lección Completada</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.resultContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim
            }
          ]}
        >
          <Image
            source={isPerfectScore
              ? require('../../assets/medal.png')
              : require('../../assets/character-square.png')
            }
            style={styles.resultImage}
            accessibilityLabel={isPerfectScore ? "Medalla de oro" : "Personaje"}
          />

          <Text style={styles.scoreText}>
            {score}/{totalQuestions}
          </Text>

          <Text style={styles.percentageText}>
            {scorePercentage}%
          </Text>

          <Text style={styles.feedbackText}>
            {isPerfectScore
              ? '¡Excelente trabajo!'
              : scorePercentage >= 70
                ? '¡Buen trabajo!'
                : 'Sigue practicando'
            }
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#FFC107" />
              <Text style={styles.statValue}>{score * 10}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color="#6200EE" />
              <Text style={styles.statValue}>+1</Text>
              <Text style={styles.statLabel}>Lección</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{progress?.level || 1}</Text>
              <Text style={styles.statLabel}>Nivel</Text>
            </View>
          </View>
        </Animated.View>

        {isPerfectScore && (
          <View style={styles.achievementContainer}>
            <Ionicons name="ribbon" size={30} color="#FFC107" />
            <Text style={styles.achievementText}>
              ¡Has desbloqueado el logro "Perfección"!
            </Text>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <AccessibleButton
            title="Continuar"
            onPress={handleContinue}
            style={styles.continueButton}
            accessibilityLabel="Continuar a la selección de lecciones"
          />

          {!isPerfectScore && (
            <AccessibleButton
              title="Reintentar"
              onPress={handleRetry}
              style={styles.retryButton}
              textStyle={styles.retryButtonText}
              accessibilityLabel="Reintentar esta lección"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#6200EE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    marginLeft: 10,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#6200EE',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  retryButtonText: {
    color: '#6200EE',
  },
});

export default LessonCompletionScreen;
