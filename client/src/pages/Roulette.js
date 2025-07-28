import React, { useState } from "react";
import { Container, Typography, Box, Button, Stack, Chip, Select, MenuItem, Slider } from "@mui/material";
import { Link } from "react-router-dom";

const numbers = Array.from({length: 37}, (_, i) => i);
const colors = n => n === 0 ? 'Verde' : ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n) ? 'Rosso' : 'Nero');
const dozzina = n => n === 0 ? '-' : n <= 12 ? '1-12' : n <= 24 ? '13-24' : '25-36';
const payoutTable = { numero: 35, colore: 2, paridispari: 2, dozzina: 3 };

const Confetti = ({ show }) => show ? (
  <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
    {[...Array(60)].map((_, i) => (
      <Box key={i} sx={{ position: 'absolute', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 12, height: 12, borderRadius: '50%', background: `hsl(${Math.random()*360},90%,60%)`, opacity: 0.8, animation: `fall${i} 1.5s linear forwards`, animationDelay: `${Math.random()}s` }}>
        <style>{`@keyframes fall${i} {0% { transform: translateY(-100px) scale(1); opacity: 1; }100% { transform: translateY(600px) scale(0.7); opacity: 0; }}`}</style>
      </Box>
    ))}
  </Box>
) : null;

const Roulette = ({ saldo, updateSaldo }) => {
  const [bet, setBet] = useState(10);
  const [betNumber, setBetNumber] = useState(0);
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ballAngle, setBallAngle] = useState(0);
  const [highlight, setHighlight] = useState(null);
  const [flashNumbers, setFlashNumbers] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedParity, setSelectedParity] = useState('');

  const sendRecordUpdate = (game, amount) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/leaderboard/win', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ game, amount })
    });
    fetch('/api/leaderboard/win', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ game: 'overall', amount })
    });
  };

  // Rimuovo tutte le logiche demo e user, uso solo saldo e updateSaldo
  const isDemo = false; // Always false as per new_code
  const maxDemoBets = 7; // Keep this for now, though not used in new_code
  const isDemoLimit = false; // Always false as per new_code

  const toggleNumber = n => {
    setSelectedNumbers(nums => nums.includes(n) ? nums.filter(x => x !== n) : [...nums, n]);
  };

  const handleColor = color => {
    setSelectedColor(c => c === color ? '' : color);
  };

  const handleParity = parity => {
    setSelectedParity(p => p === parity ? '' : parity);
  };

  const placeBet = async () => {
    if (bet < 1 || bet > saldo) {
      setMessage('Puntata non valida.');
      return;
    }
    if (selectedNumbers.length === 0 && !selectedColor && !selectedParity) {
      setMessage('Seleziona almeno una puntata.');
      return;
    }
    setSpinning(true);
    setBallAngle(0);
    setHighlight(null);
    setFlashNumbers(true);
    setTimeout(() => setFlashNumbers(false), 3200);
    setTimeout(async () => {
      // LOGICA VINCITA FACILITATA
      // outcome < 0.015 tripla, < 0.03 doppia
      let outcome = Math.random();
      let triple = outcome < 0.015;
      let double = !triple && outcome < 0.03;
      let result = Math.floor(Math.random() * 37);
      let win = false;
      let payout = 0;
      // Numeri
      if (selectedNumbers.includes(result)) {
        win = true;
        payout += (bet / (selectedNumbers.length + (selectedColor ? 1 : 0) + (selectedParity ? 1 : 0))) * payoutTable.numero;
      }
      // Colore
      if (selectedColor && colors(result) === selectedColor) {
        win = true;
        payout += (bet / (selectedNumbers.length + (selectedColor ? 1 : 0) + (selectedParity ? 1 : 0))) * payoutTable.colore;
      }
      // Pari/Dispari
      if (selectedParity && result !== 0 && ((selectedParity === 'Pari' && result % 2 === 0) || (selectedParity === 'Dispari' && result % 2 === 1))) {
        win = true;
        payout += (bet / (selectedNumbers.length + (selectedColor ? 1 : 0) + (selectedParity ? 1 : 0))) * payoutTable.paridispari;
      }
      if (win) updateSaldo(payout);
      else updateSaldo(-bet);
      setLastResult(result);
      setMessage(win ? `Numero uscito: ${result}. Hai vinto €${Math.round(payout)}!` : `Numero uscito: ${result}. Hai perso!`);
      setHistory(h => [{ result, selectedNumbers, selectedColor, selectedParity, win, payout: win ? '+'+Math.round(payout) : '-'+bet, saldo: (win ? saldo + Math.round(payout) : saldo - bet) }, ...h].slice(0,10));
      setSpinning(false);
      setShowConfetti(win);
      setHighlight(result);
      setSelectedNumbers([]);
      setSelectedColor('');
      setSelectedParity('');
      if (win) setTimeout(() => setShowConfetti(false), 1800);
    }, 3200);
    // Animazione pallina
    let angle = 0;
    let interval = setInterval(() => {
      angle += 18;
      setBallAngle(angle % 360);
    }, 40);
    setTimeout(() => clearInterval(interval), 3200);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 40%, #388e3c 60%, #222 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Confetti show={showConfetti} />
      <Container maxWidth="sm" sx={{
        mt: 4,
        mb: 4,
        px: { xs: 1, sm: 3 },
        py: 3,
        background: 'rgba(30,30,40,0.92)',
        borderRadius: 5,
        boxShadow: '0 0 32px #000a, 0 0 0 4px #FFD70044',
        border: '2px solid #FFD700',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#FFD700', textShadow: '2px 2px 8px #000' }}>Roulette</Typography>
        {/* In alto, mostra sempre il saldo demo se isDemo */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, fontSize: 22, textShadow: '1px 1px 6px #000', color: saldo < 100 ? '#e53935' : saldo < 500 ? '#FFD600' : '#43a047' }}>
          Saldo: €{saldo} {isDemo && '(DEMO)'}
        </Typography>
        <Button component={Link} to="/games" variant="contained" color="secondary" sx={{ mb: 2, fontWeight: 700, fontSize: 18, borderRadius: 3 }}>Torna al menu</Button>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Puntata:</Typography>
          <Button variant="contained" color="error" onClick={() => setBet(b => Math.max(1, b-1))} disabled={spinning} sx={{ minWidth: 36, minHeight: 36, fontWeight: 900, fontSize: 20, borderRadius: 2 }}>-</Button>
          <Typography variant="h6" sx={{ mx: 1, color: '#FFD700', minWidth: 40, fontWeight: 900 }}>{bet}</Typography>
          <Button variant="contained" color="error" onClick={() => setBet(b => b+1)} disabled={spinning} sx={{ minWidth: 36, minHeight: 36, fontWeight: 900, fontSize: 20, borderRadius: 2 }}>+</Button>
        </Box>
        <Button variant="contained" color="success" onClick={() => placeBet()} disabled={spinning || isDemoLimit} sx={{ fontWeight: 900, fontSize: 22, px: 4, py: 1.5, mb: 2, mt: 1, borderRadius: 3, boxShadow: '0 0 16px #FFD70088' }}>Gira la ruota</Button>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700, fontSize: 20, mb: 1 }}>Scegli la/e puntata/e:</Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant={selectedColor === 'Rosso' ? "contained" : "outlined"} color="error" onClick={() => handleColor('Rosso')} disabled={spinning} sx={{ fontWeight: 900, fontSize: 22, minWidth: 120, minHeight: 56, background: selectedColor === 'Rosso' ? '#d32f2f' : '#fff', color: selectedColor === 'Rosso' ? '#fff' : '#d32f2f', border: '3px solid #d32f2f', boxShadow: selectedColor === 'Rosso' ? '0 0 16px #d32f2f' : 'none', textTransform: 'uppercase', letterSpacing: 1, '&:hover': { background: '#d32f2f', color: '#fff' } }}>Rosso</Button>
            <Button variant={selectedColor === 'Nero' ? "contained" : "outlined"} color="primary" onClick={() => handleColor('Nero')} disabled={spinning} sx={{ fontWeight: 900, fontSize: 22, minWidth: 120, minHeight: 56, background: selectedColor === 'Nero' ? '#222' : '#fff', color: selectedColor === 'Nero' ? '#fff' : '#222', border: '3px solid #222', boxShadow: selectedColor === 'Nero' ? '0 0 16px #222' : 'none', textTransform: 'uppercase', letterSpacing: 1, '&:hover': { background: '#222', color: '#fff' } }}>Nero</Button>
            <Button variant={selectedColor === 'Verde' ? "contained" : "outlined"} color="success" onClick={() => handleColor('Verde')} disabled={spinning} sx={{ fontWeight: 900, fontSize: 22, minWidth: 120, minHeight: 56, background: selectedColor === 'Verde' ? '#43a047' : '#fff', color: selectedColor === 'Verde' ? '#fff' : '#43a047', border: '3px solid #43a047', boxShadow: selectedColor === 'Verde' ? '0 0 16px #43a047' : 'none', textTransform: 'uppercase', letterSpacing: 1, '&:hover': { background: '#43a047', color: '#fff' } }}>Verde</Button>
            <Button variant={selectedParity === 'Pari' ? "contained" : "outlined"} color="info" onClick={() => handleParity('Pari')} disabled={spinning} sx={{ fontWeight: 900, fontSize: 22, minWidth: 120, minHeight: 56, background: selectedParity === 'Pari' ? '#1976d2' : '#fff', color: selectedParity === 'Pari' ? '#fff' : '#1976d2', border: '3px solid #1976d2', boxShadow: selectedParity === 'Pari' ? '0 0 16px #1976d2' : 'none', textTransform: 'uppercase', letterSpacing: 1, '&:hover': { background: '#1976d2', color: '#fff' } }}>Pari</Button>
            <Button variant={selectedParity === 'Dispari' ? "contained" : "outlined"} color="warning" onClick={() => handleParity('Dispari')} disabled={spinning} sx={{ fontWeight: 900, fontSize: 22, minWidth: 120, minHeight: 56, background: selectedParity === 'Dispari' ? '#ff9800' : '#fff', color: selectedParity === 'Dispari' ? '#fff' : '#ff9800', border: '3px solid #ff9800', boxShadow: selectedParity === 'Dispari' ? '0 0 16px #ff9800' : 'none', textTransform: 'uppercase', letterSpacing: 1, '&:hover': { background: '#ff9800', color: '#fff' } }}>Dispari</Button>
          </Box>
          {selectedNumbers.length > 0 && (
            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 900, mb: 1, textAlign: 'center', letterSpacing: 1, fontSize: 18 }}>
              Numeri selezionati: {selectedNumbers.sort((a,b)=>a-b).join(', ')}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 900, mb: 1, textAlign: 'center', letterSpacing: 1, fontSize: 18 }}>Numeri Rossi</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#222', borderRadius: 2, p: 1, boxShadow: 2 }}>
                {numbers.filter(n => colors(n) === 'Rosso').map(n => (
                  <Button
                    key={n}
                    variant={selectedNumbers.includes(n) ? "contained" : "outlined"}
                    color="error"
                    onClick={() => toggleNumber(n)}
                    disabled={spinning}
                    sx={{
                      minWidth: 38,
                      minHeight: 38,
                      fontWeight: 900,
                      fontSize: 18,
                      border: highlight === n ? '3px solid #FFD700' : '2px solid #fff',
                      background: highlight === n ? '#FFD700' : selectedNumbers.includes(n) ? '#d32f2f' : '#d32f2f',
                      color: highlight === n ? '#222' : '#fff',
                      boxShadow: highlight === n ? '0 0 12px #FFD700' : selectedNumbers.includes(n) ? '0 0 8px #fff' : undefined,
                      transition: 'all 0.2s',
                      textShadow: '1px 1px 4px #000',
                      borderRadius: 2,
                    }}
                  >
                    {n}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#222', fontWeight: 900, mb: 1, textAlign: 'center', letterSpacing: 1, background: '#fff', borderRadius: 1, px: 1, fontSize: 18 }}>Numeri Neri</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#222', borderRadius: 2, p: 1, boxShadow: 2 }}>
                {numbers.filter(n => colors(n) === 'Nero').map(n => (
                  <Button
                    key={n}
                    variant={selectedNumbers.includes(n) ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => toggleNumber(n)}
                    disabled={spinning}
                    sx={{
                      minWidth: 38,
                      minHeight: 38,
                      fontWeight: 900,
                      fontSize: 18,
                      border: highlight === n ? '3px solid #FFD700' : '2px solid #fff',
                      background: highlight === n ? '#FFD700' : selectedNumbers.includes(n) ? '#222' : '#222',
                      color: highlight === n ? '#222' : '#fff',
                      boxShadow: highlight === n ? '0 0 12px #FFD700' : selectedNumbers.includes(n) ? '0 0 8px #fff' : undefined,
                      transition: 'all 0.2s',
                      textShadow: '1px 1px 4px #000',
                      borderRadius: 2,
                    }}
                  >
                    {n}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Typography variant="h6" sx={{ color: '#43a047', fontWeight: 900, mb: 1, textAlign: 'center', letterSpacing: 1, fontSize: 18 }}>Zero</Typography>
              <Button
                variant={selectedNumbers.includes(0) ? "contained" : "outlined"}
                color="success"
                onClick={() => toggleNumber(0)}
                disabled={spinning}
                sx={{
                  minWidth: 38,
                  minHeight: 38,
                  fontWeight: 900,
                  fontSize: 18,
                  border: highlight === 0 ? '3px solid #FFD700' : '2px solid #fff',
                  background: highlight === 0 ? '#FFD700' : selectedNumbers.includes(0) ? '#43a047' : '#43a047',
                  color: highlight === 0 ? '#222' : '#fff',
                  boxShadow: highlight === 0 ? '0 0 12px #FFD700' : selectedNumbers.includes(0) ? '0 0 8px #fff' : undefined,
                  transition: 'all 0.2s',
                  textShadow: '1px 1px 4px #000',
                  borderRadius: 2,
                }}
              >
                0
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 340, height: 340, mx: 'auto', mb: 2 }}>
            {/* Ruota roulette SVG migliorata */}
            <svg width="340" height="340" viewBox="0 0 340 340">
              <defs>
                <radialGradient id="wheel3d" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="60%" stopColor="#888" />
                  <stop offset="100%" stopColor="#222" />
                </radialGradient>
              </defs>
              <circle cx="170" cy="170" r="160" fill="url(#wheel3d)" stroke="#fff" strokeWidth="8" />
              {[...Array(37)].map((_, i) => {
                const angle = (i / 37) * 2 * Math.PI;
                const x = 170 + 145 * Math.cos(angle - Math.PI/2 - Math.PI/37);
                const y = 170 + 145 * Math.sin(angle - Math.PI/2 - Math.PI/37);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="20" fill={i === 0 ? '#43a047' : colors(i) === 'Rosso' ? '#d32f2f' : '#222'} stroke="#fff" strokeWidth="2" />
                    <text x={x} y={y+8} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">{i}</text>
                  </g>
                );
              })}
              {/* Pallina animata */}
              <circle
                cx={170 + 125 * Math.cos((ballAngle-90)*Math.PI/180)}
                cy={170 + 125 * Math.sin((ballAngle-90)*Math.PI/180)}
                r="14"
                fill="#FFD700"
                stroke="#fff"
                strokeWidth="4"
                style={{ transition: spinning ? 'none' : 'all 0.5s cubic-bezier(.68,-0.55,.27,1.55)' }}
              />
            </svg>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ minHeight: 32, color: '#fff', fontWeight: 700 }}>{message}</Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Ultime giocate</Typography>
          {history.length === 0 && <Typography variant="body2" sx={{ color: '#fff' }}>Nessuna giocata.</Typography>}
          {history.map((h, i) => (
            <Box key={i} sx={{ my: 1, p: 1, border: '1px solid #eee', borderRadius: 2, background: 'rgba(123,47,242,0.05)' }}>
              <Typography variant="body2">Numero puntato: {h.selectedNumbers.join(', ')}</Typography>
              <Typography variant="body2">Colore: {h.selectedColor || 'Nessuno'}</Typography>
              <Typography variant="body2">Pari/Dispari: {h.selectedParity || 'Nessuno'}</Typography>
              <Typography variant="body2">Risultato: {h.result} | {h.win ? 'Vinto' : 'Perso'} | Saldo: €{h.saldo} | {h.payout}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 4, color: '#FFD700', fontWeight: 700, textAlign: 'center', textShadow: '1px 1px 6px #000' }}>
          ⚡️ ATTENZIONE: Questa roulette contiene animazioni e colori lampeggianti che potrebbero causare crisi epilettiche fotosensibili.<br/>
          Se sei sensibile a luci o colori forti, gioca con cautela.
        </Typography>
      </Container>
    </Box>
  );
};

export default Roulette; 