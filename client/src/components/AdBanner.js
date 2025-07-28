import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const AdBanner = ({ position = 'bottom', style = {} }) => {
  useEffect(() => {
    // Carica gli annunci AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log('AdSense not loaded');
    }
  }, []);

  const bannerStyles = {
    bottom: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      padding: '10px',
      textAlign: 'center',
      ...style
    },
    top: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      padding: '10px',
      textAlign: 'center',
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
      ...style
    }
  };

  return (
    <Box sx={bannerStyles[position]}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5106528328416590"
        data-ad-slot="YOUR_AD_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
};

export default AdBanner; 