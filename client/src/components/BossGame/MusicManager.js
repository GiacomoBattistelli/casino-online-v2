// Music tracks - Enhanced gaming experience
const MUSIC_TRACKS = {
  menu: "/audio/menu.wav",
  intro: "/audio/intro.wav", 
  tension: "/audio/tension.wav",
  battle: "/audio/battle.wav",
  boss_battle: "/audio/boss_battle.wav",
  victory: "/audio/victory.wav",
  defeat: "/audio/defeat.wav",
  emotional: "/audio/emotional.wav",
  final_battle: "/audio/final_battle.wav",
  // Nuove tracce per atmosfere diverse
  ambient: "/audio/ambient.wav",
  exploration: "/audio/exploration.wav",
  mystery: "/audio/mystery.wav",
  hope: "/audio/hope.wav",
  despair: "/audio/despair.wav"
};

class MusicManager {
  constructor() {
    this.currentMusic = null;
    this.volume = 50;
    this.isInitialized = false;
    this.audioContext = null;
    this.audioElements = {};
    this.isAudioEnabled = false;
    this.currentTrack = null;
    this.backgroundMusic = null;
    this.isBackgroundPlaying = false;
    this.fadeInterval = null;
    this.initializeAudio();
  }

  async initializeAudio() {
    try {
      // Create audio context for better control
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        // eslint-disable-next-line no-undef
        this.audioContext = new (AudioContext || webkitAudioContext)();
      }
      
      // Preload all audio files
      for (const [track, url] of Object.entries(MUSIC_TRACKS)) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        audio.loop = true;
        audio.volume = this.volume / 100;
        
        // Add event listeners for better error handling
        audio.addEventListener('error', (e) => {
          console.log(`Audio file not found for ${track}: ${url}`);
        });
        
        audio.addEventListener('canplaythrough', () => {
          console.log(`Audio loaded: ${track}`);
        });
        
        this.audioElements[track] = audio;
      }
      
      this.isInitialized = true;
      console.log('MusicManager initialized successfully');
    } catch (error) {
      console.log('Audio initialization error:', error);
    }
  }

  setVolume(volume) {
    this.volume = volume;
    const volumeLevel = volume / 100;
    
    // Update current music volume
    if (this.currentMusic) {
      this.currentMusic.volume = volumeLevel;
    }
    
    // Update background music volume
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = volumeLevel * 0.3; // Background music più basso
    }
    
    // Update all preloaded audio elements
    Object.values(this.audioElements).forEach(audio => {
      audio.volume = volumeLevel;
    });
  }

  // Nuovo metodo per la musica di sottofondo
  async playBackground(track) {
    if (!this.isInitialized) {
      console.log('MusicManager not initialized yet');
      return;
    }
    
    try {
      // Se la stessa traccia di sottofondo è già in riproduzione, non fare nulla
      if (this.backgroundMusic && this.backgroundMusic.src.includes(track) && !this.backgroundMusic.paused) {
        return;
      }
      
      // Ferma la musica di sottofondo precedente con fade out
      if (this.backgroundMusic) {
        this.fadeOutBackground();
      }
      
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Get the audio element for this track
      const audio = this.audioElements[track];
      if (!audio) {
        console.log(`Background track not found: ${track}`);
        return;
      }
      
      // Set source if not already set
      if (!audio.src) {
        audio.src = MUSIC_TRACKS[track];
      }
      
      // Set volume (background music più basso)
      audio.volume = (this.volume / 100) * 0.3;
      audio.loop = true;
      
      // Play with fade in
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Background music started: ${track}`);
              this.backgroundMusic = audio;
              this.isBackgroundPlaying = true;
              this.fadeInBackground();
            })
            .catch(error => {
              console.log(`Background audio play failed for ${track}:`, error);
            });
        }
      }
      
    } catch (error) {
      console.log('Background audio error:', error);
    }
  }

  // Fade in per la musica di sottofondo
  fadeInBackground() {
    if (!this.backgroundMusic) return;
    
    this.backgroundMusic.volume = 0;
    let volume = 0;
    const targetVolume = (this.volume / 100) * 0.3;
    const fadeStep = targetVolume / 50; // 50 steps per 2.5 secondi
    
    this.fadeInterval = setInterval(() => {
      volume += fadeStep;
      if (volume >= targetVolume) {
        volume = targetVolume;
        clearInterval(this.fadeInterval);
      }
      this.backgroundMusic.volume = volume;
    }, 50);
  }

  // Fade out per la musica di sottofondo
  fadeOutBackground() {
    if (!this.backgroundMusic || !this.isBackgroundPlaying) return;
    
    let volume = this.backgroundMusic.volume;
    const fadeStep = volume / 30; // 30 steps per 1.5 secondi
    
    const fadeOutInterval = setInterval(() => {
      volume -= fadeStep;
      if (volume <= 0) {
        volume = 0;
        clearInterval(fadeOutInterval);
        this.stopBackground();
      }
      this.backgroundMusic.volume = volume;
    }, 50);
  }

  // Ferma la musica di sottofondo
  stopBackground() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isBackgroundPlaying = false;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
  }

  async play(track) {
    if (!this.isInitialized) {
      console.log('MusicManager not initialized yet');
      return;
    }
    
    try {
      // Don't restart if the same track is already playing
      if (this.currentTrack === track && this.currentMusic && !this.currentMusic.paused) {
        console.log(`Music already playing: ${track}`);
        return;
      }
      
      // Stop current music only if it's different
      if (this.currentTrack !== track) {
        this.stop();
      }
      
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Get the audio element for this track
      const audio = this.audioElements[track];
      if (!audio) {
        console.log(`Track not found: ${track}`);
        return;
      }
      
      // Set source if not already set
      if (!audio.src) {
        audio.src = MUSIC_TRACKS[track];
      }
      
      // Set volume and play
      audio.volume = this.volume / 100;
      audio.loop = true;
      
      // Only play if not already playing
      if (audio.paused) {
        // Handle audio play promise with better error handling
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Music started: ${track}`);
              this.currentMusic = audio;
              this.currentTrack = track;
            })
            .catch(error => {
              console.log(`Audio play failed for ${track}:`, error);
            });
        }
      } else {
        console.log(`Music already playing: ${track}`);
        this.currentMusic = audio;
        this.currentTrack = track;
      }
      
    } catch (error) {
      console.log('Audio error:', error);
    }
  }

  stop() {
    try {
      if (this.currentMusic) {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
        this.currentMusic = null;
        this.currentTrack = null;
      }
    } catch (error) {
      console.log('Stop error:', error);
    }
  }

  pause() {
    try {
      if (this.currentMusic) {
        this.currentMusic.pause();
      }
      if (this.backgroundMusic) {
        this.backgroundMusic.pause();
      }
    } catch (error) {
      console.log('Pause error:', error);
    }
  }

  resume() {
    try {
      if (this.currentMusic) {
        this.currentMusic.play();
      }
      if (this.backgroundMusic && this.isBackgroundPlaying) {
        this.backgroundMusic.play();
      }
    } catch (error) {
      console.log('Resume error:', error);
    }
  }

  enableAudio() {
    try {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.isAudioEnabled = true;
    } catch (error) {
      console.log('Enable audio error:', error);
    }
  }

  getAudioStatus() {
    return {
      isEnabled: this.isAudioEnabled,
      isPlaying: this.currentMusic ? !this.currentMusic.paused : false,
      currentTrack: this.currentTrack,
      volume: this.volume,
      backgroundPlaying: this.isBackgroundPlaying
    };
  }

  isAudioWorking() {
    return this.isInitialized && this.isAudioEnabled;
  }
}

export default MusicManager; 