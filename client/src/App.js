import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Blackjack from "./pages/Blackjack";
import Roulette from "./pages/Roulette";
import Slot from "./pages/Slot";
import Poker from "./pages/Poker";
import './App.css';
import { Avatar, Box, Typography, Snackbar, Alert } from "@mui/material";

function App({ location }) {
  // Stato utente semplificato: solo saldo locale
  const [saldo, setSaldo] = useState(() => {
    const savedSaldo = localStorage.getItem('casinoSaldo');
    return savedSaldo ? parseInt(savedSaldo) : 1000;
  });
  const [bonusNotification, setBonusNotification] = useState({ open: false, message: '' });

  // Salva saldo nel localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem('casinoSaldo', saldo.toString());
  }, [saldo]);

  // Aggiorna saldo quando cambia pagina
  useEffect(() => {
    const savedSaldo = localStorage.getItem('casinoSaldo');
    if (savedSaldo) {
      setSaldo(parseInt(savedSaldo));
    }
  }, [location]);

  // Funzione per aggiornare saldo
  const updateSaldo = (delta) => {
    const newSaldo = Math.max(0, saldo + delta);
    setSaldo(newSaldo);
    
    // Bonus salvavita se il saldo arriva a 0
    if (newSaldo === 0 && delta < 0) {
      const bonusSaldo = 100;
      setSaldo(bonusSaldo);
      setBonusNotification({
        open: true,
        message: '🎉 Bonus salvavita di 100€ applicato! Continua a giocare!'
      });
    }
  };

  return (
    <>
      {/* Header con saldo sempre visibile */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        zIndex: 2000, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '0 0 0 10px'
      }}>
        <Typography sx={{ 
          fontWeight: 900, 
          fontSize: 20, 
          color: saldo < 100 ? '#e53935' : saldo < 500 ? '#FFD600' : '#43a047', 
          textShadow: '1px 1px 6px #000' 
        }}>
          €{saldo}
        </Typography>
        <Typography sx={{ 
          fontWeight: 700, 
          fontSize: 18, 
          color: '#fff', 
          textShadow: '1px 1px 6px #000', 
          mr: 1 
        }}>
          Giocatore
        </Typography>
        <Avatar sx={{ width: 48, height: 48, border: '2px solid #FFD700' }}>🎲</Avatar>
      </Box>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/blackjack" element={
          <Blackjack saldo={saldo} updateSaldo={updateSaldo} />
        } />
        <Route path="/games/roulette" element={
          <Roulette saldo={saldo} updateSaldo={updateSaldo} />
        } />
        <Route path="/games/slot" element={
          <Slot saldo={saldo} updateSaldo={updateSaldo} />
        } />
        <Route path="/games/poker" element={
          <Poker saldo={saldo} updateSaldo={updateSaldo} />
        } />
      </Routes>

      {/* Notifica bonus salvavita */}
      <Snackbar 
        open={bonusNotification.open} 
        autoHideDuration={5000} 
        onClose={() => setBonusNotification({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setBonusNotification({ open: false, message: '' })} 
          severity="success" 
          sx={{ width: '100%', fontSize: '16px', fontWeight: 'bold' }}
        >
          {bonusNotification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function AppWithRouter() {
  const location = useLocation();
  return <App location={location} />;
}

function AppWrapper() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default AppWrapper;
