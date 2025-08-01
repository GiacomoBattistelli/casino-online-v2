import React, { useEffect } from 'react';
import { Container, Typography, Box, IconButton, Paper } from '@mui/material';
import { Settings } from '@mui/icons-material';

const BossBattle = ({
  currentBoss,
  playerPosition,
  bossPosition,
  projectiles,
  bossProjectiles,
  playerStats,
  bossHealth,
  onPause,
  onMovePlayer,
  onShoot,
  playerAnimation,
  bossAnimation,
  healthPickups, // New: health pickups
  bossPhaseDialog, // New: boss phase dialog
  isPhaseTransition, // New: phase transition
  currentPhase,
  phaseName
}) => {
  // Get current phase based on boss health
  const getCurrentPhase = () => {
    if (!currentBoss?.phases) return null;
    const healthPercentage = bossHealth / currentBoss.maxHealth;
    return currentBoss.phases.find(phase => healthPercentage > phase.healthThreshold) || 
           currentBoss.phases[currentBoss.phases.length - 1];
  };

  const phase = getCurrentPhase();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          onMovePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          onMovePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          onMovePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          onMovePlayer('right');
          break;
        case ' ':
        case 'enter':
          e.preventDefault();
          onShoot();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMovePlayer, onShoot]);

  return (
    <Container maxWidth="lg" sx={{ 
      textAlign: 'center', 
      py: 2,
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' }
      },
      '@keyframes pulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.7 }
      },
      '@keyframes flash': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.3 }
      },
      '@keyframes projectile': {
        '0%': { transform: 'scale(1) rotate(0deg)' },
        '50%': { transform: 'scale(1.2) rotate(180deg)' },
        '100%': { transform: 'scale(1) rotate(360deg)' }
      },
      '@keyframes phaseGlow': {
        '0%, 100%': { boxShadow: '0 0 10px rgba(255,23,68,0.5)' },
        '50%': { boxShadow: '0 0 20px rgba(255,23,68,0.8)' }
      },
      '@keyframes phaseTransition': {
        '0%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
        '50%': { transform: 'scale(1.2) rotate(180deg)', filter: 'hue-rotate(180deg)' },
        '100%': { transform: 'scale(1) rotate(360deg)', filter: 'hue-rotate(360deg)' }
      },
      '@keyframes bossColorChange': {
        '0%': { backgroundColor: 'currentColor' },
        '50%': { backgroundColor: '#FF1744' },
        '100%': { backgroundColor: 'currentColor' }
      }
    }}>
      {/* Pause Button */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <IconButton
          onClick={onPause}
          sx={{
            color: '#FFD700',
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
          }}
        >
          <Settings />
        </IconButton>
      </Box>

      {/* Boss Name and Phase */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 900, 
          color: '#FF1744', 
          mb: 1,
          textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
        }}>
          {currentBoss?.name}
        </Typography>
        
        {phase && (
          <Paper sx={{
            display: 'inline-block',
            p: 1,
            background: 'rgba(255,23,68,0.9)',
            color: '#fff',
            borderRadius: 2,
            animation: 'phaseGlow 2s ease-in-out infinite'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {phase.name}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* 2D Battle Area */}
      <Box sx={{
        position: 'relative',
        width: 800,
        height: 400,
        margin: '0 auto',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '3px solid #FF1744',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(255,23,68,0.5)'
      }}>
        {/* Pixel Art Boss */}
        <Box sx={{
          position: 'absolute',
          left: bossPosition.x - (currentBoss?.size || 60) / 2,
          top: bossPosition.y - (currentBoss?.size || 60) / 2,
          width: currentBoss?.size || 60,
          height: currentBoss?.size || 60,
          imageRendering: 'pixelated',
          animation: isPhaseTransition ? 'phaseTransition 3s ease-in-out' :
                    bossAnimation === 'attack' ? 'pulse 0.3s ease-in-out' : 
                    bossAnimation === 'hit' ? 'flash 0.2s ease-in-out' :
                    'float 3s ease-in-out infinite',
          zIndex: 10,
          transition: 'all 0.3s ease'
        }}>
          {/* Pixel Art Boss Sprite */}
          <Box sx={{
            width: '100%',
            height: '100%',
            backgroundColor: currentBoss?.color || '#FF1744',
            borderRadius: '50%',
            border: '3px solid #fff',
            boxShadow: `0 0 30px ${currentBoss?.color || '#FF1744'}`,
            animation: isPhaseTransition ? 'bossColorChange 3s ease-in-out' : 'none'
          }} />
          
          {/* Boss Health Bar */}
          <Box sx={{
            position: 'absolute',
            top: '-20px',
            left: '0',
            width: '100%',
            height: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: `${(bossHealth / (currentBoss?.maxHealth || 100)) * 100}%`,
              height: '100%',
              backgroundColor: currentBoss?.color || '#FF1744',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>

        {/* Pixel Art Player */}
        <Box sx={{
          position: 'absolute',
          left: playerPosition.x - 20,
          top: playerPosition.y - 20,
          width: 40,
          height: 40,
          imageRendering: 'pixelated',
          animation: playerAnimation === 'attack' ? 'pulse 0.3s ease-in-out' : 
                    playerAnimation === 'hit' ? 'flash 0.2s ease-in-out' :
                    'float 2s ease-in-out infinite',
          zIndex: 10
        }}>
          {/* Pixel Art Player Sprite */}
          <Box sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            border: '3px solid #fff',
            boxShadow: '0 0 15px rgba(76,175,80,0.8)'
          }} />
          
          {/* Player Health Bar */}
          <Box sx={{
            position: 'absolute',
            top: '-15px',
            left: '0',
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: `${playerStats.health}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>

        {/* Player Projectiles */}
        {projectiles.map(projectile => (
          <Box key={projectile.id} sx={{
            position: 'absolute',
            left: projectile.x - (projectile.size || 8) / 2,
            top: projectile.y - (projectile.size || 8) / 2,
            width: projectile.size || 8,
            height: projectile.size || 8,
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 8px rgba(255,215,0,0.8)',
            zIndex: 5,
            animation: 'projectile 0.5s linear infinite'
          }} />
        ))}

        {/* Enhanced Boss Projectiles */}
        {bossProjectiles.map(projectile => (
          <Box key={projectile.id} sx={{
            position: 'absolute',
            left: projectile.x - (projectile.size || 12) / 2,
            top: projectile.y - (projectile.size || 12) / 2,
            width: projectile.size || 12,
            height: projectile.size || 12,
            backgroundColor: projectile.color || '#FF1744',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: `0 0 10px ${projectile.color || '#FF1744'}`,
            zIndex: 5,
            animation: 'projectile 0.3s linear infinite'
          }} />
        ))}

        {/* Health Pickups */}
        {healthPickups.map(pickup => (
          <Box key={pickup.id} sx={{
            position: 'absolute',
            left: pickup.x - pickup.size / 2,
            top: pickup.y - pickup.size / 2,
            width: pickup.size,
            height: pickup.size,
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            border: '3px solid #fff',
            boxShadow: '0 0 15px rgba(76,175,80,0.8)',
            zIndex: 8,
            animation: 'float 2s ease-in-out infinite',
            cursor: 'pointer'
          }} />
        ))}

        {/* Controls Info */}
        <Box sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          color: '#fff',
          fontSize: '12px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '5px 10px',
          borderRadius: '5px'
        }}>
          WASD/Arrows: Move | Space: Double Shot
        </Box>
      </Box>
    </Container>
  );
};

export default BossBattle; 