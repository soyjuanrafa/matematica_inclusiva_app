import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';

const RewardsScreen = () => {
  const navigation = useNavigation();
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Primeros pasos',
      description: 'Completa tu primera lección',
      icon: '🏆',
      earned: true,
      date: '10/05/2023',
    },
    {
      id: 2,
      title: 'Matemático novato',
      description: 'Completa 5 lecciones',
      icon: '🥉',
      earned: true,
      date: '15/05/2023',
    },
    {
      id: 3,
      title: 'Matemático intermedio',
      description: 'Completa 15 lecciones',
      icon: '🥈',
      earned: false,
    },
    {
      id: 4,
      title: 'Matemático experto',
      description: 'Completa 30 lecciones',
      icon: '🥇',
      earned: false,
    },
    {
      id: 5,
      title: 'Perfección',
      description: 'Obtén una puntuación perfecta en una lección',
      icon: '⭐',
      earned: true,
      date: '12/05/2023',
    },
    {
      id: 6,
      title: 'Racha ganadora',
      description: 'Completa lecciones durante 5 días seguidos',
      icon: '🔥',
      earned: false,
    },
  ]);
  
  const [userLevel, setUserLevel] = useState({
    level: 3,
    points: 250,
    nextLevel: 400,
  });
  
  const [stats, setStats] = useState({
    lessonsCompleted: 12,
    averageAccuracy: 85,
    streak: 5
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Aquí harías llamadas a tu API o almacenamiento local
      // Por ahora usamos los datos de ejemplo ya definidos
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      console.error(error);
    }
  };
  
  const handleAchievementPress = (achievement) => {
    if (achievement.earned) {
      Alert.alert(
        achievement.title,
        `¡Felicidades! ${achievement.description}\nObtenido: ${achievement.date}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        achievement.title,
        `Para desbloquear: ${achievement.description}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logros - Cuenta Conmigo</Text>
      </View>
      <ScrollView>
      
      <View style={styles.userInfoContainer}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelTitle} accessibilityRole="header">
            Nivel {userLevel.level}
          </Text>
          <Text style={styles.levelPoints}>
            {userLevel.points} / {userLevel.nextLevel} puntos
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(userLevel.points / userLevel.nextLevel) * 100}%` }
              ]} 
              accessibilityLabel={`Progreso: ${Math.round((userLevel.points / userLevel.nextLevel) * 100)}%`}
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Mis logros
      </Text>

      <View style={styles.achievementsContainer}>
        {achievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={[
              styles.achievementCard,
              achievement.earned ? styles.earnedAchievement : styles.unearnedAchievement
            ]}
            accessibilityLabel={`Logro: ${achievement.title}, ${achievement.earned ? 'Obtenido' : 'No obtenido'}`}
            accessibilityHint={achievement.description}
            onPress={() => handleAchievementPress(achievement)}
          >
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              {achievement.earned && (
                <Text style={styles.achievementDate}>
                  Obtenido: {achievement.date}
                </Text>
              )}
            </View>
            {achievement.earned && (
              <View style={styles.earnedBadge}>
                <Text style={styles.earnedBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Estadísticas
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.lessonsCompleted}</Text>
          <Text style={styles.statLabel}>Lecciones completadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.averageAccuracy}%</Text>
          <Text style={styles.statLabel}>Precisión promedio</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Días de racha</Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  userInfoContainer: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelContainer: {
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  levelPoints: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#03DAC6',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 15,
    marginBottom: 10,
  },
  achievementsContainer: {
    paddingHorizontal: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  earnedAchievement: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  unearnedAchievement: {
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  achievementDate: {
    fontSize: 12,
    color: '#888',
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default RewardsScreen;