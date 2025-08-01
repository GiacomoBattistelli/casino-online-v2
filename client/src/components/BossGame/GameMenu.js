import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const GameMenu = ({ 
  t, 
  gameProgress, 
  onStartNewGame, 
  onContinueGame, 
  onLanguageSelect,
  onEnableAudio,
  audioStatus
}) => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255,23,68,0.1) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(76,175,80,0.1) 0%, transparent 50%)',
        animation: 'pulse 6s ease-in-out infinite reverse'
      }} />
      
      <Container maxWidth="md">
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          
          {/* Main Title with Glow Effect */}
          <Box sx={{
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              right: '-20px',
              bottom: '-20px',
              background: 'radial-gradient(circle, rgba(255,23,68,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              animation: 'glow 3s ease-in-out infinite alternate'
            }
          }}>
            <Typography variant="h1" sx={{ 
              mb: 2, 
              color: '#FF1744',
              fontWeight: 900,
              textShadow: '0 0 30px rgba(255,23,68,0.8), 3px 3px 12px rgba(0,0,0,0.8)',
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              letterSpacing: '0.1em',
              animation: 'titleGlow 2s ease-in-out infinite alternate'
            }}>
              THE STORY OF LIFE
            </Typography>
          </Box>
          
          {/* Subtitle with Typewriter Effect */}
          <Typography variant="h5" sx={{ 
            mb: 6, 
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            fontStyle: 'italic',
            opacity: 0.9,
            animation: 'fadeInUp 1s ease-out'
          }}>
            {t.subtitle}
          </Typography>
          
          {/* Progress Indicator */}
          {gameProgress.currentLevel > 1 && (
            <Paper sx={{
              mb: 4,
              p: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3
            }}>
              <Typography variant="body1" sx={{ color: '#4CAF50', mb: 1 }}>
                Progresso: Capitolo {gameProgress.currentLevel - 1} di 24
              </Typography>
              <Box sx={{
                width: '100%',
                height: 8,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: `${((gameProgress.currentLevel - 1) / 24) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
                  transition: 'width 0.5s ease'
                }} />
              </Box>
            </Paper>
          )}
          
          {/* Menu Buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3, 
            width: '100%', 
            maxWidth: 450,
            animation: 'fadeInUp 1.5s ease-out'
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={onStartNewGame}
              sx={{
                py: 3,
                px: 6,
                fontSize: 20,
                fontWeight: 800,
                background: 'linear-gradient(45deg, #FF1744, #D50000)',
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': { 
                  background: 'linear-gradient(45deg, #D50000, #B71C1C)',
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255,23,68,0.4)'
                },
                transition: 'all 0.3s ease',
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(255,23,68,0.3)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {t.startNew}
            </Button>
            
            {gameProgress.currentLevel > 1 && (
              <Button
                variant="outlined"
                size="large"
                onClick={onContinueGame}
                sx={{
                  py: 3,
                  px: 6,
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#4CAF50',
                  borderColor: '#4CAF50',
                  borderWidth: 2,
                  '&:hover': { 
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    transform: 'scale(1.05) translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(76,175,80,0.4)'
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {t.continueStory}
              </Button>
            )}
            
            <Button
              variant="outlined"
              size="large"
              onClick={onEnableAudio}
              sx={{
                py: 2,
                px: 4,
                fontSize: 16,
                fontWeight: 600,
                color: audioStatus?.isEnabled ? '#4CAF50' : '#FFD700',
                borderColor: audioStatus?.isEnabled ? '#4CAF50' : '#FFD700',
                borderWidth: 2,
                '&:hover': { 
                  backgroundColor: audioStatus?.isEnabled ? '#4CAF50' : '#FFD700',
                  color: audioStatus?.isEnabled ? '#fff' : '#000',
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: `0 8px 25px rgba(${audioStatus?.isEnabled ? '76,175,80' : '255,215,0'},0.4)`
                },
                transition: 'all 0.3s ease',
                borderRadius: 2,
                boxShadow: `0 4px 15px rgba(${audioStatus?.isEnabled ? '76,175,80' : '255,215,0'},0.3)`,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {audioStatus?.isEnabled ? '🔊 Audio Attivo' : '🔇 Abilita Audio'}
            </Button>
            

            
            <Button
              component={Link}
              to="/games"
              variant="text"
              size="large"
              sx={{
                py: 2,
                px: 4,
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease',
                borderRadius: 2
              }}
            >
              {t.backToMenu}
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes glow {
            0% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 0.8; transform: scale(1.1); }
          }
          @keyframes titleGlow {
            0% { textShadow: 0 0 30px rgba(255,23,68,0.8), 3px 3px 12px rgba(0,0,0,0.8); }
            100% { textShadow: 0 0 50px rgba(255,23,68,1), 3px 3px 12px rgba(0,0,0,0.8); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default GameMenu; 