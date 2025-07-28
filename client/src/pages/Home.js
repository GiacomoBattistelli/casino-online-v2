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
      .home-btn {
        transition: transform 0.18s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.18s;
      }
      .home-btn:hover {
        transform: scale(1.08) rotate(-2deg);
        box-shadow: 0 8px 32px #0006;
        filter: brightness(1.1);
      }
    `}</style>
    <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, letterSpacing: 2, color: '#fff', textShadow: '2px 2px 8px #000' }}>
      Casino Online
    </Typography>
    <Typography variant="h5" sx={{ mb: 3, color: '#fff', textShadow: '1px 1px 6px #000' }}>
      Vivi l'emozione del gioco in un ambiente sicuro e responsabile!
    </Typography>
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Button component={Link} to="/games" variant="contained" size="large" className="home-btn" sx={{ width: 260, fontWeight: 700, fontSize: 22, borderRadius: 3, boxShadow: 3, background: '#7b2ff2', color: '#fff', '&:hover': { background: '#512da8' } }}>Inizia a Giocare</Button>
    </Box>
    
    {/* Banner pubblicitario non disturbante */}
    <AdBanner position="bottom" style={{ opacity: 0.8 }} />
  </Box>
);

export default Home;