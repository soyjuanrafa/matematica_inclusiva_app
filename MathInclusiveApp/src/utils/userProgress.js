import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserProgress = {
  async saveProgress(data) {
    try {
      await AsyncStorage.setItem('@user_progress', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  async getProgress() {
    try {
      const progress = await AsyncStorage.getItem('@user_progress');
      return progress ? JSON.parse(progress) : {
        level: 1,
        points: 0,
        lessonsCompleted: 0,
        achievements: [],
        completedLessons: [],
        streak: 0,
        lastCompletedDate: null,
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  async updateProgress(lessonId, score) {
    try {
      const currentProgress = await this.getProgress();
      
      // Verificar si es una nueva lección completada
      const isNewLesson = !currentProgress.completedLessons.includes(lessonId);
      
      // Actualizar racha diaria
      const today = new Date().toDateString();
      const lastDate = currentProgress.lastCompletedDate;
      let streak = currentProgress.streak || 0;
      
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (today === lastDate) {
          // Ya completó una lección hoy, mantener racha
        } else if (yesterdayString === lastDate) {
          // Completó una lección ayer, incrementar racha
          streak += 1;
        } else {
          // Rompió la racha
          streak = 1;
        }
      } else {
        // Primera lección completada
        streak = 1;
      }
      
      const updatedProgress = {
        ...currentProgress,
        points: currentProgress.points + score,
        lessonsCompleted: isNewLesson ? currentProgress.lessonsCompleted + 1 : currentProgress.lessonsCompleted,
        completedLessons: isNewLesson ? [...currentProgress.completedLessons, lessonId] : currentProgress.completedLessons,
        lastCompletedDate: today,
        streak: streak,
      };
      
      // Level up logic
      if (updatedProgress.points >= (currentProgress.level * 100)) {
        updatedProgress.level = currentProgress.level + 1;
      }
      
      // Verificar logros
      updatedProgress.achievements = this.checkAchievements(updatedProgress);

      await this.saveProgress(updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  },
  
  checkAchievements(progress) {
    const achievements = progress.achievements || [];
    const achievementDefinitions = [
      {
        id: 1,
        title: 'Primeros pasos',
        description: 'Completa tu primera lección',
        icon: '🏆',
        condition: (p) => p.lessonsCompleted >= 1
      },
      {
        id: 2,
        title: 'Matemático novato',
        description: 'Completa 5 lecciones',
        icon: '🥉',
        condition: (p) => p.lessonsCompleted >= 5
      },
      {
        id: 3,
        title: 'Matemático intermedio',
        description: 'Completa 15 lecciones',
        icon: '🥈',
        condition: (p) => p.lessonsCompleted >= 15
      },
      {
        id: 4,
        title: 'Matemático experto',
        description: 'Completa 30 lecciones',
        icon: '🥇',
        condition: (p) => p.lessonsCompleted >= 30
      },
      {
        id: 5,
        title: 'Perfección',
        description: 'Obtén una puntuación perfecta en una lección',
        icon: '⭐',
        condition: (p) => p.perfectScores && p.perfectScores > 0
      },
      {
        id: 6,
        title: 'Racha ganadora',
        description: 'Completa lecciones durante 5 días seguidos',
        icon: '🔥',
        condition: (p) => p.streak >= 5
      },
    ];
    
    // Verificar cada logro
    achievementDefinitions.forEach(achievement => {
      const existingAchievement = achievements.find(a => a.id === achievement.id);
      
      if (!existingAchievement && achievement.condition(progress)) {
        // Nuevo logro desbloqueado
        achievements.push({
          ...achievement,
          earned: true,
          date: new Date().toLocaleDateString()
        });
      }
    });
    
    return achievements;
  },
  
  async resetProgress() {
    try {
      await AsyncStorage.removeItem('@user_progress');
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  },
  
  async getAccessibilitySettings() {
    try {
      const settings = await AsyncStorage.getItem('@accessibility_settings');
      return settings ? JSON.parse(settings) : {
        fontSize: 'medium',
        highContrast: false,
        textToSpeech: true,
        reduceAnimations: false
      };
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
      return null;
    }
  },
  
  async saveAccessibilitySettings(settings) {
    try {
      await AsyncStorage.setItem('@accessibility_settings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
      return false;
    }
  }
};