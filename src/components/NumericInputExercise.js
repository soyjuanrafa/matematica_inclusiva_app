import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticService } from '../utils/hapticService';
import { SoundService } from '../utils/soundService';

const NumericInputExercise = ({ question, onSubmit, accessibilitySettings }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    const answerNum = parseFloat(userAnswer);
    const correctNum = parseFloat(question.correctAnswerValue);
    const correct = !isNaN(answerNum) && answerNum === correctNum;

    setIsCorrect(correct);
    setSubmitted(true);
    HapticService.impactAsync();

    if (correct) {
      SoundService.playSound('correct');
    } else {
      SoundService.playSound('incorrect');
    }

    onSubmit({
      isCorrect: correct,
      userAnswer: answerNum,
      questionId: question.id,
    });
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={[
          styles.answerContainer,
          isCorrect ? styles.correctAnswer : styles.incorrectAnswer
        ]}>
          <Text style={styles.userAnswer}>Tu respuesta: {userAnswer || 'No ingresada'}</Text>
          <Text style={styles.correctAnswerText}>
            Correcta: {question.correctAnswerValue}
          </Text>
        </View>
        <Text style={[
          styles.feedback,
          isCorrect ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          {isCorrect ? '¡Correcto!' : 'Inténtalo de nuevo'}
        </Text>
        {!isCorrect && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setUserAnswer('');
              setSubmitted(false);
              setIsCorrect(null);
            }}
            accessibilityLabel="Intentar de nuevo"
          >
            <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        )}
        {question.explanation && (
          <Text style={styles.explanation}>{question.explanation}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>
      <TextInput
        style={styles.input}
        value={userAnswer}
        onChangeText={setUserAnswer}
        keyboardType="numeric"
        placeholder="Ingresa tu respuesta numérica"
        accessibilityLabel="Campo para ingresar respuesta numérica"
        editable={!submitted}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={!userAnswer.trim()}
        accessibilityLabel="Enviar respuesta"
      >
        <Text style={styles.submitButtonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#6200EE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  incorrectAnswer: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  userAnswer: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feedback: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  correctFeedback: {
    color: '#4CAF50',
  },
  incorrectFeedback: {
    color: '#F44336',
  },
  retryButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default NumericInputExercise;
