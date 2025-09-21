import { Audio } from 'expo-av';

export const SoundService = {
  sounds: {},
  
  async loadSounds() {
    try {
      // Unload any existing sounds first to prevent memory leaks
      await this.unloadSounds();
      
      const correctSound = new Audio.Sound();
      const incorrectSound = new Audio.Sound();
      const buttonSound = new Audio.Sound();
      const achievementSound = new Audio.Sound();
      
      await correctSound.loadAsync(require('../../assets/sounds/correct.mp3'));
      await incorrectSound.loadAsync(require('../../assets/sounds/incorrect.mp3'));
      await buttonSound.loadAsync(require('../../assets/sounds/button.mp3'));
      await achievementSound.loadAsync(require('../../assets/sounds/achievement.mp3'));
      
      this.sounds = {
        correct: correctSound,
        incorrect: incorrectSound,
        button: buttonSound,
        achievement: achievementSound
      };
      
      console.log('Sounds loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading sounds:', error);
      // Reset sounds object to prevent partial loading issues
      this.sounds = {};
      return false;
    }
  },
  
  async playSound(soundName, volume = 1.0) {
    try {
      if (this.sounds[soundName]) {
        // Check if sound is loaded
        const status = await this.sounds[soundName].getStatusAsync();
        if (!status.isLoaded) {
          console.warn(`Sound ${soundName} is not loaded, attempting to reload`);
          await this.loadSounds();
        }
        
        // Reset the sound to the beginning
        await this.sounds[soundName].setPositionAsync(0);
        // Set volume
        await this.sounds[soundName].setVolumeAsync(volume);
        // Play the sound
        await this.sounds[soundName].playAsync();
      } else {
        console.warn(`Sound ${soundName} not found`);
      }
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }
  },
  
  async unloadSounds() {
    try {
      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.unloadAsync();
          }
        }
      }
      this.sounds = {};
      console.log('Sounds unloaded successfully');
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
};