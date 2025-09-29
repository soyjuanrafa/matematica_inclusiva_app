import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as HapticFeedback from 'expo-haptics';
import { SoundService } from '../utils/soundService';

const { width } = Dimensions.get('window');

const DragDropExercise = ({ question, onSubmit, accessibilitySettings }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState(question.dropZones || []);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setDraggedItem(gestureState.y0); // Store starting Y for drop zone detection
        HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        // Check if dropped in correct zone
        const dropY = gestureState.moveY;
        const correctZone = question.correctMappings.find(mapping =>
          dropY >= mapping.zoneY && dropY <= mapping.zoneY + 100
        );

        if (correctZone) {
          // Correct drop
          setIsCorrect(true);
          SoundService.playSound('correct');
          HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
          onSubmit({
            isCorrect: true,
            userAnswer: correctZone.value,
            questionId: question.id,
          });
        } else {
          // Incorrect drop
          setIsCorrect(false);
          SoundService.playSound('incorrect');
          HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
          onSubmit({
            isCorrect: false,
            userAnswer: null,
            questionId: question.id,
          });
        }

        setSubmitted(true);
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={[
          styles.resultContainer,
          isCorrect ? styles.correctResult : styles.incorrectResult
        ]}>
          <Text style={styles.resultText}>
            {isCorrect ? '¡Correcto!' : 'Incorrecto. Inténtalo de nuevo'}
          </Text>
        </View>
        {question.explanation && (
          <Text style={styles.explanation}>{question.explanation}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>

      {/* Draggable Items */}
      <View style={styles.draggablesContainer}>
        {question.draggables.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.draggableItem,
              { transform: pan.getTranslateTransform() }
            ]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.draggableText}>{item.label}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Drop Zones */}
      <View style={styles.dropZonesContainer}>
        {question.dropZones.map((zone, index) => (
          <View key={index} style={styles.dropZone}>
            <Text style={styles.dropZoneText}>{zone.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.instruction}>
        Arrastra el elemento correcto a la zona correspondiente
      </Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  draggablesContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  draggableItem: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  draggableText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropZonesContainer: {
    marginBottom: 20,
  },
  dropZone: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  dropZoneText: {
    fontSize: 16,
    color: '#666',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  correctResult: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  incorrectResult: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default DragDropExercise;
