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
  final_battle: "/audio/final_battle.wav"
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
    
    // Update all preloaded audio elements
    Object.values(this.audioElements).forEach(audio => {
      audio.volume = volumeLevel;
    });
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
      }
      this.currentTrack = null;
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  }

  pause() {
    try {
      if (this.currentMusic) {
        this.currentMusic.pause();
      }
    } catch (error) {
      console.log('Error pausing audio:', error);
    }
  }

  resume() {
    try {
      if (this.currentMusic) {
        this.currentMusic.play().catch(error => {
          console.log('Resume failed:', error);
        });
      }
    } catch (error) {
      console.log('Error resuming audio:', error);
    }
  }

  // Method to enable audio on user interaction
  enableAudio() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.isAudioEnabled = true;
    console.log('Audio enabled');
  }

  // Get audio status
  getAudioStatus() {
    return {
      isEnabled: this.isAudioEnabled,
      isPlaying: this.currentMusic !== null,
      currentTrack: this.currentTrack,
      volume: this.volume,
      isInitialized: this.isInitialized
    };
  }

  // Check if audio is working
  isAudioWorking() {
    return this.isAudioEnabled && this.isInitialized;
  }
}

export default MusicManager; 