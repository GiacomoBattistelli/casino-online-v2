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
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      padding: '4px',
      textAlign: 'center',
      maxHeight: '40px',
      overflow: 'hidden',
      fontSize: '0.85rem',
      ...style
    },
    top: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      padding: '4px',
      textAlign: 'center',
      maxHeight: '40px',
      overflow: 'hidden',
      fontSize: '0.85rem',
      ...style
    },
    sidebar: {
      position: 'fixed',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '80px',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      padding: '4px',
      textAlign: 'center',
      maxHeight: '80px',
      overflow: 'hidden',
      fontSize: '0.75rem',
      ...style
    }
  };

  if (!isVisible) return null;

  return (
    <Box sx={bannerStyles[position]}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: '#fff',
            background: 'rgba(0,0,0,0.7)',
            '&:hover': { background: 'rgba(255,0,0,0.7)' },
            zIndex: 1001,
            p: '2px',
            width: '24px',
            height: '24px'
          }}
          size="small"
        >
          <Close fontSize="inherit" />
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