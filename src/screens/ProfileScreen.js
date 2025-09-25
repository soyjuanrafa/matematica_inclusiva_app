import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../context/UserProgressContext';
import { useCharacter } from '../context/CharacterContext';
import { COLORS } from '../theme';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { progress } = useUserProgress();
  const { selected: character } = useCharacter();
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [character]);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profile}>
          {character ? (
            <Animated.View style={{ transform: [{ scale }] }}>
              {character.shape === 'Triangle' ? (
                <View
                  style={[
                    styles.triangle,
                    { borderBottomColor: character.color || '#888' }
                  ]}
                  accessible
                  accessibilityLabel={`Avatar: ${character.displayName || character.name}`}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    character.shape === 'Circle' ? styles.circle : styles.square,
                    { backgroundColor: character.color || '#888' }
                  ]}
                  accessible
                  accessibilityLabel={`Avatar: ${character.displayName || character.name}`}
                />
              )}
            </Animated.View>
          ) : (
            <Image
              source={require('../../assets/avatar-placeholder.png')}
              style={styles.avatar}
              accessibilityLabel="Imagen de perfil"
            />
          )}
          <Text style={styles.username}>{progress?.userName || 'Estudiante'}</Text>
          <Text style={styles.level}>Nivel {progress?.level || 1}</Text>

          {character && (
            <View style={styles.characterDetails}>
              <Text style={styles.characterName}>{character.displayName || character.name}</Text>
              <Text style={styles.characterRole}>{character.role}</Text>
              <View style={styles.chipsRow}>
                {(character.accessories || []).map((acc, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{acc}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.personalityTitle}>Personalidad</Text>
              <Text style={styles.personalityText}>{character.personality}</Text>
            </View>
          )}

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

        <View style={styles.buttonsRow}>
          <Pressable style={styles.btn} onPress={() => navigation.navigate('Character')} accessibilityLabel="Elegir personaje">
            <Text style={styles.btnText}>Elegir Personaje</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleLogout} accessibilityLabel="Cerrar sesión">
            <Text style={styles.btnText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 8 }}>
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
    backgroundColor: COLORS.background
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
  circle: {
    borderRadius: 60
  },
  square: {
    borderRadius: 8
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 120,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 10
  },
  characterDetails: {
    alignItems: 'center',
    marginTop: 8
  },
  characterName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'FredokaRegular',
    color: '#222'
  },
  characterRole: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'PoppinsRegular'
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 6
  },
  chip: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2
  },
  chipText: {
    fontSize: 12,
    color: '#444'
  },
  personalityTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    fontFamily: 'PoppinsRegular'
  },
  personalityText: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
    fontFamily: 'PoppinsRegular'
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'FredokaRegular',
    color: '#222'
  },
  level: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
    fontFamily: 'PoppinsRegular'
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
    backgroundColor: COLORS.primary
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    fontFamily: 'PoppinsRegular',
    color: '#222'
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
    backgroundColor: COLORS.purple,
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
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
    fontSize: 14,
    fontFamily: 'PoppinsRegular'
  }
});

export default ProfileScreen;