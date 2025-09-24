import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions
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

  const handleLogout = async () => {
    await signOut();
  };

  const percent = Math.min(100, Math.max(0, progress?.progressPercent ?? 50));
  const screenW = Dimensions.get('window').width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profile}>
          <Image
            source={require('../../assets/avatar-placeholder.png')}
            style={styles.avatar}
            accessibilityLabel="Imagen de perfil"
          />
          <Text style={styles.username}>{progress?.userName || 'Estudiante'}</Text>
          <Text style={styles.level}>Nivel {progress?.level || 1}</Text>

          <View style={styles.progress} accessibilityLabel="Barra de progreso">
            <View style={[styles.progressBar, { width: `${percent}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustes Generales</Text>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Idioma</Text>
            <Text style={styles.cardRight}>Español</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Notificaciones</Text>
            <Text style={styles.cardRight}>Activar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Sonido y música</Text>
            <Text style={styles.cardRight}>Ajustar</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, styles.highlight]}>
          <Text style={styles.sectionTitle}>Aprendizaje</Text>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Nivel de Dificultad</Text>
            <Text style={styles.cardRight}>Fácil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Recompensas Visuales</Text>
            <Text style={styles.cardRight}>Confeti</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesibilidad</Text>
          <TouchableOpacity style={styles.card} onPress={handleAccessibilityPress}>
            <Text>Audio Descriptivo</Text>
            <Text style={styles.cardRight}>Activar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Lengua de Señas LSN</Text>
            <Text style={styles.cardRight}>Mostrar intérprete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Modo de Alto Contraste</Text>
            <Text style={styles.cardRight}>Activado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Subtítulos</Text>
            <Text style={styles.cardRight}>Activar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHelp}>
          <Text style={styles.sectionTitle}>Ayuda</Text>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Tutorial</Text>
            <Text style={styles.cardRight}>Aprender</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text>Preguntas Frecuentes</Text>
            <Text style={styles.cardRight}>Soporte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <Pressable style={styles.btn} onPress={handleLogout} accessibilityLabel="Cerrar sesión">
            <Text style={styles.btnText}>Cerrar Sesión</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleLogout} accessibilityLabel="Cambiar usuario">
            <Text style={styles.btnText}>Cambiar de Usuario</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cardContainer: {
    width: Math.min(380, Dimensions.get('window').width - 20),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff'
  },
  profile: {
    alignItems: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 10
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  level: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8
  },
  progress: {
    width: '100%',
    height: 12,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4daafc'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600'
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  highlight: {
    backgroundColor: '#fffbf0',
    padding: 8,
    borderRadius: 10
  },
  sectionHelp: {
    backgroundColor: '#9c7df5',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  cardRight: {
    color: '#666'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  btn: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 14
  }
});

export default ProfileScreen;