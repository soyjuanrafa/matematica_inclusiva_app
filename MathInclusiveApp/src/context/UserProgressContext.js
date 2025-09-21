import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProgress } from '../utils/userProgress';

// Crear el contexto
const UserProgressContext = createContext();

// Hook personalizado para usar el contexto
export const useUserProgress = () => useContext(UserProgressContext);

// Proveedor del contexto
export const UserProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessibilitySettings, setAccessibilitySettings] = useState(null);

  // Cargar progreso al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userProgress = await UserProgress.getProgress();
        const settings = await UserProgress.getAccessibilitySettings();
        
        setProgress(userProgress);
        setAccessibilitySettings(settings);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Actualizar progreso
  const updateUserProgress = async (lessonId, score) => {
    const updatedProgress = await UserProgress.updateProgress(lessonId, score);
    setProgress(updatedProgress);
    return updatedProgress;
  };

  // Actualizar configuración de accesibilidad
  const updateAccessibilitySettings = async (newSettings) => {
    await UserProgress.saveAccessibilitySettings(newSettings);
    setAccessibilitySettings(newSettings);
  };

  // Reiniciar progreso
  const resetUserProgress = async () => {
    await UserProgress.resetProgress();
    const newProgress = await UserProgress.getProgress();
    setProgress(newProgress);
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        loading,
        accessibilitySettings,
        updateUserProgress,
        updateAccessibilitySettings,
        resetUserProgress
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};