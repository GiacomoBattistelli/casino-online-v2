import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";

const gameButtons = [
  { label: "Blackjack", to: "/games/blackjack", color: "#f357a8", key: 'blackjack' },
  { label: "Roulette", to: "/games/roulette", color: "#FFD700", key: 'roulette' },
  { label: "Slot", to: "/games/slot", color: "#7b2ff2", key: 'slot' },
  { label: "Poker", to: "/games/poker", color: "#00e676", key: 'poker' }
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
      background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      animation: 'bgmove 10s ease-in-out infinite alternate',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes bgmove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .game-btn {
          transition: transform 0.18s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.18s;
        }
        .game-btn:hover {
          transform: scale(1.08) rotate(-2deg);
          box-shadow: 0 8px 32px #0006;
          filter: brightness(1.1);
        }
      `}</style>
      <Container maxWidth="sm" sx={{ textAlign: "center", background: 'rgba(255,255,255,0.07)', borderRadius: 4, boxShadow: 6, py: 5, px: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#fff', textShadow: '2px 2px 8px #000' }}>
          Scegli il tuo gioco
        </Typography>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {gameButtons.map(btn => (
            <Button
              key={btn.label}
              component={Link}
              to={btn.to}
              variant="contained"
              size="large"
              className="game-btn"
              sx={{
                width: 260,
                fontWeight: 700,
                fontSize: 24,
                borderRadius: 3,
                boxShadow: 3,
                background: btn.color,
                color: btn.color === '#FFD700' ? '#222' : '#fff',
                '&:hover': {
                  background: btn.color,
                  filter: 'brightness(1.1)'
                }
              }}
            >
              {btn.label}
            </Button>
          ))}
          <Button component={Link} to="/" variant="outlined" size="large" sx={{ width: 260, fontWeight: 700, fontSize: 20, borderRadius: 3, color: '#fff', borderColor: '#fff', mt: 2, '&:hover': { background: '#fff2', borderColor: '#fff' } }}>
            Torna alla Home
          </Button>
        </Box>
      </Container>
      
      {/* Banner pubblicitario non disturbante */}
      <AdBanner position="bottom" style={{ opacity: 0.8 }} />
    </Box>
  );
};

export default Games; 