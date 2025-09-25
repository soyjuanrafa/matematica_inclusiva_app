import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Animated,
  Easing
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import { useCharacter } from '../context/CharacterContext';
import AccessibleButton from '../components/AccessibleButton';
import { SoundService } from '../utils/soundService';
import * as Speech from 'expo-speech';

const LessonScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || { lessonId: 1 };
  const { updateUserProgress, accessibilitySettings } = useUserProgress();
  const { selected: character } = useCharacter();
  const waveAnim = new Animated.Value(0);

  useEffect(() => {
    // simple infinite horizontal wave animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);
  
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [lesson, setLesson] = useState(null);
  
  useEffect(() => {
    loadLesson();
  }, [lessonId]);
  
  const loadLesson = async () => {
    try {
      // Aquí cargarías los datos de la lección desde una API o base de datos
      // Por ahora usamos datos de ejemplo
      
      // Simular carga de datos usando el modelo proporcionado
      setTimeout(() => {
        const lessonData = {
          id: lessonId,
          title: 'La Montaña de las Operaciones',
          description: 'Sube la montaña resolviendo operaciones',
          character: character?.displayName ? `${character.displayName} (${character.name})` : 'Roko (Cuadrado morado, gorra naranja)',
          background: 'Olas con cuerda animada',
          // Multiple varied questions for variety
          questions: [
            {
              id: 1,
              question: '2 + 4 × 8 = ...',
              options: [44, 39, 36, 48, 34],
              correctAnswerValue: 34,
              explanation: 'Se realiza primero la multiplicación: 4 × 8 = 32. Luego 2 + 32 = 34.'
            },
            {
              id: 2,
              question: '¿Cuál es el resultado de 5 × (2 + 3)?',
              options: [25, 15, 10, 20],
              correctAnswerValue: 25,
              explanation: 'Se calcula el paréntesis: 2 + 3 = 5. Luego 5 × 5 = 25.'
            },
            {
              id: 3,
              question: 'Completa: ? × 7 = 42',
              options: [5, 6, 7, 8],
              correctAnswerValue: 6,
              explanation: '6 × 7 = 42, por tanto ? = 6.'
            },
            {
              id: 4,
              question: '¿Cuál es mayor?',
              options: [7, 8, 9, 10],
              correctAnswerValue: 10,
              explanation: '3+4=7; 2*4=8; 9; 10 → mayor es 10.'
            },
            {
              id: 5,
              question: 'Si tienes 3 bolsas con 4 manzanas cada una, ¿cuántas manzanas en total?',
              options: [7, 12, 9, 15],
              correctAnswerValue: 12,
              explanation: '3 × 4 = 12 manzanas en total.'
            }
          ]
        };

        setLesson(lessonData);
        setLoading(false);

        if (accessibilitySettings?.textToSpeech) {
          Speech.speak(lessonData.questions[0].question, { language: 'es' });
        }
      }, 600);
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'No se pudo cargar la lección');
      navigation.goBack();
    }
  };

  const renderAvatar = (char, size = 48) => {
    // prefer character image if provided, otherwise fallback to character-square or avatar-placeholder
    try {
      if (char && char.image) {
        return <Image source={char.image} style={{ width: size, height: size, borderRadius: 8, marginRight: 12 }} />;
      }
    } catch (e) {}

    // fallback mapping by shape
    const src = (char && (char.shape === 'square')) ? require('../../assets/character-square.png') : require('../../assets/avatar-placeholder.png');
    return <Image source={src} style={{ width: size, height: size, borderRadius: 8, marginRight: 12 }} />;
  };

  const WaveBackground = ({ color = '#E3F2FD' }) => {
    const translateX = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
    return (
      <View style={styles.waveContainer} pointerEvents="none">
        <Animated.View style={[styles.wave, { backgroundColor: color, opacity: 0.4, transform: [{ translateX }] }]} />
        <Animated.View style={[styles.wave, { backgroundColor: color, opacity: 0.25, transform: [{ translateX: Animated.add(translateX, 60) }] }]} />
        <Animated.View style={[styles.wave, { backgroundColor: color, opacity: 0.15, transform: [{ translateX: Animated.add(translateX, 120) }] }]} />
      </View>
    );
  };
  
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const currentQ = lesson.questions[currentQuestion];
    const selectedValue = currentQ.options[answerIndex];
    const isCorrect = selectedValue === currentQ.correctAnswerValue;

    setIsAnswerCorrect(isCorrect);

    // Reproducir sonido según la respuesta
    try {
      if (isCorrect) SoundService.playSound('correct');
      else SoundService.playSound('incorrect');
    } catch (e) {}

    // Actualizar puntuación (binary)
    if (isCorrect) setScore(s => s + 1);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      
      // Leer la siguiente pregunta si el texto a voz está activado
      if (accessibilitySettings?.textToSpeech) {
        const questionText = lesson.questions[currentQuestion + 1].question;
        Speech.speak(questionText, { language: 'es' });
      }
    } else {
      // Lección completada
      const totalQuestions = lesson.questions.length;
      const finalScore = score + (isAnswerCorrect ? 1 : 0);

      updateUserProgress(lessonId, finalScore);

      navigation.navigate('LessonCompletion', {
        score: finalScore,
        totalQuestions,
        lessonId,
        question: lesson.questions[currentQuestion].question,
        answer: lesson.questions[currentQuestion].correctAnswerValue
      });
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando lección...</Text>
      </View>
    );
  }
  
  const currentQ = lesson.questions[currentQuestion];
  
  return (
    <View style={styles.container}>
  <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver a la selección de lecciones"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {renderAvatar(character, 48)}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{lesson.title}</Text>
            <Text style={{ color: 'white', fontSize: 12 }}>{lesson.character}</Text>
          </View>
        </View>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentQuestion + 1}/{lesson.questions.length}
          </Text>
        </View>
  </View>
  <WaveBackground color={character?.color || '#E3F2FD'} />
      
      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer === index && isAnswerCorrect && styles.correctOption,
                selectedAnswer === index && !isAnswerCorrect && styles.incorrectOption,
                selectedAnswer !== null && currentQ.correctAnswerValue === option && styles.correctOption
              ]}
              onPress={() => selectedAnswer === null && handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              accessibilityLabel={`Opción ${index + 1}: ${option}`}
              accessibilityHint="Toca para seleccionar esta respuesta"
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                selectedAnswer === index && isAnswerCorrect && styles.correctOptionText,
                selectedAnswer === index && !isAnswerCorrect && styles.incorrectOptionText,
                selectedAnswer !== null && currentQ.correctAnswerValue === option && styles.correctOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedAnswer !== null && (
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              isAnswerCorrect ? styles.correctFeedbackText : styles.incorrectFeedbackText
            ]}>
              {isAnswerCorrect ? '¡Correcto!' : `Incorrecto. La respuesta correcta es ${currentQ.correctAnswerValue}`}
            </Text>
            <Text style={styles.explanationText}>
              {currentQ.explanation}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {selectedAnswer !== null && (
        <View style={styles.footer}>
          <AccessibleButton
            title={currentQuestion < lesson.questions.length - 1 ? "Siguiente" : "Finalizar"}
            onPress={handleNextQuestion}
            style={styles.nextButton}
            accessibilityLabel={currentQuestion < lesson.questions.length - 1 ? "Siguiente pregunta" : "Finalizar lección"}
            icon={<Ionicons name="arrow-forward" size={20} color="white" style={{ marginRight: 5 }} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#6200EE',
  },
  waveContainer: {
    ...StyleSheet.absoluteFillObject,
    bottom: -20,
    height: 120,
    overflow: 'hidden'
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 30,
    top: 20
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  progressIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  correctOptionText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  incorrectOptionText: {
    fontWeight: 'bold',
    color: '#F44336',
  },
  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  correctFeedbackText: {
    color: '#4CAF50',
  },
  incorrectFeedbackText: {
    color: '#F44336',
  },
  explanationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#6200EE',
  },
});

export default LessonScreen;