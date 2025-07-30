import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const AdBanner = ({ position = 'bottom', style = {}, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Carica gli annunci AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log('AdSense not loaded');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const bannerStyles = {
    bottom: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      padding: '8px',
      textAlign: 'center',
      maxHeight: '80px', // Limita l'altezza massima
      overflow: 'hidden',
      ...style
    },
    top: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      padding: '8px',
      textAlign: 'center',
      maxHeight: '80px', // Limita l'altezza massima
      overflow: 'hidden',
      ...style
    },
    sidebar: {
      position: 'fixed',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '160px',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      padding: '10px',
      textAlign: 'center',
      maxHeight: '300px', // Limita l'altezza massima per sidebar
      overflow: 'hidden',
      ...style
    }
  };

  if (!isVisible) return null;

  return (
    <Box sx={bannerStyles[position]}>
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

export default AdBanner; 