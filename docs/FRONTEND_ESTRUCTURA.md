# Documentación del Frontend - Cuenta Conmigo

## Proyecto: Aplicación Móvil de Matemáticas Inclusivas
**Versión**: 1.0  
**Fecha**: Octubre 2025  
**Framework**: React Native + Expo

---

## Índice
1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Componentes Principales](#componentes-principales)
4. [Gestión de Estado](#gestión-de-estado)
5. [Navegación](#navegación)
6. [Características de Accesibilidad](#características-de-accesibilidad)
7. [Integración con Backend](#integración-con-backend)
8. [Estilos y Temas](#estilos-y-temas)

---

## Visión General

El frontend de "Cuenta Conmigo" es una aplicación móvil desarrollada con **React Native 0.73** y **Expo 50**, diseñada para proporcionar una experiencia educativa inclusiva y accesible para estudiantes de matemáticas, especialmente aquellos con discapacidades.

### Principios de Diseño
- **Mobile-First**: Optimizado para dispositivos móviles (iOS y Android)
- **Accesibilidad**: Text-to-speech, alto contraste, fuentes legibles
- **Interactividad**: Ejercicios dinámicos con feedback inmediato
- **Inclusión**: Personajes diversos y representativos
- **Gamificación**: Sistema de recompensas y logros

---

## Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── AccessibleButton.js     # Botón accesible con TTS
│   ├── LessonCard.js           # Card de lección
│   ├── NumericInputExercise.js # Ejercicio de input numérico
│   ├── DragDropExercise.js     # Ejercicio drag & drop
│   └── PlaceholderImage.js     # Imagen placeholder
│
├── screens/                 # Pantallas completas
│   ├── WelcomeScreen.js          # Pantalla de bienvenida
│   ├── LoginScreen.js            # Login y registro
│   ├── HomeScreen.js             # Dashboard principal
│   ├── LessonSelectionScreen.js  # Selección de lecciones
│   ├── LessonScreen.js           # Lección interactiva
│   ├── LessonCompletionScreen.js # Completación con stats
│   ├── ProfileScreen.js          # Perfil del usuario
│   ├── RewardsScreen.js          # Recompensas y logros
│   ├── CharacterScreen.js        # Selección de personaje
│   └── AccessibilitySettingsScreen.js # Configuración accesibilidad
│
├── context/                 # Gestión de estado global
│   ├── AuthContext.js          # Autenticación y usuario
│   ├── UserProgressContext.js  # Progreso del usuario
│   └── CharacterContext.js     # Personaje seleccionado
│
├── navigation/              # Configuración de navegación
│   └── AppNavigator.js         # Stack y Tab Navigator
│
├── services/                # Servicios y APIs
│   └── apiService.js           # Cliente Axios configurado
│
├── utils/                   # Utilidades
│   ├── validators.js           # Validación de formularios
│   └── accessibilityHelpers.js # Helpers de accesibilidad
│
└── theme.js                 # Tema y constantes de diseño
```

---

## Componentes Principales

### 1. AccessibleButton
**Ubicación**: `src/components/AccessibleButton.js`

Botón reutilizable con soporte completo de accesibilidad:
- Text-to-speech integrado
- Alto contraste
- Feedback visual y auditivo
- Touch areas optimizadas

**Uso:**
```jsx
<AccessibleButton
  title="Completar Lección"
  onPress={handleComplete}
  variant="primary"
  accessibilityLabel="Botón para completar la lección actual"
  speak={true}
/>
```

### 2. LessonCard
**Ubicación**: `src/components/LessonCard.js`

Card visual para mostrar información de lecciones:
- Thumbnail de lección
- Nivel de dificultad
- Estado de completación
- Indicador de progreso

**Uso:**
```jsx
<LessonCard
  lesson={lessonData}
  progress={progressData}
  onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
/>
```

### 3. NumericInputExercise
**Ubicación**: `src/components/NumericInputExercise.js`

Ejercicio interactivo para respuestas numéricas:
- Input numérico con teclado optimizado
- Validación en tiempo real
- Feedback visual de correcto/incorrecto
- Hints opcionales

### 4. DragDropExercise
**Ubicación**: `src/components/DragDropExercise.js`

Ejercicio de arrastrar y soltar:
- Drag & drop con react-native-gesture-handler
- Animaciones suaves
- Feedback háptico
- Soporte para accesibilidad

---

## Gestión de Estado

### Context API

El estado global se gestiona con **React Context API** dividido en tres contextos principales:

#### 1. AuthContext
**Ubicación**: `src/context/AuthContext.js`

Maneja autenticación y datos del usuario:
```javascript
const {
  user,           // Objeto de usuario actual
  token,          // JWT token
  isAuthenticated,// Estado de autenticación
  login,          // Función para iniciar sesión
  register,       // Función para registrarse
  logout,         // Función para cerrar sesión
  updateProfile   // Actualizar perfil
} = useAuth();
```

**Responsabilidades:**
- Gestión de JWT token
- Persistencia de sesión con AsyncStorage
- Login/logout
- Actualización de perfil

#### 2. UserProgressContext
**Ubicación**: `src/context/UserProgressContext.js`

Gestiona el progreso educativo del usuario:
```javascript
const {
  progress,        // Array de progreso de lecciones
  stats,           // Estadísticas globales
  fetchProgress,   // Obtener progreso del servidor
  updateProgress,  // Actualizar progreso de lección
  addReward        // Agregar recompensa ganada
} = useProgress();
```

**Responsabilidades:**
- Sincronización con backend
- Cache local de progreso
- Cálculo de estadísticas
- Gestión de recompensas

#### 3. CharacterContext
**Ubicación**: `src/context/CharacterContext.js`

Gestiona el personaje seleccionado por el usuario:
```javascript
const {
  selectedCharacter,  // Personaje actual
  setCharacter,       // Cambiar personaje
  characters          // Lista de personajes disponibles
} = useCharacter();
```

---

## Navegación

### Estructura de Navegación

La app utiliza **React Navigation 6** con dos tipos de navegadores:

#### 1. Stack Navigator (Principal)
Navegación por stack para flujo de autenticación y onboarding:
```
Stack Navigator
├─ WelcomeScreen      # Pantalla inicial
├─ LoginScreen        # Login/Registro
└─ MainTabs           # Tabs principales (autenticado)
```

#### 2. Tab Navigator (Autenticado)
Tabs inferiores para navegación principal:
```
Tab Navigator
├─ Home               # Dashboard
├─ Lessons            # Lecciones disponibles
├─ Rewards            # Logros y recompensas
└─ Profile            # Perfil y configuración
```

#### Deep Linking
Soporte para deep links:
```javascript
// Abrir lección específica
cuentaconmigo://lesson/5

// Abrir recompensas
cuentaconmigo://rewards
```

---

## Características de Accesibilidad

### 1. Text-to-Speech (TTS)
**Implementación**: `expo-speech`

Lectura de texto en voz alta:
```javascript
import * as Speech from 'expo-speech';

const speak = (text) => {
  Speech.speak(text, {
    language: 'es-ES',
    pitch: 1.0,
    rate: 0.8
  });
};
```

**Activación:**
- Configuración en AccessibilitySettingsScreen
- Persistido en AsyncStorage y backend
- Activado por defecto para usuarios que lo necesiten

### 2. Alto Contraste
Modo de alto contraste para usuarios con baja visión:
```javascript
const highContrastColors = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#FFFF00',
  secondary: '#00FFFF'
};
```

### 3. Fuentes Legibles
Fuentes diseñadas para accesibilidad:
- **Atkinson Hyperlegible**: Para usuarios con baja visión
- **Fredoka**: Amigable para niños
- **Poppins**: Moderna y legible

Configuración en `theme.js`:
```javascript
fonts: {
  regular: 'Poppins-Regular',
  bold: 'Poppins-Bold',
  accessible: 'Atkinson-Hyperlegible'
}
```

### 4. Tamaños de Fuente Ajustables
Tres tamaños configurables:
- **Pequeño**: 14px base
- **Mediano**: 16px base (default)
- **Grande**: 20px base

### 5. Navegación por Voz
Comandos de voz para navegación (futuro):
- "Siguiente lección"
- "Repetir instrucciones"
- "Ir a inicio"

---

## Integración con Backend

### API Service
**Ubicación**: `src/services/apiService.js`

Cliente Axios configurado con interceptores:

```javascript
import api from '../services/apiService';

// GET request
const lessons = await api.get('/api/lessons');

// POST request con auth
const progress = await api.post('/api/progress', {
  lesson_id: 1,
  score: 95
});
```

**Características:**
- Interceptor de autenticación (agrega JWT automáticamente)
- Interceptor de errores (manejo global)
- Timeout configurado (10s)
- Retry logic para errores de red

### Sincronización Offline
AsyncStorage para cache local:
```javascript
// Guardar progreso localmente
await AsyncStorage.setItem('@progress', JSON.stringify(progress));

// Recuperar si no hay conexión
const cachedProgress = await AsyncStorage.getItem('@progress');
```

**Estrategia:**
1. Intentar request al backend
2. Si falla, usar cache local
3. Sincronizar cuando vuelva la conexión

---

## Estilos y Temas

### Sistema de Diseño
**Ubicación**: `src/theme.js`

Tema unificado con colores, espaciados y tipografía:

```javascript
export const theme = {
  colors: {
    primary: '#6C63FF',      // Púrpura principal
    secondary: '#FF6B9D',    // Rosa secundario
    success: '#4CAF50',      // Verde éxito
    warning: '#FFC107',      // Amarillo advertencia
    error: '#F44336',        // Rojo error
    background: '#F5F7FA',   // Fondo claro
    text: '#2C3E50',         // Texto principal
    textLight: '#7F8C8D',    // Texto secundario
    white: '#FFFFFF',
    black: '#000000'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 999
  },
  
  fonts: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32
    }
  }
};
```

### Styled Components Pattern
Uso de StyleSheet de React Native:

```javascript
import { StyleSheet } from 'react-native';
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md
  }
});
```

---

## Validación de Formularios

### Validators
**Ubicación**: `src/utils/validators.js`

Funciones de validación reutilizables:

```javascript
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 3 && numAge <= 100;
};
```

**Uso en LoginScreen:**
```javascript
const [errors, setErrors] = useState({});

const handleSubmit = () => {
  const newErrors = {};
  
  if (!validateEmail(email)) {
    newErrors.email = 'Email inválido';
  }
  
  if (!validatePassword(password)) {
    newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Enviar login...
};
```

---

## Mejores Prácticas Implementadas

### 1. Component Composition
Componentes pequeños y reutilizables:
```javascript
<LessonCard lesson={lesson}>
  <LessonCard.Thumbnail url={lesson.thumbnail} />
  <LessonCard.Title>{lesson.title}</LessonCard.Title>
  <LessonCard.Progress value={progress.score} />
</LessonCard>
```

### 2. Custom Hooks
Encapsulación de lógica reutilizable:
```javascript
const useLesson = (lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchLesson(lessonId);
  }, [lessonId]);
  
  return { lesson, loading };
};
```

### 3. Error Boundaries
Manejo de errores en componentes:
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error capturado:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}
```

### 4. Performance Optimization
- `React.memo` para componentes puros
- `useMemo` para cálculos costosos
- `useCallback` para funciones estables
- FlatList con `keyExtractor` y `getItemLayout`

---

## Testing

### Estructura de Tests
```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── services/
├── integration/
│   └── screens/
└── e2e/
    └── flows/
```

### Ejemplo de Test (Jest + React Native Testing Library)
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import AccessibleButton from '../AccessibleButton';

describe('AccessibleButton', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <AccessibleButton title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });
  
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AccessibleButton title="Click me" onPress={onPress} />
    );
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

---

## Deployment

### Expo Application Services (EAS)
Build y deployment en la nube:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Submit a stores
eas submit --platform android
eas submit --platform ios
```

### Over-the-Air (OTA) Updates
Actualizaciones sin pasar por app stores:
```bash
eas update --branch production
```

---

## Conclusión

El frontend de "Cuenta Conmigo" está diseñado con un enfoque en:

1. ✅ **Accesibilidad**: TTS, alto contraste, fuentes legibles
2. ✅ **Rendimiento**: Optimización de componentes y navegación
3. ✅ **Mantenibilidad**: Código limpio, componentes reutilizables
4. ✅ **Escalabilidad**: Estructura modular preparada para crecimiento
5. ✅ **Experiencia de Usuario**: Interactiva, gamificada y educativa

El stack de React Native + Expo proporciona una base sólida para desarrollo móvil multiplataforma con excelente soporte de accesibilidad.

---

**Documento generado**: Octubre 2025  
**Última actualización**: 2025-10-16  
**Autor**: Equipo de Desarrollo Cuenta Conmigo
