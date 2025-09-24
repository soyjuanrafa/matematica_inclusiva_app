import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CharacterScreen = ({ navigation }) => {
  const progressPercent = 60; // sample value, can be wired to state/context

  return (
    <SafeAreaView style={styles.page}>
      <View style={[styles.card, { backgroundColor: '#4daafc' }]}>
        <View style={styles.header}>
          <Image source={require('../../assets/character-square.png')} style={styles.characterImage} />
          <Text style={styles.name}>Ciro</Text>
          <Text style={styles.level}>Nivel Medio Fácil</Text>

          <View style={styles.progress} accessibilityLabel="Progreso">
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
        </View>

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
          <TouchableOpacity onPress={() => navigation.navigate('Lesson')}><Text style={styles.navIcon}>📘</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Rewards')}><Text style={styles.navIcon}>🏆</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}><Text style={styles.navIcon}>👤</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.navIcon}>⋮</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f0f0f0' },
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
  characterImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 12,
    backgroundColor: 'white'
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  level: {
    fontSize: 16,
    color: 'white'
  },
  progress: {
    width: '80%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10
  },
  sectionTitle: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 18,
    color: 'white'
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10
  },
  iconBox: {
    width: 70,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  iconEmoji: { fontSize: 26 },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 15
  },
  navIcon: { fontSize: 22 }
});

export default CharacterScreen;
