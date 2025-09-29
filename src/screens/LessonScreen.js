import React, { useState, useEffect, useRef } from 'react';
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
import * as HapticFeedback from 'expo-haptics';
import { useUserProgress } from '../context/UserProgressContext';
import { useCharacter } from '../context/CharacterContext';
import AccessibleButton from '../components/AccessibleButton';
import NumericInputExercise from '../components/NumericInputExercise';
import DragDropExercise from '../components/DragDropExercise';
import { SoundService } from '../utils/soundService';
import * as Speech from 'expo-speech';

const LessonScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || { lessonId: 1 };
  const { updateUserProgress, accessibilitySettings } = useUserProgress();
  const { selected: character } = useCharacter();
  const waveAnim = new Animated.Value(0);
  const feedbackAnim = useRef(new Animated.Value(1)).current;

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
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(null);
  
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
              type: 'multiple',
              question: '2 + 4 × 8 = ...',
              options: [44, 39, 36, 48, 34],
              correctAnswerValue: 34,
              explanation: 'Se realiza primero la multiplicación: 4 × 8 = 32. Luego 2 + 32 = 34.'
            },
            {
              id: 2,
              type: 'numeric',
              question: '¿Cuánto es 5 × (2 + 3)?',
              correctAnswerValue: 25,
              explanation: 'Se calcula el paréntesis: 2 + 3 = 5. Luego 5 × 5 = 25.'
            },
            {
              id: 3,
              type: 'dragdrop',
              question: 'Arrastra el número correcto al resultado de 6 × 7',
              draggables: [{ label: '42' }, { label: '36' }, { label: '48' }],
              dropZones: [{ label: 'Resultado' }],
              correctMappings: [{ zoneY: 200, value: 42 }],
              correctAnswerValue: 42,
              explanation: '6 × 7 = 42.'
            },
            {
              id: 4,
              type: 'multiple',
              question: '¿Cuál es mayor?',
              options: [7, 8, 9, 10],
              correctAnswerValue: 10,
              explanation: '3+4=7; 2*4=8; 9; 10 → mayor es 10.'
            },
            {
              id: 5,
              type: 'numeric',
              question: 'Si tienes 3 bolsas con 4 manzanas cada una, ¿cuántas manzanas en total?',
              correctAnswerValue: 12,
              explanation: '3 × 4 = 12 manzanas en total.'
            }
          ]
        };

        setLesson(lessonData);
        setLoading(false);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());

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

    // Haptic feedback
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);

    // Animation for feedback
    Animated.sequence([
      Animated.spring(feedbackAnim, { toValue: isCorrect ? 1.1 : 0.9, friction: 3, useNativeDriver: true }),
      Animated.spring(feedbackAnim, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();

    // Reproducir sonido según la respuesta
    try {
      if (isCorrect) SoundService.playSound('correct');
      else SoundService.playSound('incorrect');
    } catch (e) {}

    // Actualizar puntuación (binary)
    if (isCorrect) setScore(s => s + 1);

    // Track errors
    if (!isCorrect) {
      setErrors(prev => ({
        ...prev,
        [currentQ.id]: (prev[currentQ.id] || 0) + 1
      }));
    }
  };

  const handleExerciseSubmit = (result) => {
    setIsAnswerCorrect(result.isCorrect);

    // Haptic feedback
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);

    // Reproducir sonido según la respuesta
    try {
      if (result.isCorrect) SoundService.playSound('correct');
      else SoundService.playSound('incorrect');
    } catch (e) {}

    // Actualizar puntuación (binary)
    if (result.isCorrect) setScore(s => s + 1);

    // Track errors
    if (!result.isCorrect) {
      setErrors(prev => ({
        ...prev,
        [lesson.questions[currentQuestion].id]: (prev[lesson.questions[currentQuestion].id] || 0) + 1
      }));
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setQuestionStartTime(Date.now());
      
      // Leer la siguiente pregunta si el texto a voz está activado
      if (accessibilitySettings?.textToSpeech) {
        const questionText = lesson.questions[currentQuestion + 1].question;
        Speech.speak(questionText, { language: 'es' });
      }
    } else {
      // Lección completada
      const totalQuestions = lesson.questions.length;
      const finalScore = score + (isAnswerCorrect ? 1 : 0);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      updateUserProgress(lessonId, finalScore, timeSpent, errors);

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
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver a la selección de lecciones"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{lesson.title}</Text>
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
        
        {currentQ.type === 'multiple' && (
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
        )}

        {currentQ.type === 'numeric' && (
          <NumericInputExercise
            question={currentQ}
            onSubmit={handleExerciseSubmit}
            accessibilitySettings={accessibilitySettings}
          />
        )}

        {currentQ.type === 'dragdrop' && (
          <DragDropExercise
            question={currentQ}
            onSubmit={handleExerciseSubmit}
            accessibilitySettings={accessibilitySettings}
          />
        )}
        
        {(selectedAnswer !== null || isAnswerCorrect !== null) && (
          <Animated.View style={[styles.feedbackContainer, { transform: [{ scale: feedbackAnim }] }]}>
            <Text style={[
              styles.feedbackText,
              isAnswerCorrect ? styles.correctFeedbackText : styles.incorrectFeedbackText
            ]}>
              {isAnswerCorrect ? '¡Correcto!' : `Incorrecto. La respuesta correcta es ${currentQ.correctAnswerValue}`}
            </Text>
            <Text style={styles.explanationText}>
              {currentQ.explanation}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
      
      {(selectedAnswer !== null || isAnswerCorrect !== null) && (
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
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

  progressIndicator: {
    backgroundColor: '#6200EE',
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
