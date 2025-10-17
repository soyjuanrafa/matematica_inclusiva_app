import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Animated, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCharacter } from '../context/CharacterContext';
import { COLORS, FONTS } from '../theme';

const CHARACTERS = [
  {
    id: 'triangle',
    name: 'Triángulo',
    displayName: 'Trii',
    role: 'Fácil',
    level: 1,
    accessories: 'Lentes grandes, Moño azul',
    personality: 'Inteligente, alegre, curioso',
    color: '#F5A623',
    shape: 'triangle',
    gender: 'female',
  },
  {
    id: 'circle',
    name: 'Círculo',
    displayName: 'Ciro',
    role: 'Medio Fácil',
    level: 2,
    accessories: 'Cuaderno/Hoja',
    personality: 'Entusiasta, creativo, expresivo',
    color: '#4A90E2',
    shape: 'circle',
    gender: 'male',
  },
  {
    id: 'square',
    name: 'Cuadrado',
    displayName: 'Quad',
    role: 'Avanzado',
    level: 3,
    color: '#7B61FF',
    accent: '#F5A623',
    accessories: 'Gorra naranja',
    personality: 'Divertido, relajado, amistoso',
    shape: 'square',
    gender: 'male',
  }
];

const CharacterScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(CHARACTERS[1]);
  const { selectCharacter } = useCharacter();
  const [pending, setPending] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const bounce = useRef(new Animated.Value(1)).current;
  const progressPercent = 60;

  const renderShape = (char, size = 150) => {
    const color = char.color;
    if (char.shape === 'circle') {
      return (
        <View style={[styles.shapeCircle, { width: size, height: size, borderRadius: size/2, backgroundColor: color }]}>
          {renderFace(char)}
        </View>
      );
    }
    if (char.shape === 'square') {
      return (
        <View style={[styles.shapeSquare, { width: size, height: size, backgroundColor: color }]}>
          {renderFace(char)}
        </View>
      );
    }

    // triangle
    const triSize = size;
    return (
      <View style={{ width: triSize, height: triSize, alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={{ width: 0, height: 0, borderLeftWidth: triSize/2, borderRightWidth: triSize/2, borderBottomWidth: triSize, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color, transform: [{ translateY: -10 }] }} />
        <View style={{ position: 'absolute', top: triSize*0.25 }}>{renderFace(char)}</View>
      </View>
    );
  };

  const renderFace = (char) => {
    // Simple face overlay: glasses for triangle (female), confident eyes for circle, hat for square
    return (
      <View style={styles.faceContainer} pointerEvents="none">
        {/* glasses */}
        {char.id === 'triangle' && (
          <View style={styles.glasses}>
            <View style={styles.glassCircle} />
            <View style={styles.glassBridge} />
            <View style={styles.glassCircle} />
          </View>
        )}
        {/* hat */}
        {char.id === 'square' && (
          <View style={styles.hat} />
        )}
        {/* simple eyes */}
        <View style={styles.eyesRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Elegir Personaje</Text>
      </View>
      <View style={[styles.card, { backgroundColor: selected.color }]}> 
        <View style={styles.header}>
          {renderShape(selected, 150)}
          <Text style={styles.name}>{selected.displayName}</Text>
          <Text style={styles.level}>Nivel {selected.role}</Text>
          {selected.accessories && (
            <Text style={styles.smallInfo}>Accesorios: {selected.accessories}</Text>
          )}
          {selected.personality && (
            <Text style={styles.smallInfo}>Personalidad: {selected.personality}</Text>
          )}

          <View style={styles.progress} accessibilityLabel="Progreso">
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Elige un personaje</Text>
        <View style={styles.selectorRow}>
          {CHARACTERS.map((c) => {
            const isActive = selected.id === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.selector, isActive && styles.selectorActive]}
                onPress={() => {
                  // open confirmation modal for this character
                  setPending(c);
                  setConfirmVisible(true);
                }}
              >
                <Animated.View style={{ alignItems: 'center', transform: [{ scale: isActive ? bounce : 1 }] }}>
                  {c.shape === 'triangle' && <View style={[styles.miniTriangle, { borderBottomColor: c.color }]} />}
                  {c.shape === 'circle' && <View style={[styles.miniCircle, { backgroundColor: c.color }]} />}
                  {c.shape === 'square' && <View style={[styles.miniSquare, { backgroundColor: c.color }]} />}
                  <Text style={styles.selectorLabel}>{c.name}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirmation modal */}
        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirmar Personaje</Text>
              {pending && (
                <View style={{ alignItems: 'center' }}>
                  {renderShape(pending, 100)}
                  <Text style={styles.modalName}>{pending.displayName || pending.name}</Text>
                  <Text style={styles.modalRole}>{pending.role}</Text>
                  {pending.accessories && <Text style={styles.modalSmall}>Accesorios: {pending.accessories}</Text>}
                  {pending.personality && <Text style={styles.modalSmall}>Personalidad: {pending.personality}</Text>}
                </View>
              )}

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalBtn, styles.modalCancel]}
                  onPress={() => { setConfirmVisible(false); setPending(null); }}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.modalConfirm]}
                  onPress={() => {
                    if (pending) {
                      try {
                        selectCharacter(pending);
                      } catch (e) {
                          console.debug('Error selecting character', e);
                      }
                      setSelected(pending);
                      // bounce animation
                      Animated.sequence([
                        Animated.timing(bounce, { toValue: 1.12, duration: 120, useNativeDriver: true }),
                        Animated.timing(bounce, { toValue: 1, duration: 180, useNativeDriver: true })
                      ]).start();
                    }
                    setConfirmVisible(false);
                    setPending(null);
                  }}
                >
                  <Text style={{ color: 'white' }}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.rowCenter}>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>🏅</Text></View>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>❓</Text></View>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>🥈</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Lección Completada</Text>
        <View style={styles.rowCenter}>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>➕</Text></View>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>🔺</Text></View>
          <View style={styles.iconBox}><Text style={styles.iconEmoji}>❓</Text></View>
        </View>

        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')}><Text style={styles.navIcon}>🏠</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Lessons' })}><Text style={styles.navIcon}>📘</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Rewards')}><Text style={styles.navIcon}>🏆</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Profile' })}><Text style={styles.navIcon}>👤</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.navIcon}>⋮</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f0f0f0' },
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
  card: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    paddingBottom: 20,
    paddingTop: 10
  },
  header: {
    alignItems: 'center',
    padding: 20
  },
  shapeCircle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  shapeSquare: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  faceContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  eyesRow: { flexDirection: 'row', marginTop: 6 },
  eye: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.7)', marginHorizontal: 6 },
  glasses: { flexDirection: 'row', alignItems: 'center', marginTop: -6 },
  glassCircle: { width: 28, height: 24, borderRadius: 14, borderWidth: 3, borderColor: 'rgba(0,0,0,0.6)', marginHorizontal: 6 },
  glassBridge: { width: 20, height: 6, backgroundColor: 'rgba(0,0,0,0.6)', marginHorizontal: -6 },
  hat: { width: 80, height: 22, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, marginBottom: 6 },
  name: { marginTop: 10, fontSize: 24, fontWeight: 'bold', color: 'white', fontFamily: FONTS.logo },
  level: { fontSize: 16, color: 'white', fontFamily: FONTS.content },
  progress: { width: '80%', height: 12, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 10, marginTop: 10, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: 'white', borderRadius: 10 },
  sectionTitle: { marginLeft: 20, marginTop: 20, fontSize: 18, color: 'white', fontFamily: FONTS.content },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  iconBox: { width: 70, height: 90, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  iconEmoji: { fontSize: 26 },
  navbar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f9f9f9', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 15 },
  navIcon: { fontSize: 22 },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10, marginTop: 10 },
  selector: { padding: 8, borderRadius: 10 },
  selectorActive: { borderWidth: 2, borderColor: '#fff' },
  selectorLabel: { marginTop: 6, color: 'white' },
  miniCircle: { width: 48, height: 48, borderRadius: 24 },
  miniSquare: { width: 48, height: 48, borderRadius: 8 },
  miniTriangle: { width: 0, height: 0, borderLeftWidth: 24, borderRightWidth: 24, borderBottomWidth: 48, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  smallInfo: { marginTop: 6, color: 'white', fontSize: 14, fontFamily: FONTS.content },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '84%', backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalName: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  modalRole: { fontSize: 13, color: '#666', marginBottom: 6 },
  modalSmall: { fontSize: 13, color: '#444', textAlign: 'center' },
  modalButtons: { flexDirection: 'row', marginTop: 12 },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 8 },
  modalCancel: { backgroundColor: '#eee' },
  modalConfirm: { backgroundColor: COLORS.primary },
});

export default CharacterScreen;
