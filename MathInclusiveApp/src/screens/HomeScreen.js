import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import AccessibleButton from '../components/AccessibleButton';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { progress } = useUserProgress();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Hola!</Text>
        <Text style={styles.headerTitle}>Cuenta Conmigo</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.level || 1}</Text>
          <Text style={styles.statLabel}>Nivel</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.points || 0}</Text>
          <Text style={styles.statLabel}>Puntos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.lessonsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Lecciones</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continúa aprendiendo</Text>
        <TouchableOpacity 
          style={styles.continueCard}
          onPress={() => navigation.navigate('Lessons')}
          accessibilityLabel="Continuar aprendiendo"
        >
          <View style={styles.continueCardContent}>
            <View>
              <Text style={styles.continueCardTitle}>Orden de operaciones</Text>
              <Text style={styles.continueCardSubtitle}>Lección 2 de 4</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
            <Ionicons name="play-circle" size={40} color="#6200EE" />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros recientes</Text>
        {progress?.achievements && progress.achievements.length > 0 ? (
          progress.achievements.slice(0, 2).map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Completa lecciones para desbloquear logros
            </Text>
          </View>
        )}
        
        <AccessibleButton
          title="Ver todos los logros"
          onPress={() => navigation.navigate('Rewards')}
          style={styles.viewAllButton}
          textStyle={styles.viewAllButtonText}
          accessibilityLabel="Ver todos mis logros"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesibilidad</Text>
        <TouchableOpacity 
          style={styles.accessibilityCard}
          onPress={() => navigation.navigate('AccessibilitySettings')}
          accessibilityLabel="Configurar opciones de accesibilidad"
        >
          <Ionicons name="accessibility" size={24} color="#6200EE" />
          <Text style={styles.accessibilityText}>
            Configura las opciones de accesibilidad
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#6200EE',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: -20,
    marginHorizontal: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  continueCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  continueCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  continueCardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    width: 200,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 3,
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
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6200EE',
    marginTop: 10,
  },
  viewAllButtonText: {
    color: '#6200EE',
  },
  accessibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accessibilityText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;