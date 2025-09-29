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
import { useCharacter } from '../context/CharacterContext';
import { SoundService } from '../utils/soundService';
import LessonCard from '../components/LessonCard';

const LessonSelectionScreen = () => {
  const navigation = useNavigation();
  const { progress } = useUserProgress();
  const { selected: character } = useCharacter();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    // Simular carga de lecciones desde una API
    const loadLessons = async () => {
      // Build the lesson list to match the requested model
      const exampleLessons = [
        {
          id: 1,
          title: 'El poder de los Números Gigantes',
          description: 'Explora números enormes de forma divertida',
          iconName: 'trophy',
          unlocked: true
        },
        {
          id: 2,
          title: 'La Montaña de las Operaciones',
          description: 'Sube la montaña resolviendo operaciones',
          iconName: 'calculator',
          unlocked: true
        },
        {
          id: 3,
          title: 'Cazadores de Múltiplos',
          description: 'Atrapa múltiplos y aprende patrones',
          iconName: 'grid',
          unlocked: progress?.level >= 2
        },
        {
          id: 4,
          title: 'Superpoderes de los Números',
          description: 'Descubre poderes especiales de los números',
          iconName: 'flash',
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
      if (soundEnabled) {
        try { SoundService.playSound('button'); } catch (e) { /* ignore */ }
      }
      navigation.navigate('Lesson', { lessonId: lesson.id });
    }
  };

  const handleToggleSound = () => setSoundEnabled(s => !s);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando lecciones...</Text>
      </View>
    );
  }
  
  const characterLabel = character ? `${character.displayName || character.name} (${character.shape ? character.shape : ''}${character.color ? ', ' + (character.colorName || character.color) : ''})` : 'Roko (Cuadrado morado, gorra naranja)';

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Seleccionar Lección</Text>
      </View>
      <View style={[styles.header, { backgroundColor: character?.color || '#6200EE' }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting} numberOfLines={1}>{`¡Hola, soy ${character?.displayName || 'Roko'}! ¿Listos para aprender juntos?`}</Text>
            <Text style={styles.subText}>¡Vamos a escoger una lección divertida hoy!</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { if (soundEnabled) { try { SoundService.playSound('button'); } catch(e){} } }} accessibilityLabel="Play">
                <Text style={styles.iconEmoji}>▶️</Text>
              </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleToggleSound} accessibilityLabel="Toggle sonido">
              <Text style={styles.iconEmoji}>{soundEnabled ? '🔊' : '🔈'}</Text>
            </TouchableOpacity>
          </View>
        </View>
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

        <View style={styles.lessonList}>
          {lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonItem, !lesson.unlocked && styles.lockedLesson]}
              onPress={() => handleLessonPress(lesson)}
              disabled={!lesson.unlocked}
            >
              <View style={styles.lessonIcon}>
                <Ionicons name={lesson.iconName || 'book'} size={28} color="#444" />
              </View>
              <View style={styles.lessonBody}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDesc}>{lesson.description}</Text>
              </View>
              <View style={styles.lessonRight}>
                <Text style={{ color: lesson.unlocked ? '#2e7d32' : '#999' }}>{lesson.unlocked ? 'Iniciar' : 'Bloqueado'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
  subText: {
    color: 'white',
    fontSize: 13,
    marginTop: 6
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  iconEmoji: { fontSize: 18 },
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
  lessonList: {
    marginBottom: 30
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1
  },
  lessonIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  lessonIconText: { fontSize: 26 },
  lessonBody: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  lessonDesc: { color: '#666' },
  lessonRight: { marginLeft: 8, alignItems: 'flex-end' },
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