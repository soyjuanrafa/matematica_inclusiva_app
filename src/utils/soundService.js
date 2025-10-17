import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export const SoundService = {
  sounds: {},

  async loadSounds() {
    try {
      // Skip sound loading on web
      if (Platform.OS === 'web') {
        console.debug('SoundService: Skipping sound loading on web platform');
        this.sounds = {};
        return true;
      }

      // If we've already loaded sounds, skip reloading
      if (this.sounds && Object.keys(this.sounds).length > 0) {
        console.debug('Sounds already loaded, skipping reload');
        return true;
      }

      const tryLoad = async (soundInstance, assetRequire) => {
        try {
          await soundInstance.loadAsync(assetRequire);
          return soundInstance;
        } catch (err) {
          console.debug('Could not load sound asset (ignored):', err.message || err);
          return null;
        }
      };

      // Create sound instances
      const correctSound = new Audio.Sound();
      const incorrectSound = new Audio.Sound();
      const buttonSound = new Audio.Sound();
      const achievementSound = new Audio.Sound();

      // Load sounds individually and tolerate missing assets
      const loadedCorrect = await tryLoad(correctSound, require('../../assets/sounds/correct.mp3'));
      const loadedIncorrect = await tryLoad(incorrectSound, require('../../assets/sounds/incorrect.mp3'));
      const loadedButton = await tryLoad(buttonSound, require('../../assets/sounds/button.mp3'));

      // achievement.mp3 is optional; require inside try to allow skipping if missing
      let loadedAchievement = null;
      try {
        const achievementAsset = require('../../assets/sounds/achievement.mp3');
        loadedAchievement = await tryLoad(achievementSound, achievementAsset);
      } catch (e) {
        console.debug('Achievement sound not found, skipping.');
      }

      // Assemble sounds map only with successfully loaded sounds
      this.sounds = {};
      if (loadedCorrect) this.sounds.correct = loadedCorrect;
      if (loadedIncorrect) this.sounds.incorrect = loadedIncorrect;
      if (loadedButton) this.sounds.button = loadedButton;
      if (loadedAchievement) this.sounds.achievement = loadedAchievement;

      console.debug('SoundService: loaded sounds:', Object.keys(this.sounds));
      return true;
    } catch (error) {
      console.error('Error loading sounds:', error);
      this.sounds = {};
      return false;
    }
  },

  async playSound(soundName, volume = 1.0) {
    try {
      // Skip sound playback on web
      if (Platform.OS === 'web') {
        console.debug('SoundService: Skipping sound playback on web platform for', soundName);
        return;
      }

      const sound = this.sounds[soundName];
      if (!sound) {
        console.debug('Sound not found or not loaded');
        return;
      }

      const status = await sound.getStatusAsync();
      if (!status.isLoaded) {
        console.debug('Sound is not loaded, reloading sounds');
        await this.loadSounds();
      }

      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  },

  async unloadSounds() {
    try {
      // Skip unloading on web
      if (Platform.OS === 'web') {
        console.debug('SoundService: Skipping sound unloading on web platform');
        this.sounds = {};
        return;
      }

      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          try {
            const status = await sound.getStatusAsync();
            if (status && status.isLoaded) {
              await sound.unloadAsync();
            }
          } catch (e) {
            // ignore individual unload errors
          }
        }
      }
      this.sounds = {};
      console.debug('Sounds unloaded successfully');
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  },
};
