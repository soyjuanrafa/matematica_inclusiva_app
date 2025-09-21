import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import AccessibleButton from '../components/AccessibleButton';
import { SoundService } from '../utils/soundService';
import * as Speech from 'expo-speech';

const LessonScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || { lessonId: 1 };
  const { updateUserProgress, accessibilitySettings } = useUserProgress();
  
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
      
      // Simular carga de datos
      setTimeout(() => {
        const lessonData = {
          id: lessonId,
          title: 'Orden de operaciones',
          description: 'Aprende a resolver expresiones con múltiples operaciones',
          questions: [
            {
              id: 1,
              question: '¿Cuál es el resultado de 2 + 3 × 4?',
              options: ['20', '14', '11', '5'],
              correctAnswer: 2, // Índice de la respuesta correcta (0-based)
              explanation: 'Primero se realiza la multiplicación (3 × 4 = 12) y luego la suma (2 + 12 = 14).'
            },
            {
              id: 2,
              question: '¿Cuál es el resultado de (8 - 2) × 3?',
              options: ['18', '6', '12', '24'],
              correctAnswer: 0, // Índice de la respuesta correcta (0-based)
              explanation: 'Primero se resuelve el paréntesis (8 - 2 = 6) y luego la multiplicación (6 × 3 = 18).'
            },
            {
              id: 3,
              question: '¿Cuál es el resultado de 20 ÷ 4 + 3 × 2?',
              options: ['5', '11', '10', '8'],
              correctAnswer: 1, // Índice de la respuesta correcta (0-based)
              explanation: 'Primero se realizan las operaciones de división y multiplicación (20 ÷ 4 = 5, 3 × 2 = 6) y luego la suma (5 + 6 = 11).'
            }
          ]
        };
        
        setLesson(lessonData);
        setLoading(false);
        
        // Leer la pregunta si el texto a voz está activado
        if (accessibilitySettings?.textToSpeech) {
          const questionText = lessonData.questions[0].question;
          Speech.speak(questionText, { language: 'es' });
        }
      }, 1000);
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'No se pudo cargar la lección');
      navigation.goBack();
    }
  };
  
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    const currentQ = lesson.questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    setIsAnswerCorrect(isCorrect);
    
    // Reproducir sonido según la respuesta
    if (isCorrect) {
      SoundService.playSound('correct');
    } else {
      SoundService.playSound('incorrect');
    }
    
    // Actualizar puntuación
    if (isCorrect) {
      setScore(score + 1);
    }
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
      
      // Actualizar progreso del usuario
      updateUserProgress(lessonId, finalScore);
      
      // Navegar a la pantalla de finalización
      navigation.navigate('LessonCompletion', {
        score: finalScore,
        totalQuestions,
        lessonId,
        question: lesson.questions[currentQuestion].question,
        answer: lesson.questions[currentQuestion].options[lesson.questions[currentQuestion].correctAnswer]
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
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentQuestion + 1}/{lesson.questions.length}
          </Text>
        </View>
      </View>
      
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
                selectedAnswer !== null && currentQ.correctAnswer === index && styles.correctOption
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
                selectedAnswer !== null && currentQ.correctAnswer === index && styles.correctOptionText
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
              {isAnswerCorrect ? '¡Correcto!' : 'Incorrecto'}
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