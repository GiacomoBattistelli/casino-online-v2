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
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#fff', textShadow: '2px 2px 8px #000', mb: 4 }}>
          Scegli il tuo gioco
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {gameButtons.map((game) => (
            <Button
              key={game.key}
              component={Link}
              to={game.to}
              variant="contained"
              size="large"
              className="game-btn"
              sx={{
                height: 120,
                fontWeight: 700,
                fontSize: 24,
                borderRadius: 3,
                background: game.color,
                color: '#fff',
                '&:hover': { background: game.color, transform: 'scale(1.05)' }
              }}
            >
              {game.label}
            </Button>
          ))}
        </Box>
        <Button component={Link} to="/" variant="outlined" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>
          Torna alla Home
        </Button>
      </Container>
      
      {/* Banner pubblicitario non disturbante */}
      <AdBanner position="bottom" style={{ opacity: 0.8 }} />
    </Box>
  );
};

export default Games; 