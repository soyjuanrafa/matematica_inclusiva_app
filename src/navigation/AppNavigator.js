import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import LessonCompletionScreen from '../screens/LessonCompletionScreen';
import LessonSelectionScreen from '../screens/LessonSelectionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccessibilitySettingsScreen from '../screens/AccessibilitySettingsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import CharacterScreen from '../screens/CharacterScreen';

// Crear navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de pestañas principal
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lessons') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Inicio',
          tabBarAccessibilityLabel: 'Pantalla de inicio'
        }} 
      />
      <Tab.Screen 
        name="Lessons" 
        component={LessonSelectionScreen} 
        options={{ 
          title: 'Lecciones',
          tabBarAccessibilityLabel: 'Selección de lecciones'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Mi perfil'
        }} 
      />
    </Tab.Navigator>
  );
};

// Navegador principal de la aplicación
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="LessonCompletion" component={LessonCompletionScreen} />
        <Stack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="Character" component={CharacterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;