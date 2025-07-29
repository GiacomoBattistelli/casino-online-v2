import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";

const gameButtons = [
  { label: "Blackjack", to: "/games/blackjack", color: "#2E7D32", key: 'blackjack' },
  { label: "Roulette", to: "/games/roulette", color: "#1B5E20", key: 'roulette' },
  { label: "Slot", to: "/games/slot", color: "#388E3C", key: 'slot' },
  { label: "Poker", to: "/games/poker", color: "#4CAF50", key: 'poker' }
];

const Games = () => {
  return (
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
        
        .game-btn {
          transition: all 0.3s cubic-bezier(.68,-0.55,.27,1.55);
          position: relative;
          overflow: hidden;
        }
        
        .game-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .game-btn:hover::before {
          left: 100%;
        }
        
        .game-btn:hover {
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
        {[...Array(15)].map((_, i) => (
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
      
      <Container maxWidth="sm" sx={{ 
        textAlign: "center", 
        background: 'rgba(255,255,255,0.15)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
        py: 5, 
        px: 2,
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 2
      }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 800, 
            color: '#fff', 
            textShadow: '3px 3px 12px rgba(0,0,0,0.7)',
            fontSize: { xs: '2rem', sm: '3rem' },
            mb: 4,
            letterSpacing: '2px'
          }}
        >
          🎰 Scegli il tuo gioco 🎰
        </Typography>
        
        <Box sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          alignItems: 'center' 
        }}>
          {gameButtons.map(btn => (
            <Button
              key={btn.label}
              component={Link}
              to={btn.to}
              variant="contained"
              size="large"
              className="game-btn"
              sx={{
                width: { xs: 280, sm: 320 },
                height: 70,
                fontWeight: 800,
                fontSize: { xs: 20, sm: 24 },
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}dd 100%)`,
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}ff 100%)`,
                  border: '2px solid rgba(255,255,255,0.5)',
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                },
                '&:active': {
                  transform: 'scale(0.98) translateY(0px)'
                }
              }}
            >
              {btn.label}
            </Button>
          ))}
          
          <Button 
            component={Link} 
            to="/" 
            variant="outlined" 
            size="large" 
            sx={{ 
              width: { xs: 280, sm: 320 },
              height: 60,
              fontWeight: 700, 
              fontSize: 18, 
              borderRadius: 3, 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.8)', 
              borderWidth: 2,
              mt: 2, 
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
              '&:hover': { 
                background: 'rgba(255,255,255,0.15)', 
                borderColor: '#fff',
                borderWidth: 3,
                transform: 'scale(1.02)'
              } 
            }}
          >
            🏠 Torna alla Home
          </Button>
        </Box>
      </Container>
      
      {/* Banner pubblicitario non disturbante */}
      <AdBanner position="bottom" style={{ opacity: 0.8, zIndex: 3 }} />
    </Box>
  );
};

export default Games; 