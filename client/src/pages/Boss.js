import React, { useState, useEffect, useCallback } from 'react';
import { Box, Dialog, Typography, Button, LinearProgress, Slider } from '@mui/material';
import MusicManager from '../components/BossGame/MusicManager';
import GameMenu from '../components/BossGame/GameMenu';
import LanguageSelect from '../components/BossGame/LanguageSelect';
import BossBattle from '../components/BossGame/BossBattle';
import BossIntro from '../components/BossGame/BossIntro';
import { GAME_STATES, BOSSES, TRANSLATIONS } from '../components/BossGame/GameData';

const Boss = ({ saldo, updateSaldo }) => {
  // Game State
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [language, setLanguage] = useState('it');
  const [musicManager] = useState(() => new MusicManager());
  
  // Game Progress
  const [gameProgress, setGameProgress] = useState(() => {
    const saved = localStorage.getItem('bossGameProgress');
    const parsed = saved ? JSON.parse(saved) : {
      currentLevel: 1,
      willpower: 100,
      health: 100,
      experience: 0,
      defeatedBosses: [],
      playerPower: 1, // New: player power level
      maxHealth: 100 // New: player max health
    };
    
    // Ensure currentLevel doesn't exceed available chapters
    const chapterKeys = Object.keys(TRANSLATIONS.it.chapters);
    if (parsed.currentLevel > chapterKeys.length) {
      parsed.currentLevel = chapterKeys.length;
    }
    
    return parsed;
  });

  // Player Stats
  const [playerStats, setPlayerStats] = useState({
    willpower: gameProgress.willpower,
    health: gameProgress.health,
    experience: gameProgress.experience,
    power: gameProgress.playerPower || 1, // New: player power level
    maxHealth: gameProgress.maxHealth || 100 // New: player max health
  });

  // Battle States
  const [currentBoss, setCurrentBoss] = useState(null);
  const [bossHealth, setBossHealth] = useState(100);
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 200 });
  const [bossPosition, setBossPosition] = useState({ x: 700, y: 200 });
  const [projectiles, setProjectiles] = useState([]);
  const [bossProjectiles, setBossProjectiles] = useState([]);
  const [playerAttackCooldown, setPlayerAttackCooldown] = useState(0);
  const [bossAttackCooldown, setBossAttackCooldown] = useState(0);
  const [playerAnimation, setPlayerAnimation] = useState('idle');
  const [bossAnimation, setBossAnimation] = useState('idle');
  const [healthPickups, setHealthPickups] = useState([]); // New: health pickups
  const [showStats, setShowStats] = useState(false); // New: stats menu toggle
  const [bossPhaseDialog, setBossPhaseDialog] = useState(null); // New: boss phase dialog
  const [isPhaseTransition, setIsPhaseTransition] = useState(false); // New: phase transition
  const [lastPhaseTransition, setLastPhaseTransition] = useState(null); // New: track last transition


  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [choices, setChoices] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogAnimation, setDialogAnimation] = useState('fadeIn');

  // Pause Menu
  const [pauseOpen, setPauseOpen] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  
  // Boss Intro
  const [showBossIntro, setShowBossIntro] = useState(false);
  const [currentBossForIntro, setCurrentBossForIntro] = useState(null);

  // Translations
  const t = TRANSLATIONS[language];

  // Save Progress
  const saveProgress = useCallback(() => {
    const progress = {
      ...gameProgress,
      willpower: playerStats.willpower,
      health: playerStats.health,
      experience: playerStats.experience,
      playerPower: playerStats.power,
      maxHealth: playerStats.maxHealth
    };
    localStorage.setItem('bossGameProgress', JSON.stringify(progress));
  }, [gameProgress, playerStats]);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudioOnInteraction = () => {
      musicManager.enableAudio();
      document.removeEventListener('click', enableAudioOnInteraction);
      document.removeEventListener('keydown', enableAudioOnInteraction);
      document.removeEventListener('touchstart', enableAudioOnInteraction);
    };
    
    document.addEventListener('click', enableAudioOnInteraction);
    document.addEventListener('keydown', enableAudioOnInteraction);
    document.addEventListener('touchstart', enableAudioOnInteraction);
    
    return () => {
      document.removeEventListener('click', enableAudioOnInteraction);
      document.removeEventListener('keydown', enableAudioOnInteraction);
      document.removeEventListener('touchstart', enableAudioOnInteraction);
    };
  }, [musicManager]);

  // Gestione musica di sottofondo basata sullo stato del gioco
  useEffect(() => {
    if (!musicManager.isAudioWorking()) return;

    switch (gameState) {
      case GAME_STATES.MENU:
        musicManager.playBackground('ambient');
        break;
      case GAME_STATES.DIALOG:
        // Musica basata sul capitolo corrente
        if (currentChapter) {
          const chapterNumber = currentChapter.level;
          if (chapterNumber <= 5) {
            musicManager.playBackground('exploration');
          } else if (chapterNumber <= 10) {
            musicManager.playBackground('mystery');
          } else if (chapterNumber <= 15) {
            musicManager.playBackground('hope');
          } else if (chapterNumber <= 20) {
            musicManager.playBackground('despair');
          } else {
            musicManager.playBackground('ambient');
          }
        }
        break;
      case GAME_STATES.BOSS_BATTLE:
        // Durante la battaglia, ferma la musica di sottofondo
        musicManager.stopBackground();
        break;
      default:
        musicManager.playBackground('ambient');
    }
  }, [gameState, currentChapter, musicManager]);

  // Calculate player damage based on power level
  const getPlayerDamage = () => {
    return 15 + (playerStats.power - 1) * 5; // Base 15 + 5 per level
  };

  // Upgrade player after boss defeat
  const upgradePlayer = () => {
    const newPower = playerStats.power + 1;
    const newMaxHealth = playerStats.maxHealth + 20;
    const newHealth = Math.min(newMaxHealth, playerStats.health + 30); // Heal and increase max health
    
    setPlayerStats(prev => ({
      ...prev,
      power: newPower,
      maxHealth: newMaxHealth,
      health: newHealth
    }));
    
    console.log(`Player upgraded! Power: ${newPower}, Max Health: ${newMaxHealth}, Current Health: ${newHealth}`);
  };

  // Language selection
  const selectLanguage = (lang) => {
    setLanguage(lang);
    setGameState(GAME_STATES.MENU);
    setTimeout(() => musicManager.play('menu'), 100);
  };

  // Start new game
  const startNewGame = () => {
    setGameProgress({
      currentLevel: 1,
      willpower: 100,
      health: 100,
      experience: 0,
      defeatedBosses: [],
      playerPower: 1,
      maxHealth: 100
    });
    setPlayerStats({
      willpower: 100,
      health: 100,
      experience: 0,
      power: 1,
      maxHealth: 100
    });
    setHealthPickups([]); // Reset health pickups
    setShowStats(false); // Reset stats menu
    setCurrentChapter('intro');
    setDialogText(t.chapters.intro.text);
    setChoices(t.chapters.intro.choices);
    setDialogAnimation('fadeIn');
    setDialogOpen(true);
    setGameState(GAME_STATES.DIALOG);
    musicManager.play('menu');
  };

  // Reset progress if corrupted
  const resetProgress = () => {
    const chapterKeys = Object.keys(t.chapters);
    const validLevel = Math.min(gameProgress.currentLevel, chapterKeys.length);
    
    setGameProgress({
      currentLevel: validLevel,
      willpower: Math.max(20, gameProgress.willpower),
      health: Math.max(20, gameProgress.health),
      experience: gameProgress.experience,
      defeatedBosses: gameProgress.defeatedBosses,
      playerPower: gameProgress.playerPower || 1,
      maxHealth: gameProgress.maxHealth || 100
    });
    
    setPlayerStats({
      willpower: Math.max(20, gameProgress.willpower),
      health: Math.max(20, gameProgress.health),
      experience: gameProgress.experience,
      power: gameProgress.playerPower || 1,
      maxHealth: gameProgress.maxHealth || 100
    });
  };

  // Continue game
  const continueGame = () => {
    const chapterKeys = Object.keys(t.chapters);
    // Ensure we don't go beyond available chapters
    const maxChapterIndex = Math.min(gameProgress.currentLevel - 1, chapterKeys.length - 1);
    const chapterKey = chapterKeys[maxChapterIndex] || 'intro';
    
    setCurrentChapter(chapterKey);
    setDialogText(t.chapters[chapterKey].text);
    setChoices(t.chapters[chapterKey].choices);
    setDialogAnimation('fadeIn');
    setDialogOpen(true);
    setGameState(GAME_STATES.DIALOG);
    musicManager.play('menu');
  };

  // Handle choice
  const handleChoice = (choice) => {
    const newStats = { ...playerStats };
    
    if (choice.effect === 'willpower') {
      newStats.willpower = Math.min(100, newStats.willpower + choice.willpower);
      newStats.health = Math.min(100, newStats.health + (choice.health || 0));
      newStats.experience += 10;
    } else if (choice.effect === 'weakness') {
      newStats.willpower = Math.max(0, newStats.willpower + choice.willpower);
      newStats.health = Math.max(0, newStats.health + choice.health);
    }
    
    // Ensure player doesn't get stuck with too low health
    if (newStats.health < 20) {
      newStats.health = Math.min(100, newStats.health + 10);
    }
    
    setPlayerStats(newStats);
    
    // Handle boss battles
    if (choice.effect === 'boss_battle') {
      const bossId = choice.bossId || 1;
      const boss = BOSSES[bossId - 1];
      if (boss) {
        setIsTransitioning(true);
        setDialogAnimation('fadeOut');
        setDialogOpen(false);
        
        setTimeout(() => {
          clearBattleState(); // Clear all battle state before new battle
          setCurrentBossForIntro(boss);
          setShowBossIntro(true);
          musicManager.play('tension');
          setIsTransitioning(false);
        }, 500);
        return;
      }
    }
    
    // Handle victory
    if (choice.effect === 'victory') {
      setIsTransitioning(true);
      setDialogAnimation('fadeOut');
      setDialogOpen(false);
      
      setTimeout(() => {
        setGameState(GAME_STATES.VICTORY);
        musicManager.play('victory');
        setIsTransitioning(false);
      }, 500);
      return;
    }
    
    if (choice.effect === 'defeat') {
      setIsTransitioning(true);
      setDialogAnimation('fadeOut');
      setDialogOpen(false);
      
      setTimeout(() => {
        setGameState(GAME_STATES.GAME_OVER);
        musicManager.play('defeat');
        setIsTransitioning(false);
      }, 500);
      return;
    }
    
    if (choice.next === 'menu') {
      setIsTransitioning(true);
      setDialogAnimation('fadeOut');
      setDialogOpen(false);
      
      setTimeout(() => {
        setGameState(GAME_STATES.MENU);
        musicManager.play('menu');
        setIsTransitioning(false);
      }, 500);
      return;
    }
    
    // Handle boss defeat dialog choices
    if (choice.next === 'continue_story') {
      // Update game progress - find the next chapter index
      const chapterKeys = Object.keys(t.chapters);
      const currentChapterIndex = chapterKeys.indexOf(currentChapter);
      const nextChapterIndex = currentChapterIndex + 1;
      
      // Ensure we don't go beyond available chapters
      if (nextChapterIndex >= chapterKeys.length) {
        // Game completed - show final victory
        setIsTransitioning(true);
        setDialogAnimation('fadeOut');
        setDialogOpen(false);
        
        setTimeout(() => {
          setGameState(GAME_STATES.VICTORY);
          musicManager.play('victory');
          setIsTransitioning(false);
        }, 500);
        return;
      }
      
      const newProgress = {
        ...gameProgress,
        currentLevel: nextChapterIndex + 1, // +1 because levels start from 1
        defeatedBosses: [...gameProgress.defeatedBosses, currentBoss?.id]
      };
      setGameProgress(newProgress);
      
      // Continue to next chapter
      const nextChapterKey = chapterKeys[nextChapterIndex];
      
      if (nextChapterKey && t.chapters[nextChapterKey]) {
        setTimeout(() => {
          setCurrentChapter(nextChapterKey);
          setDialogText(t.chapters[nextChapterKey].text);
          setChoices(t.chapters[nextChapterKey].choices);
          setDialogAnimation('fadeIn');
          setDialogOpen(true);
          musicManager.play('intro');
        }, 1000);
      } else {
        // Final boss defeated - show victory
        setIsTransitioning(true);
        setDialogAnimation('fadeOut');
        setDialogOpen(false);
        
        setTimeout(() => {
          setGameState(GAME_STATES.VICTORY);
          musicManager.play('victory');
          setIsTransitioning(false);
        }, 500);
      }
      return;
    }
    
    if (choice.next === 'celebrate') {
      // Show celebration dialog
      const celebrationDialog = {
        text: `Hai sconfitto ${currentBoss?.name}! Ora sei più forte e pronto per la prossima sfida.`,
        choices: [
          { text: 'Continuare', next: 'continue_story' }
        ]
      };
      
      setDialogText(celebrationDialog.text);
      setChoices(celebrationDialog.choices);
      return;
    }
    
    // Continue to next chapter
    if (choice.next) {
      const nextChapter = t.chapters[choice.next];
      if (nextChapter) {
        // Play appropriate music based on chapter type
        if (choice.next.includes('boss')) {
          musicManager.play('tension');
        } else if (choice.next.includes('victory')) {
          musicManager.play('emotional');
        } else {
          musicManager.play('intro');
        }
        
        // Add smooth transition
        setDialogAnimation('fadeOut');
        setTimeout(() => {
          setCurrentChapter(choice.next);
          setDialogText(nextChapter.text);
          setChoices(nextChapter.choices);
          setDialogAnimation('fadeIn');
          setDialogOpen(true);
        }, 500); // Smooth transition delay
      } else {
        // If no next chapter found, go to menu
        setIsTransitioning(true);
        setDialogAnimation('fadeOut');
        setDialogOpen(false);
        
        setTimeout(() => {
          setGameState(GAME_STATES.MENU);
          musicManager.play('menu');
          setIsTransitioning(false);
        }, 500);
      }
    } else {
      // Start boss battle for current level
      const boss = BOSSES[gameProgress.currentLevel - 1];
      if (boss) {
        setCurrentBoss(boss);
        setBossHealth(boss.maxHealth); // Use maxHealth instead of health
        setGameState(GAME_STATES.BOSS_BATTLE);
        setDialogOpen(false);
        musicManager.play('boss_battle');
      } else {
        // If no boss found, go to menu
        setIsTransitioning(true);
        setDialogAnimation('fadeOut');
        setDialogOpen(false);
        
        setTimeout(() => {
          setGameState(GAME_STATES.MENU);
          musicManager.play('menu');
          setIsTransitioning(false);
        }, 500);
      }
    }
  };

  // Battle functions
  const movePlayer = (direction) => {
    const speed = 18; // Increased speed for more fluid movement
    setPlayerPosition(prev => {
      const newPos = { ...prev };
      switch(direction) {
        case 'up': newPos.y = Math.max(50, prev.y - speed); break;
        case 'down': newPos.y = Math.min(350, prev.y + speed); break;
        case 'left': newPos.x = Math.max(50, prev.x - speed); break;
        case 'right': newPos.x = Math.min(750, prev.x + speed); break;
        default: break;
      }
      return newPos;
    });
    
    // Reduced delay for more responsive feel
    setTimeout(() => {}, 5);
  };

  const shootProjectile = () => {
    if (playerAttackCooldown > 0) {
      console.log('Attack on cooldown:', playerAttackCooldown);
      return;
    }
    
    const playerDamage = getPlayerDamage();
    console.log(`Shooting double projectiles! Damage: ${playerDamage}, Power Level: ${playerStats.power}`);
    
    // First projectile
    const newProjectile1 = {
      id: Date.now(),
      x: playerPosition.x + 40, // Back to original position
      y: playerPosition.y + 15, // Slightly higher
      vx: 12, // Faster projectile speed
      vy: 0,
      damage: playerDamage, // Dynamic damage based on power level
      color: '#2196F3',
      size: 8,
      type: 'player'
    };
    
    // Second projectile
    const newProjectile2 = {
      id: Date.now() + 1,
      x: playerPosition.x + 40, // Back to original position
      y: playerPosition.y + 25, // Slightly lower
      vx: 12, // Faster projectile speed
      vy: 0,
      damage: playerDamage, // Dynamic damage based on power level
      color: '#2196F3',
      size: 8,
      type: 'player'
    };
    
    setProjectiles(prev => [...prev, newProjectile1, newProjectile2]);
    setPlayerAttackCooldown(25); // Slightly faster attack rate
    setPlayerAnimation('attack');
    setTimeout(() => setPlayerAnimation('idle'), 200);
  };

  // Generate health pickups
  const generateHealthPickup = () => {
    if (Math.random() < 0.02) { // 2% chance per frame
      const newPickup = {
        id: Date.now(),
        x: Math.random() * 700 + 50, // Random position
        y: Math.random() * 300 + 50,
        size: 15,
        healAmount: 15
      };
      setHealthPickups(prev => [...prev, newPickup]);
    }
  };

  // Collect health pickup
  const collectHealthPickup = (pickup) => {
    setPlayerStats(prev => ({
      ...prev,
      health: Math.min(prev.maxHealth, prev.health + pickup.healAmount)
    }));
    setHealthPickups(prev => prev.filter(p => p.id !== pickup.id));
  };

  // Toggle stats menu
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Calculate boss difficulty based on defeated bosses
  const getBossDifficulty = () => {
    return gameProgress.defeatedBosses.length + 1; // Difficulty increases with each boss
  };

  // Enhanced boss attack logic with phases - Difficult but fair
  const bossAttack = () => {
    if (!currentBoss || bossAttackCooldown > 0) return;
    
    const difficulty = getBossDifficulty();
    const difficultyMultiplier = 1 + (difficulty - 1) * 0.3; // 30% increase per boss defeated
    
    // Get current phase
    const healthPercentage = bossHealth / currentBoss.maxHealth;
    const currentPhase = currentBoss.phases?.find(phase => healthPercentage > phase.healthThreshold) || 
                        currentBoss.phases?.[currentBoss.phases.length - 1];
    
    const patterns = currentPhase?.patterns || currentBoss.patterns;
    const attackType = patterns[Math.floor(Math.random() * patterns.length)];
    
    let newProjectiles = [];
    
        switch(attackType) {
      case 'basic':
        newProjectiles.push({
          id: Date.now(),
          x: bossPosition.x,
          y: bossPosition.y,
          vx: (playerPosition.x - bossPosition.x) * 0.1,
          vy: (playerPosition.y - bossPosition.y) * 0.1,
          damage: Math.round(8 * difficultyMultiplier), // Scaled damage
          color: currentBoss.color,
          size: 12,
          type: 'boss'
        });
        break;
      case 'spread':
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45) * (Math.PI / 180);
          newProjectiles.push({
            id: Date.now() + i,
            x: bossPosition.x,
            y: bossPosition.y,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            damage: Math.round(6 * difficultyMultiplier), // Scaled damage
            color: currentBoss.color,
            size: 10,
            type: 'boss'
          });
        }
        break;
      case 'homing':
        newProjectiles.push({
          id: Date.now(),
          x: bossPosition.x,
          y: bossPosition.y,
          vx: (playerPosition.x - bossPosition.x) * 0.2,
          vy: (playerPosition.y - bossPosition.y) * 0.2,
          damage: Math.round(12 * difficultyMultiplier), // Scaled damage
          color: currentBoss.color,
          size: 15,
          type: 'boss'
        });
        break;
      case 'temptation':
        // Special attack for Tentatore - Much stronger
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            setBossProjectiles(prev => [...prev, {
              id: Date.now() + i,
              x: bossPosition.x,
              y: bossPosition.y,
              vx: (playerPosition.x - bossPosition.x) * 0.12,
              vy: (playerPosition.y - bossPosition.y) * 0.12,
              damage: Math.round(25 * difficultyMultiplier), // Scaled damage
              color: '#9C27B0',
              size: 14,
              type: 'boss'
            }]);
          }, i * 200);
        }
        break;
      case 'manipulation':
        // Special attack for Manipolatore - Very strong
        newProjectiles.push({
          id: Date.now(),
          x: bossPosition.x,
          y: bossPosition.y,
          vx: (playerPosition.x - bossPosition.x) * 0.25,
          vy: (playerPosition.y - bossPosition.y) * 0.25,
          damage: Math.round(30 * difficultyMultiplier), // Scaled damage
          color: '#8E24AA',
          size: 18,
          type: 'boss'
        });
        break;
      case 'explosion':
        // Special attack for Provocatore - Multiple strong hits
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30) * (Math.PI / 180);
          newProjectiles.push({
            id: Date.now() + i,
            x: bossPosition.x,
            y: bossPosition.y,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            damage: Math.round(22 * difficultyMultiplier), // Scaled damage
            color: '#F57C00',
            size: 12,
            type: 'boss'
          });
        }
        break;
      case 'illusion':
        // Special attack for Illusore - Multiple strong hits
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            setBossProjectiles(prev => [...prev, {
              id: Date.now() + i,
              x: bossPosition.x + (Math.random() - 0.5) * 100,
              y: bossPosition.y + (Math.random() - 0.5) * 100,
              vx: (playerPosition.x - bossPosition.x) * 0.1,
              vy: (playerPosition.y - bossPosition.y) * 0.1,
              damage: Math.round(28 * difficultyMultiplier), // Scaled damage
              color: '#7B1FA2',
              size: 16,
              type: 'boss'
            }]);
          }, i * 150);
        }
        break;
      case 'drain':
        // Special attack for Predatore - Extremely strong
        newProjectiles.push({
          id: Date.now(),
          x: bossPosition.x,
          y: bossPosition.y,
          vx: (playerPosition.x - bossPosition.x) * 0.3,
          vy: (playerPosition.y - bossPosition.y) * 0.3,
          damage: Math.round(35 * difficultyMultiplier), // Scaled damage
          color: '#E91E63',
          size: 20,
          type: 'boss'
        });
        break;
      case 'corruption':
        // Special attack for Dipendenza - Multiple very strong hits
        for (let i = 0; i < 10; i++) {
          const angle = (i * 36) * (Math.PI / 180);
          newProjectiles.push({
            id: Date.now() + i,
            x: bossPosition.x,
            y: bossPosition.y,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            damage: Math.round(32 * difficultyMultiplier), // Scaled damage
            color: '#D32F2F',
            size: 14,
            type: 'boss'
          });
        }
        break;
      case 'ultimate':
        // Ultimate attack for final boss - Devastating
        for (let i = 0; i < 20; i++) {
          const angle = (i * 18) * (Math.PI / 180);
          setTimeout(() => {
            setBossProjectiles(prev => [...prev, {
              id: Date.now() + i,
              x: bossPosition.x,
              y: bossPosition.y,
              vx: Math.cos(angle) * 7,
              vy: Math.sin(angle) * 7,
              damage: Math.round(40 * difficultyMultiplier), // Scaled damage
              color: '#D32F2F',
              size: 18,
              type: 'boss'
            }]);
          }, i * 100);
        }
        break;
      default:
        // Default basic attack if no pattern matches
        newProjectiles.push({
          id: Date.now(),
          x: bossPosition.x,
          y: bossPosition.y,
          vx: (playerPosition.x - bossPosition.x) * 0.1,
          vy: (playerPosition.y - bossPosition.y) * 0.1,
          damage: Math.round(8 * difficultyMultiplier), // Scaled damage
          color: currentBoss.color,
          size: 12,
          type: 'boss'
        });
        break;
    }
    
    setBossProjectiles(prev => [...prev, ...newProjectiles]);
    
    // Longer cooldown for final boss
    const cooldown = currentBoss?.id === 6 ? 30 : 20; // Extra cooldown for final boss
    setBossAttackCooldown(cooldown);
    setBossAnimation('attack');
    setTimeout(() => setBossAnimation('idle'), 300);
  };

  // Clear all battle state
  const clearBattleState = () => {
    setProjectiles([]);
    setBossProjectiles([]);
    setHealthPickups([]);
    setPlayerAttackCooldown(0);
    setBossAttackCooldown(0);
    setPlayerAnimation('idle');
    setBossAnimation('idle');
    setBossPhaseDialog(null);
    setIsPhaseTransition(false);
    setLastPhaseTransition(null); // Reset transition tracking
  };
  
  // Handle boss intro
  const handleBossIntroStart = () => {
    setShowBossIntro(false);
    setCurrentBoss(currentBossForIntro);
    setBossHealth(currentBossForIntro.maxHealth);
    setGameState(GAME_STATES.BOSS_BATTLE);
    musicManager.play('boss_battle');
  };
  
  const handleBossIntroSkip = () => {
    setShowBossIntro(false);
    setCurrentBoss(currentBossForIntro);
    setBossHealth(currentBossForIntro.maxHealth);
    setGameState(GAME_STATES.BOSS_BATTLE);
    musicManager.play('boss_battle');
  };

  // Force clear phase transition if stuck
  const forceClearPhaseTransition = () => {
    if (isPhaseTransition) {
      console.log('Force clearing stuck phase transition');
      setIsPhaseTransition(false);
      setBossPhaseDialog(null);
      setLastPhaseTransition(null); // Reset transition tracking
    }
  };

  // Handle boss phase transition
  const handleBossPhaseTransition = (newPhase) => {
    if (!newPhase || isPhaseTransition) return; // Prevent multiple transitions
    
    // Check if this is a duplicate transition
    if (lastPhaseTransition === newPhase.name) {
      console.log(`Duplicate transition prevented: ${newPhase.name}`);
      return;
    }
    
    console.log(`Starting phase transition to: ${newPhase.name}`);
    setIsPhaseTransition(true);
    setLastPhaseTransition(newPhase.name);
    setBossPhaseDialog({
      text: `${currentBoss?.name}: "${newPhase.name}!"`,
      phase: newPhase
    });
    
    // Clear any existing projectiles during transition
    setBossProjectiles([]);
    setProjectiles([]);
    
    // Change boss color based on phase
    setTimeout(() => {
      console.log('Phase transition completed');
      setIsPhaseTransition(false);
      setBossPhaseDialog(null);
    }, 3000); // 3 seconds for phase transition
    
    // Safety timeout to force clear if stuck
    setTimeout(() => {
      if (isPhaseTransition) {
        console.log('Safety timeout triggered - forcing transition end');
        forceClearPhaseTransition();
      }
    }, 4000); // 4 seconds safety timeout
  };

  // Game loop
  useEffect(() => {
    if (gameState !== GAME_STATES.BOSS_BATTLE) return;
    
    const gameLoop = setInterval(() => {

      
      // Update projectiles
      setProjectiles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy
      })).filter(p => p.x > 0 && p.x < 800 && p.y > 0 && p.y < 400));
      
      setBossProjectiles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy
      })).filter(p => p.x > 0 && p.x < 800 && p.y > 0 && p.y < 400));
      
      // Update cooldowns
      setPlayerAttackCooldown(prev => Math.max(0, prev - 1));
      setBossAttackCooldown(prev => Math.max(0, prev - 1));
      
      // Generate health pickups only if not in phase transition
      if (!isPhaseTransition) {
        generateHealthPickup();
      }
      
      // Check health pickup collision
      setHealthPickups(prev => prev.filter(pickup => {
        const hitPlayer = Math.abs(pickup.x - playerPosition.x) < 25 &&
                         Math.abs(pickup.y - playerPosition.y) < 25;
        
        if (hitPlayer) {
          collectHealthPickup(pickup);
          return false;
        }
        return true;
      }));
      
      // Boss movement
      setBossPosition(prev => {
        const newPos = { ...prev };
        const time = Date.now() * 0.001;
        newPos.y = 200 + Math.sin(time) * 50;
        return newPos;
      });
      
      // Check for phase transition
      if (currentBoss?.phases && !isPhaseTransition) {
        const healthPercentage = bossHealth / currentBoss.maxHealth;
        const currentPhase = currentBoss.phases.find(phase => healthPercentage > phase.healthThreshold);
        const nextPhase = currentBoss.phases.find(phase => healthPercentage <= phase.healthThreshold);
        
        // More robust phase detection with logging
        if (nextPhase && currentPhase !== nextPhase && healthPercentage > 0) {
          console.log(`Phase transition detected: ${currentPhase?.name || 'Initial'} -> ${nextPhase.name} (Health: ${Math.round(healthPercentage * 100)}%)`);
          handleBossPhaseTransition(nextPhase);
        }
      }
      
      // Safety check for stuck transitions (every 200 frames instead of 100)
      if (Math.random() < 0.005 && isPhaseTransition) {
        console.log('Safety check triggered - clearing stuck transition');
        forceClearPhaseTransition();
      }
      
      // Boss attacks - Only if not in phase transition
      if (!isPhaseTransition) {
        const attackChance = currentBoss?.id === 6 ? 0.02 : 0.03; // Much slower for final boss
        if (Math.random() < attackChance) {
          console.log('Boss attacking!');
          bossAttack();
        }
      }
      
      // Boss dialogue - Random chance to show boss dialogue
      if (Math.random() < 0.02 && currentBoss?.battleDialogs && !isPhaseTransition) { // 2% chance every frame
        const randomDialog = currentBoss.battleDialogs[Math.floor(Math.random() * currentBoss.battleDialogs.length)];
        console.log(`${currentBoss.name}: ${randomDialog}`);
      }
      
      // Collision detection
      setProjectiles(prev => prev.filter(p => {
        const hitBoss = Math.abs(p.x - bossPosition.x) < (currentBoss?.size || 60) / 2 &&
                       Math.abs(p.y - bossPosition.y) < (currentBoss?.size || 60) / 2;
        
        if (hitBoss) {
          setBossHealth(prevHealth => {
            const newHealth = prevHealth - p.damage;
            if (newHealth <= 0) {
              // Boss defeated
              setTimeout(() => {
                setGameState(GAME_STATES.VICTORY);
                musicManager.play('victory');
              }, 1000);
            }
            return newHealth;
          });
          setBossAnimation('hit');
          setTimeout(() => setBossAnimation('idle'), 200);
          return false;
        }
        return true;
      }));
      
      setBossProjectiles(prev => prev.filter(p => {
        const hitPlayer = Math.abs(p.x - playerPosition.x) < 20 &&
                         Math.abs(p.y - playerPosition.y) < 20;
        
        if (hitPlayer) {
          setPlayerStats(prevStats => {
            const newHealth = prevStats.health - p.damage;
            if (newHealth <= 0) {
              // Player defeated
              setTimeout(() => {
                setGameState(GAME_STATES.GAME_OVER);
                musicManager.play('defeat');
              }, 1000);
            }
            return { ...prevStats, health: newHealth };
          });
          setPlayerAnimation('hit');
          setTimeout(() => setPlayerAnimation('idle'), 200);
          return false;
        }
        return true;
      }));
      
      // Check victory/defeat conditions
      if (bossHealth <= 0) {
        // Boss defeated - upgrade player and show victory dialog
        upgradePlayer();
        clearBattleState(); // Clear all battle state
        forceClearPhaseTransition(); // Force clear any stuck transitions
        
        const bossDefeatDialog = {
          text: `${currentBoss?.name} è stato sconfitto! "${currentBoss?.dialogue}"\n\n🎉 SEI DIVENTATO PIÙ FORTE!\n💪 Potenza: +1 (${playerStats.power + 1})\n❤️ Vita Massima: +20 (${playerStats.maxHealth + 20})\n💚 Vita Rigenerata: +30`,
          choices: [
            { text: 'Continuare la storia', next: 'continue_story' },
            { text: 'Celebrare la vittoria', next: 'celebrate' }
          ]
        };
        
        setDialogText(bossDefeatDialog.text);
        setChoices(bossDefeatDialog.choices);
        setDialogOpen(true);
        setGameState(GAME_STATES.DIALOG);
        musicManager.play('victory');
        return;
      }
      
      if (playerStats.health <= 0) {
        clearBattleState(); // Clear all battle state
        forceClearPhaseTransition(); // Force clear any stuck transitions
        setGameState(GAME_STATES.GAME_OVER);
        musicManager.play('defeat');
        return;
      }
    }, 16);
    
    return () => clearInterval(gameLoop);
  }, [gameState, bossAttack, bossHealth, musicManager, playerStats.health, currentBoss, bossPosition, playerPosition, currentChapter, gameProgress, t.chapters, isPhaseTransition]);

  // Save progress on changes
  useEffect(() => {
    saveProgress();
  }, [gameProgress, saveProgress]);

  // Check and fix progress on mount
  useEffect(() => {
    const chapterKeys = Object.keys(t.chapters);
    if (gameProgress.currentLevel > chapterKeys.length) {
      console.log('Progress corrupted, resetting to valid state');
      resetProgress();
    }
  }, []);

  // Start music when component mounts
  useEffect(() => {
    if (gameState === GAME_STATES.MENU) {
      setTimeout(() => musicManager.play('menu'), 500);
    }
  }, [gameState, musicManager]);

  // Continuous movement system - REMOVED for stability
  // const [keysPressed, setKeysPressed] = useState(new Set());

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     const key = e.key.toLowerCase();
  //     if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
  //       e.preventDefault();
  //       setKeysPressed(prev => new Set([...prev, key]));
  //     }
  //   };

  //   const handleKeyUp = (e) => {
  //     const key = e.key.toLowerCase();
  //     if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
  //       e.preventDefault();
  //       setKeysPressed(prev => {
  //         const newSet = new Set(prev);
  //         newSet.delete(key);
  //         return newSet;
  //       });
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   window.addEventListener('keyup', handleKeyUp);
    
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //     window.removeEventListener('keyup', handleKeyUp);
  //   };
  // }, []);

  // // Continuous movement update
  // useEffect(() => {
  //   if (gameState !== GAME_STATES.BOSS_BATTLE) return;

  //   const movementInterval = setInterval(() => {
  //     keysPressed.forEach(key => {
  //       switch(key) {
  //         case 'w':
  //         case 'arrowup':
  //           movePlayer('up');
  //           break;
  //         case 's':
  //         case 'arrowdown':
  //           movePlayer('down');
  //           break;
  //         case 'a':
  //         case 'arrowleft':
  //           movePlayer('left');
  //           break;
  //         case 'd':
  //         case 'arrowright':
  //           movePlayer('right');
  //           break;
  //         default:
  //           break;
  //       }
  //     });
  //   }, 16); // 60 FPS movement

  //   return () => clearInterval(movementInterval);
  // }, [keysPressed, gameState]);


  // Render based on game state
  const renderContent = () => {
    // Show boss intro
    if (showBossIntro && currentBossForIntro) {
      return (
        <BossIntro
          boss={currentBossForIntro}
          onStartBattle={handleBossIntroStart}
          onSkip={handleBossIntroSkip}
        />
      );
    }
    
    // Show transition screen
    if (isTransitioning) {
      return (
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center',
            animation: 'pulse 1s ease-in-out infinite'
          }}>
            Caricamento...
          </Typography>
        </Box>
      );
    }
    
    switch(gameState) {
      case GAME_STATES.LANGUAGE_SELECT:
        return <LanguageSelect onLanguageSelect={selectLanguage} />;
      
      case GAME_STATES.MENU:
        return (
          <GameMenu 
            t={t}
            gameProgress={gameProgress}
            onStartNewGame={startNewGame}
            onContinueGame={continueGame}
            onLanguageSelect={selectLanguage}
            onEnableAudio={() => {
              musicManager.enableAudio();
              musicManager.play('menu');
            }}
            audioStatus={musicManager.getAudioStatus()}
          />
        );
      
      case GAME_STATES.BOSS_BATTLE:
        return (
          <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
            <BossBattle
              currentBoss={currentBoss}
              playerPosition={playerPosition}
              bossPosition={bossPosition}
              projectiles={projectiles}
              bossProjectiles={bossProjectiles}
              playerStats={playerStats}
              bossHealth={bossHealth}
              onPause={() => setPauseOpen(true)}
              onMovePlayer={movePlayer}
              onShoot={shootProjectile}
              playerAnimation={playerAnimation}
              bossAnimation={bossAnimation}
              healthPickups={healthPickups}
              bossPhaseDialog={bossPhaseDialog}
              isPhaseTransition={isPhaseTransition}
            />
            
            {/* Stats Button */}
            <Button
              onClick={toggleStats}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#FFD700',
                border: '2px solid #FFD700',
                '&:hover': {
                  backgroundColor: 'rgba(255,215,0,0.2)'
                }
              }}
            >
              📊 Stats
            </Button>
            
            {/* Stats Menu */}
            {showStats && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.95)',
                border: '3px solid #FFD700',
                borderRadius: '15px',
                padding: 3,
                zIndex: 1000,
                minWidth: 300
              }}>
                <Typography variant="h4" sx={{ color: '#FFD700', mb: 2, textAlign: 'center' }}>
                  📊 Le Tue Statistiche
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#FF5722' }}>❤️ Vita:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      {playerStats.health}/{playerStats.maxHealth}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#4CAF50' }}>💪 Volontà:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      {playerStats.willpower}/100
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#2196F3' }}>⚔️ Potenza:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      Livello {playerStats.power} ({getPlayerDamage()} danno)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#9C27B0' }}>🏆 Boss Sconfitti:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      {gameProgress.defeatedBosses.length}/6
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#FF9800' }}>📈 Esperienza:</Typography>
                    <Typography sx={{ color: '#fff' }}>
                      {playerStats.experience} punti
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  onClick={toggleStats}
                  sx={{
                    mt: 2,
                    width: '100%',
                    backgroundColor: '#FFD700',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#FFC107'
                    }
                  }}
                >
                  Chiudi
                </Button>
              </Box>
            )}

            {/* Boss Phase Dialog */}
            {bossPhaseDialog && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.95)',
                border: '3px solid #FF1744',
                borderRadius: '15px',
                padding: 3,
                zIndex: 1001,
                minWidth: 400,
                textAlign: 'center',
                animation: 'phaseGlow 1s ease-in-out infinite'
              }}>
                <Typography variant="h3" sx={{ 
                  color: '#FF1744', 
                  mb: 2,
                  fontWeight: 900,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  animation: 'pulse 0.5s ease-in-out infinite'
                }}>
                  {bossPhaseDialog.text}
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  color: '#FFD700',
                  animation: 'fadeIn 0.5s ease-in'
                }}>
                  La battaglia si intensifica!
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case GAME_STATES.DIALOG:
        // Show a neutral background when dialog is open
        return (
          <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h3" sx={{ color: '#FFD700', textAlign: 'center' }}>
              La Storia della Vita
            </Typography>
          </Box>
        );
      


      
      case GAME_STATES.GAME_OVER:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" sx={{ 
              color: '#FF1744', 
              mb: 2,
              fontWeight: 900,
              textShadow: '3px 3px 12px rgba(0,0,0,0.7)'
            }}>
              {t.gameOver}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#fff', 
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              {t.gameOverText}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  // Riprova Boss - Reset boss health and player health
                  if (currentBoss) {
                    setBossHealth(currentBoss.maxHealth);
                    setPlayerStats(prev => ({ ...prev, health: 100 }));
                    setProjectiles([]);
                    setBossProjectiles([]);
                    setPlayerAttackCooldown(0);
                    setBossAttackCooldown(0);
                    setGameState(GAME_STATES.BOSS_BATTLE);
                    musicManager.play('boss_battle');
                  }
                }}
                sx={{ 
                  width: 300, 
                  height: 60, 
                  fontSize: 20, 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FF5722, #E64A19)',
                  '&:hover': { background: 'linear-gradient(45deg, #E64A19, #D84315)' }
                }}
              >
                Riprova Boss
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => setGameState(GAME_STATES.MENU)}
                sx={{ 
                  width: 300, 
                  height: 60, 
                  fontSize: 20, 
                  fontWeight: 700,
                  color: '#FFD700',
                  borderColor: '#FFD700',
                  '&:hover': { 
                    backgroundColor: '#FFD700',
                    color: '#000'
                  }
                }}
              >
                {t.restart}
              </Button>
            </Box>
          </Box>
        );
      
      case GAME_STATES.VICTORY:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" sx={{ 
              color: '#4CAF50', 
              mb: 2,
              fontWeight: 900,
              textShadow: '3px 3px 12px rgba(0,0,0,0.7)'
            }}>
              {t.victory}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#fff', 
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              {t.victoryText}
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setGameState(GAME_STATES.MENU)}
              sx={{ 
                width: 300, 
                height: 60, 
                fontSize: 20, 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4CAF50, #388E3C)',
                '&:hover': { background: 'linear-gradient(45deg, #388E3C, #2E7D32)' }
              }}
            >
              {t.backToMainMenu}
            </Button>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ color: '#FFD700', mb: 4 }}>
              Caricamento...
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setGameState(GAME_STATES.MENU)}
              sx={{ background: 'linear-gradient(45deg, #FF1744, #D50000)' }}
            >
              Torna al Menu
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      },
      '@keyframes fadeOut': {
        '0%': { opacity: 1, transform: 'translateY(0)' },
        '100%': { opacity: 0, transform: 'translateY(-20px)' }
      },
      '@keyframes slideIn': {
        '0%': { opacity: 0, transform: 'translateX(-50px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' }
      },
      '@keyframes slideOut': {
        '0%': { opacity: 1, transform: 'translateX(0)' },
        '100%': { opacity: 0, transform: 'translateX(50px)' }
      },
      '@keyframes pulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 }
      },
      '@keyframes dialogFadeIn': {
        '0%': { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
        '100%': { opacity: 1, transform: 'scale(1) translateY(0)' }
      },
      '@keyframes dialogFadeOut': {
        '0%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        '100%': { opacity: 0, transform: 'scale(0.9) translateY(-20px)' }
      },
      '@keyframes textFadeIn': {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      },
      '@keyframes choiceSlideIn': {
        '0%': { opacity: 0, transform: 'translateX(-30px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' }
      },
      '@keyframes phaseGlow': {
        '0%': { boxShadow: '0 0 10px rgba(255, 23, 68, 0.5)' },
        '50%': { boxShadow: '0 0 20px rgba(255, 23, 68, 0.8)' },
        '100%': { boxShadow: '0 0 10px rgba(255, 23, 68, 0.5)' }
      }
    }}>


      {/* Main Content */}
      {renderContent()}

      {/* Enhanced Dialog Modal */}
      <Dialog 
        open={dialogOpen} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%)',
            color: '#fff',
            borderRadius: '15px',
            border: '3px solid #FF1744',
            boxShadow: '0 0 30px rgba(255,23,68,0.3)',
            backdropFilter: 'blur(10px)',
            animation: dialogAnimation === 'fadeIn' ? 'dialogFadeIn 0.5s ease-in' : 
                      dialogAnimation === 'fadeOut' ? 'dialogFadeOut 0.5s ease-out' : 'none'
          }
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ 
            mb: 3, 
            color: '#FF1744',
            fontWeight: 900,
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            fontSize: { xs: '1.8rem', md: '2.5rem' }
          }}>
            {currentChapter && t.chapters[currentChapter]?.title}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4, 
            lineHeight: 2, 
            fontSize: '1.1rem',
            textAlign: 'justify',
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
            animation: 'textFadeIn 0.8s ease-in'
          }}>
            {dialogText}
          </Typography>
          
          {/* Choice Impact Preview */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, textAlign: 'center' }}>
              Impatto delle tue scelte:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                  Volontà: {playerStats.willpower}/100
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={playerStats.willpower}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4CAF50'
                    }
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#FF5722' }}>
                  Vita: {playerStats.health}/100
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={playerStats.health}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#FF5722'
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {choices.map((choice, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleChoice(choice)}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: 16,
                  fontWeight: 700,
                  background: choice.effect === 'willpower' 
                    ? 'linear-gradient(45deg, #4CAF50, #388E3C)'
                    : choice.effect === 'weakness'
                    ? 'linear-gradient(45deg, #FF5722, #D84315)'
                    : 'linear-gradient(45deg, #FF1744, #D50000)',
                  color: '#fff',
                  border: 'none',
                  '&:hover': { 
                    background: choice.effect === 'willpower'
                      ? 'linear-gradient(45deg, #388E3C, #2E7D32)'
                      : choice.effect === 'weakness'
                      ? 'linear-gradient(45deg, #D84315, #BF360C)'
                      : 'linear-gradient(45deg, #D50000, #B71C1C)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  minWidth: 200,
                  animation: `choiceSlideIn 0.5s ease-in ${index * 0.1}s both`
                }}
              >
                {choice.text}
              </Button>
            ))}
          </Box>
        </Box>
      </Dialog>

      {/* Pause Menu */}
      <Dialog 
        open={pauseOpen} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: '#fff',
            borderRadius: '15px'
          }
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Pause
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Music Volume
            </Typography>
            <Slider
              value={musicVolume}
              onChange={(e, value) => {
                setMusicVolume(value);
                musicManager.setVolume(value);
              }}
              sx={{ color: '#FF1744' }}
            />
            <Typography variant="caption" sx={{ color: '#FFD700', display: 'block', mt: 1 }}>
              Audio Status: {musicManager.getAudioStatus().isEnabled ? '✅ Enabled' : '❌ Disabled'} | 
              Playing: {musicManager.getAudioStatus().isPlaying ? '✅ Yes' : '❌ No'} | 
              Track: {musicManager.getAudioStatus().currentTrack || 'None'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setPauseOpen(false);
                musicManager.resume();
              }}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #388E3C)',
                '&:hover': { background: 'linear-gradient(45deg, #388E3C, #2E7D32)' }
              }}
            >
              Resume
            </Button>
            

            

            
            <Button
              variant="outlined"
              onClick={() => {
                setPauseOpen(false);
                setGameState(GAME_STATES.MENU);
                musicManager.play('menu');
              }}
              sx={{
                color: '#FFD700',
                borderColor: '#FFD700',
                '&:hover': { backgroundColor: '#FFD700', color: '#000' }
              }}
            >
              Back to Menu
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Boss; 