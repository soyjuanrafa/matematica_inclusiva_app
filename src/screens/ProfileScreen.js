import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Animated,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../context/UserProgressContext';
import { useCharacter } from '../context/CharacterContext';
import { COLORS } from '../theme';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { progress, updateUserName } = useUserProgress();
  const { selected: character } = useCharacter();
  const scale = useRef(new Animated.Value(0.97)).current;
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress?.userName || 'Estudiante');

  useEffect(() => {
    setTempName(progress?.userName || 'Estudiante');
  }, [progress?.userName]);

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

  const handleEditName = () => {
    setEditingName(true);
    setTempName(progress?.userName || 'Estudiante');
  };

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateUserName(tempName.trim());
      setEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setTempName(progress?.userName || 'Estudiante');
  };

  const percent = Math.min(100, Math.max(0, progress?.progressPercent ?? 50));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            {editingName ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.editNameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Ingresa tu nombre"
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.username}>{progress?.userName || 'Estudiante'}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditName}>
                  <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>
              </>
            )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
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
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
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
  },
  editNameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  editNameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default ProfileScreen;
