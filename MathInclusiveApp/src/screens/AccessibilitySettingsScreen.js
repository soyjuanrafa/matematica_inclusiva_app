import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProgress } from '../context/UserProgressContext';
import AccessibleButton from '../components/AccessibleButton';

const AccessibilitySettingsScreen = () => {
  const navigation = useNavigation();
  const { accessibilitySettings, updateAccessibilitySettings } = useUserProgress();
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    textToSpeech: true,
    reduceAnimations: false,
    vibration: true,
  });

  useEffect(() => {
    if (accessibilitySettings) {
      setSettings(accessibilitySettings);
    }
  }, [accessibilitySettings]);

  const handleSave = async () => {
    await updateAccessibilitySettings(settings);
    navigation.goBack();
  };

  const toggleSwitch = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setFontSize = (size) => {
    setSettings(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accesibilidad - Cuenta Conmigo</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Tamaño de texto
        </Text>
        <View style={styles.fontSizeOptions}>
          <TouchableOpacity
            style={[
              styles.fontSizeOption,
              settings.fontSize === 'small' && styles.selectedOption
            ]}
            onPress={() => setFontSize('small')}
            accessibilityLabel="Tamaño de texto pequeño"
          >
            <Text style={styles.fontSizeText}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.fontSizeOption,
              settings.fontSize === 'medium' && styles.selectedOption
            ]}
            onPress={() => setFontSize('medium')}
            accessibilityLabel="Tamaño de texto mediano"
          >
            <Text style={[styles.fontSizeText, { fontSize: 20 }]}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.fontSizeOption,
              settings.fontSize === 'large' && styles.selectedOption
            ]}
            onPress={() => setFontSize('large')}
            accessibilityLabel="Tamaño de texto grande"
          >
            <Text style={[styles.fontSizeText, { fontSize: 24 }]}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.fontSizeOption,
              settings.fontSize === 'xlarge' && styles.selectedOption
            ]}
            onPress={() => setFontSize('xlarge')}
            accessibilityLabel="Tamaño de texto extra grande"
          >
            <Text style={[styles.fontSizeText, { fontSize: 28 }]}>A</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Visualización
        </Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Alto contraste</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.highContrast ? "#6200EE" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch('highContrast')}
            value={settings.highContrast}
            accessibilityLabel="Alto contraste"
            accessibilityHint="Activa el modo de alto contraste para mejorar la visibilidad"
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Reducir animaciones</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.reduceAnimations ? "#6200EE" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch('reduceAnimations')}
            value={settings.reduceAnimations}
            accessibilityLabel="Reducir animaciones"
            accessibilityHint="Reduce las animaciones para mejorar el rendimiento y reducir distracciones"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Audio y tacto
        </Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Lectura de texto</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.textToSpeech ? "#6200EE" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch('textToSpeech')}
            value={settings.textToSpeech}
            accessibilityLabel="Lectura de texto"
            accessibilityHint="Activa la lectura automática de textos e instrucciones"
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Vibración</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.vibration ? "#6200EE" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch('vibration')}
            value={settings.vibration}
            accessibilityLabel="Vibración"
            accessibilityHint="Activa la retroalimentación táctil al presionar botones"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <AccessibleButton
          title="Guardar cambios"
          onPress={handleSave}
          accessibilityLabel="Guardar cambios de accesibilidad"
          style={styles.saveButton}
        />
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
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  fontSizeOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#6200EE',
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButton: {
    width: '80%',
  },
});

export default AccessibilitySettingsScreen;