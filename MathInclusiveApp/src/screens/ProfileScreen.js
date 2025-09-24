import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import AccessibleButton from '../components/AccessibleButton';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { progress, accessibilitySettings } = useUserProgress();
  const { signOut } = useAuth();
  
  const handleAccessibilityPress = () => {
    navigation.navigate('AccessibilitySettings');
  };
  
  const handleRewardsPress = () => {
    navigation.navigate('Rewards');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil - Cuenta Conmigo</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image 
          source={require('../../assets/avatar-placeholder.png')} 
          style={styles.profileImage}
          accessibilityLabel="Imagen de perfil"
        />
        <Text style={styles.profileName}>Estudiante</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nivel {progress?.level || 1}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.points || 0}</Text>
          <Text style={styles.statLabel}>Puntos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.lessonsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Lecciones</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.streak || 0}</Text>
          <Text style={styles.statLabel}>Racha</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis logros</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleRewardsPress}
          accessibilityLabel="Ver mis logros"
        >
          <Ionicons name="trophy" size={24} color="#6200EE" />
          <Text style={styles.menuItemText}>Ver todos mis logros</Text>
          <Ionicons name="chevron-forward" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleAccessibilityPress}
          accessibilityLabel="Configurar opciones de accesibilidad"
        >
          <Ionicons name="accessibility" size={24} color="#6200EE" />
          <Text style={styles.menuItemText}>Opciones de accesibilidad</Text>
          <Ionicons name="chevron-forward" size={24} color="#6200EE" />
        </TouchableOpacity>
        <AccessibleButton
          title="Cerrar sesión"
          onPress={() => signOut()}
          style={{ marginTop: 10, backgroundColor: '#E53935' }}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statBoxValue}>{progress?.lessonsCompleted || 0}</Text>
            <Text style={styles.statBoxLabel}>Lecciones completadas</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="star" size={24} color="#FFC107" />
            <Text style={styles.statBoxValue}>{progress?.averageScore || 0}%</Text>
            <Text style={styles.statBoxLabel}>Puntuación media</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="flame" size={24} color="#FF5722" />
            <Text style={styles.statBoxValue}>{progress?.streak || 0}</Text>
            <Text style={styles.statBoxLabel}>Racha actual</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="time" size={24} color="#2196F3" />
            <Text style={styles.statBoxValue}>{progress?.totalTimeMinutes || 0}</Text>
            <Text style={styles.statBoxLabel}>Minutos de estudio</Text>
          </View>
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelBadge: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statBoxLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileScreen;