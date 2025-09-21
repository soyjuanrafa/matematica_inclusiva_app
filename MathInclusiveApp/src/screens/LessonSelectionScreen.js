import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import LessonCard from '../components/LessonCard';

const LessonSelectionScreen = () => {
  const navigation = useNavigation();
  const { progress } = useUserProgress();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  
  useEffect(() => {
    // Simular carga de lecciones desde una API
    const loadLessons = async () => {
      // Aquí cargarías las lecciones desde una API o base de datos
      // Por ahora usamos datos de ejemplo
      const exampleLessons = [
        {
          id: 1,
          title: 'Operaciones básicas',
          description: 'Suma, resta, multiplicación y división',
          image: require('../../assets/character-square.png'),
          backgroundColor: '#E8F5E9',
          textColor: '#2E7D32',
          borderColor: '#A5D6A7',
          progress: 100,
          completedLessons: 3,
          totalLessons: 3,
          unlocked: true
        },
        {
          id: 2,
          title: 'Orden de operaciones',
          description: 'Aprende a resolver expresiones con múltiples operaciones',
          image: require('../../assets/character-square.png'),
          backgroundColor: '#E3F2FD',
          textColor: '#1565C0',
          borderColor: '#90CAF9',
          progress: 50,
          completedLessons: 1,
          totalLessons: 2,
          unlocked: true
        },
        {
          id: 3,
          title: 'Fracciones',
          description: 'Operaciones con fracciones y números mixtos',
          image: require('../../assets/character-square.png'),
          backgroundColor: '#FFF3E0',
          textColor: '#E65100',
          borderColor: '#FFCC80',
          progress: 0,
          completedLessons: 0,
          totalLessons: 3,
          unlocked: progress?.level >= 2
        },
        {
          id: 4,
          title: 'Ecuaciones',
          description: 'Resuelve ecuaciones de primer grado',
          image: require('../../assets/character-square.png'),
          backgroundColor: '#F3E5F5',
          textColor: '#6A1B9A',
          borderColor: '#CE93D8',
          progress: 0,
          completedLessons: 0,
          totalLessons: 4,
          unlocked: progress?.level >= 3
        }
      ];
      
      setLessons(exampleLessons);
      setLoading(false);
    };
    
    loadLessons();
  }, [progress]);
  
  const handleLessonPress = (lesson) => {
    if (lesson.unlocked) {
      navigation.navigate('Lesson', { lessonId: lesson.id });
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando lecciones...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lecciones</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.levelContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{progress?.level || 1}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Nivel {progress?.level || 1}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(100, ((progress?.points || 0) / ((progress?.level || 1) * 100)) * 100)}%` 
                  }
                ]} 
              />
            </View>
            <Text style={styles.pointsText}>
              {progress?.points || 0}/{(progress?.level || 1) * 100} puntos
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Continúa aprendiendo</Text>
        
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onPress={handleLessonPress}
            style={!lesson.unlocked && styles.lockedLesson}
          />
        ))}
        
        {!lessons.some(lesson => !lesson.unlocked) && (
          <View style={styles.allCompletedContainer}>
            <Image 
              source={require('../../assets/medal.png')} 
              style={styles.trophyImage}
              accessibilityLabel="Trofeo de logro"
            />
            <Text style={styles.allCompletedText}>
              ¡Has desbloqueado todas las lecciones disponibles!
            </Text>
            <Text style={styles.comingSoonText}>
              Más lecciones próximamente...
            </Text>
          </View>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
    padding: 15,
  },
  levelContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  lockedLesson: {
    opacity: 0.6,
  },
  allCompletedContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  trophyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  allCompletedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LessonSelectionScreen;