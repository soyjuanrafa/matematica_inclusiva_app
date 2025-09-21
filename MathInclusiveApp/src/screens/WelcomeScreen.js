import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SoundService } from '../utils/soundService';
import AccessibleButton from '../components/AccessibleButton';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const [logoError, setLogoError] = useState(false);
  
  useEffect(() => {
    // Load sounds when component mounts
    try {
      SoundService.loadSounds();
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const handleGetStarted = () => {
    try {
      SoundService.playSound('button');
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    navigation.navigate('Home');
  };
  
  const handleAccessibilitySettings = () => {
    try {
      SoundService.playSound('button');
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    navigation.navigate('AccessibilitySettings');
  };
  
  const renderLogo = () => {
    if (logoError) {
      return (
        <View style={[styles.logo, {backgroundColor: '#6200EE', justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>CC</Text>
        </View>
      );
    }
    
    return (
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
        accessibilityLabel="Logo de Cuenta Conmigo"
        onError={() => setLogoError(true)}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {renderLogo()}
          <Text style={styles.title}>Bienvenido a Cuenta Conmigo</Text>
          <Text style={styles.subtitle}>Aprende matemáticas de forma divertida e inclusiva</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.featuresContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.featureItem}>
            <Ionicons name="school" size={24} color="#6200EE" />
            <Text style={styles.featureText}>Lecciones interactivas</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="accessibility" size={24} color="#6200EE" />
            <Text style={styles.featureText}>Diseño inclusivo</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="trophy" size={24} color="#6200EE" />
            <Text style={styles.featureText}>Logros y recompensas</Text>
          </View>
        </Animated.View>
      </View>
      
      <Animated.View 
        style={[
          styles.buttonsContainer,
          { opacity: fadeAnim }
        ]}
      >
        <AccessibleButton
          title="Comenzar"
          onPress={handleGetStarted}
          style={styles.startButton}
          accessibilityLabel="Comenzar a aprender"
        />
        
        <TouchableOpacity 
          style={styles.accessibilityButton}
          onPress={handleAccessibilitySettings}
          accessibilityLabel="Configurar opciones de accesibilidad"
        >
          <Ionicons name="options" size={20} color="#6200EE" />
          <Text style={styles.accessibilityButtonText}>Opciones de accesibilidad</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
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
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  buttonsContainer: {
    padding: 20,
    width: '100%',
  },
  startButton: {
    backgroundColor: '#6200EE',
    marginBottom: 15,
  },
  accessibilityButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  accessibilityButtonText: {
    color: '#6200EE',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default WelcomeScreen;