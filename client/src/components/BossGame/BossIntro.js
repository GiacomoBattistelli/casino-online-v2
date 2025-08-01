import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const BossIntro = ({ boss, onStartBattle, onSkip }) => {
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 1s ease-in'
    }}>
      {/* Animated Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${boss.color}20 0%, transparent 70%)`,
        animation: 'pulse 3s ease-in-out infinite'
      }} />
      
      <Paper sx={{
        maxWidth: 800,
        mx: 2,
        p: 4,
        background: 'rgba(0,0,0,0.9)',
        border: `3px solid ${boss.color}`,
        borderRadius: 3,
        boxShadow: `0 0 30px ${boss.color}50`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, ${boss.color}20 50%, transparent 70%)`,
          animation: 'shimmer 2s ease-in-out infinite'
        }
      }}>
        {/* Boss Name */}
        <Typography variant="h2" sx={{
          textAlign: 'center',
          mb: 3,
          color: boss.color,
          fontWeight: 900,
          textShadow: `0 0 20px ${boss.color}`,
          fontSize: { xs: '2rem', md: '3rem' },
          animation: 'titleGlow 2s ease-in-out infinite alternate'
        }}>
          {boss.name}
        </Typography>
        
        {/* Boss Description */}
        <Typography variant="body1" sx={{
          mb: 4,
          color: '#fff',
          fontSize: { xs: '1rem', md: '1.2rem' },
          lineHeight: 1.8,
          textAlign: 'justify',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          animation: 'fadeInUp 1.5s ease-out'
        }}>
          {boss.description}
        </Typography>
        
        {/* Boss Stats */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#FF5722', fontWeight: 'bold' }}>
              ❤️ Vita
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {boss.maxHealth}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              ⚡ Velocità
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {boss.speed}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
              🎯 Attacco
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {(boss.attackRate * 100).toFixed(1)}%
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
              🔮 Abilità
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {boss.specialAbility}
            </Typography>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          flexWrap: 'wrap'
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={onStartBattle}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${boss.color}, ${boss.color}dd)`,
              border: `2px solid ${boss.color}`,
              '&:hover': {
                background: `linear-gradient(45deg, ${boss.color}dd, ${boss.color})`,
                transform: 'scale(1.05)',
                boxShadow: `0 8px 25px ${boss.color}50`
              },
              transition: 'all 0.3s ease',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            ⚔️ Affronta il Boss
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={onSkip}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#FFD700',
              borderColor: '#FFD700',
              '&:hover': {
                backgroundColor: '#FFD700',
                color: '#000',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            ⏭️ Salta Intro
          </Button>
        </Box>
      </Paper>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes titleGlow {
            from { textShadow: 0 0 20px ${boss.color}; }
            to { textShadow: 0 0 30px ${boss.color}, 0 0 40px ${boss.color}; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default BossIntro; 