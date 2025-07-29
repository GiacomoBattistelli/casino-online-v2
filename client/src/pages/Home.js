import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import AdBanner from "../components/AdBanner";

const Home = () => (
  <Box sx={{
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #2E7D32 0%, #4CAF50 25%, #66BB6A 50%, #81C784 75%, #A5D6A7 100%)',
    backgroundSize: '400% 400%',
    animation: 'greenPulse 8s ease-in-out infinite',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <style>{`
      @keyframes greenPulse {
        0% { 
          background-position: 0% 50%; 
          filter: brightness(1);
        }
        25% { 
          background-position: 25% 50%; 
          filter: brightness(1.1);
        }
        50% { 
          background-position: 50% 50%; 
          filter: brightness(1.2);
        }
        75% { 
          background-position: 75% 50%; 
          filter: brightness(1.1);
        }
        100% { 
          background-position: 100% 50%; 
          filter: brightness(1);
        }
      }
      
      .home-btn {
        transition: all 0.3s cubic-bezier(.68,-0.55,.27,1.55);
        position: relative;
        overflow: hidden;
      }
      
      .home-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
      }
      
      .home-btn:hover::before {
        left: 100%;
      }
      
      .home-btn:hover {
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        filter: brightness(1.2);
      }
      
      .floating-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }
      
      .particle {
        position: absolute;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
      }
    `}</style>
    
    {/* Particelle animate di sfondo */}
    <div className="floating-particles">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`
          }}
        />
      ))}
    </div>
    
    <Box sx={{
      textAlign: 'center',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      py: 5,
      px: 4,
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      zIndex: 2,
      maxWidth: '90%'
    }}>
      <Typography 
        variant="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 800, 
          letterSpacing: 3, 
          color: '#fff', 
          textShadow: '3px 3px 12px rgba(0,0,0,0.7)',
          fontSize: { xs: '2.5rem', sm: '3.5rem' },
          mb: 2
        }}
      >
        🎰 Casino Online 🎰
      </Typography>
      
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, 
          color: '#fff', 
          textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: 500
        }}
      >
        Vivi l'emozione del gioco in un ambiente sicuro e responsabile!
      </Typography>
      
      <Box sx={{ 
        my: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        alignItems: 'center' 
      }}>
        <Button 
          component={Link} 
          to="/games" 
          variant="contained" 
          size="large" 
          className="home-btn" 
          sx={{ 
            width: { xs: 280, sm: 320 },
            height: 70,
            fontWeight: 800, 
            fontSize: { xs: 20, sm: 24 }, 
            borderRadius: 3, 
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)',
              border: '2px solid rgba(255,255,255,0.5)',
              transform: 'scale(1.05) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
            },
            '&:active': {
              transform: 'scale(0.98) translateY(0px)'
            }
          }}
        >
          🚀 Inizia a Giocare
        </Button>
      </Box>
    </Box>
    
    {/* Banner pubblicitario non disturbante */}
    <AdBanner position="bottom" style={{ opacity: 0.8, zIndex: 3 }} />
  </Box>
);

export default Home;