import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProgress } from './UserProgressContext';

const CharacterContext = createContext(null);

export const CharacterProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);
  // get access to setUserLevel from UserProgressContext (provider is wrapped outside in App.js)
  let setUserLevel = null;
  try {
    const progressCtx = useUserProgress();
    setUserLevel = progressCtx?.setUserLevel;
  } catch (e) {
    // If UserProgressContext is not available, we'll skip level updates
  }
  const STORAGE_KEY = '@selected_character';

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSelected(JSON.parse(raw));
      } catch (e) {
        console.debug('Failed loading character', e);
      }
    })();
  }, []);

  const selectCharacter = async (char) => {
    try {
      setSelected(char);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(char));
      // If the user progress context is available, update level
      try {
        if (setUserLevel && char && typeof char.level === 'number') {
          setUserLevel(char.level);
        }
      } catch (e) {
        console.debug('Failed updating user level from CharacterContext', e);
      }
    } catch (e) {
      console.debug('Failed saving character', e);
    }
  };

  const clearCharacter = async () => {
    try {
      setSelected(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.debug('Failed clearing character', e);
    }
  };

  return (
    <CharacterContext.Provider value={{ selected, selectCharacter, clearCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
};

export default CharacterContext;
