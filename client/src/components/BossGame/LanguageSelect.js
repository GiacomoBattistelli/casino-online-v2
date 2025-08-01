import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const LanguageSelect = ({ onLanguageSelect }) => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h2" sx={{ 
        fontWeight: 900, 
        color: '#FF1744', 
        textShadow: '3px 3px 12px rgba(0,0,0,0.7)',
        mb: 4,
        fontSize: { xs: '2.5rem', md: '4rem' }
      }}>
        THE STORY OF LIFE
      </Typography>
      
      <Typography variant="h6" sx={{ 
        color: '#fff', 
        mb: 6, 
        maxWidth: 600, 
        mx: 'auto',
        lineHeight: 1.6
      }}>
        Scegli la tua lingua / Choose your language / Elige tu idioma
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => onLanguageSelect('it')}
          sx={{ 
            width: 300, 
            height: 60, 
            fontSize: 20, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4CAF50, #388E3C)',
            '&:hover': { background: 'linear-gradient(45deg, #388E3C, #2E7D32)' }
          }}
        >
          🇮🇹 Italiano
        </Button>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={() => onLanguageSelect('en')}
          sx={{ 
            width: 300, 
            height: 60, 
            fontSize: 20, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
            '&:hover': { background: 'linear-gradient(45deg, #1976D2, #1565C0)' }
          }}
        >
          🇺🇸 English
        </Button>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={() => onLanguageSelect('es')}
          sx={{ 
            width: 300, 
            height: 60, 
            fontSize: 20, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FF9800, #F57C00)',
            '&:hover': { background: 'linear-gradient(45deg, #F57C00, #EF6C00)' }
          }}
        >
          🇪🇸 Español
        </Button>
      </Box>
    </Container>
  );
};

export default LanguageSelect; 