import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const GameAd = ({ position = 'bottom', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Inizializza AdSense per la revisione
    const initializeAdSense = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense initialized successfully');
        } else {
          console.log('AdSense not loaded yet');
        }
      } catch (error) {
        console.log('AdSense initialization error:', error);
      }
    };

    // Aspetta che AdSense sia caricato
    if (window.adsbygoogle) {
      initializeAdSense();
    } else {
      // Se AdSense non è ancora caricato, aspetta
      const checkAdSense = setInterval(() => {
        if (window.adsbygoogle) {
          initializeAdSense();
          clearInterval(checkAdSense);
        }
      }, 100);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const adStyles = {
    bottom: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      padding: '6px',
      textAlign: 'center',
      borderTop: '2px solid #FFD700',
      maxHeight: '70px',
      overflow: 'hidden'
    },
    top: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      padding: '6px',
      textAlign: 'center',
      borderBottom: '2px solid #FFD700',
      maxHeight: '70px',
      overflow: 'hidden'
    },
    sidebar: {
      position: 'fixed',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '120px',
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      padding: '8px',
      textAlign: 'center',
      borderLeft: '2px solid #FFD700',
      display: { xs: 'none', md: 'block' },
      maxHeight: '250px',
      overflow: 'hidden'
    }
  };

  if (!isVisible) return null;

  return (
    <Box sx={adStyles[position]}>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            color: '#fff',
            background: 'rgba(0,0,0,0.8)',
            '&:hover': { background: 'rgba(255,0,0,0.8)' },
            zIndex: 1001
          }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
        
        {/* AdSense Banner - Configurato per la revisione */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5106528328416590"
          data-ad-slot="YOUR_AD_SLOT_ID"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </Box>
    </Box>
  );
};

export default GameAd; 