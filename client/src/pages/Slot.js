import React, { useState } from "react";
import { Container, Typography, Box, Button, TextField, Stack, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import GameAd from "../components/GameAd";

// Simboli con pesi diversi per slot più realistica
const slotTypes = {
  classica: [
    ...Array(8).fill({ symbol: '🍒', payout: 5 }),
    ...Array(6).fill({ symbol: '🍋', payout: 10 }),
    ...Array(4).fill({ symbol: '🔔', payout: 20 }),
    ...Array(3).fill({ symbol: '🍀', payout: 30 }),
    ...Array(2).fill({ symbol: '💎', payout: 50 }),
    { symbol: '7️⃣', payout: 100 },
    { symbol: '⭐', payout: 200 }
  ],
  frutta: [
    ...Array(8).fill({ symbol: '🍎', payout: 5 }),
    ...Array(6).fill({ symbol: '🍌', payout: 10 }),
    ...Array(4).fill({ symbol: '🍉', payout: 20 }),
    ...Array(3).fill({ symbol: '🍇', payout: 30 }),
    ...Array(2).fill({ symbol: '🍓', payout: 50 }),
    { symbol: '🍍', payout: 100 },
    { symbol: '🥝', payout: 200 }
  ],
  luxury: [
    ...Array(8).fill({ symbol: '💰', payout: 5 }),
    ...Array(6).fill({ symbol: '💎', payout: 10 }),
    ...Array(4).fill({ symbol: '👑', payout: 20 }),
    ...Array(3).fill({ symbol: '🏆', payout: 30 }),
    ...Array(2).fill({ symbol: '🛥️', payout: 50 }),
    { symbol: '🏰', payout: 100 },
    { symbol: '🛩️', payout: 200 }
  ]
};
const slotReelCount = 3;
const windowSize = 3; // simboli visibili per rullo

const Confetti = ({ show }) => show ? (
  <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
    {[...Array(60)].map((_, i) => (
      <Box key={i} sx={{ position: 'absolute', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 12, height: 12, borderRadius: '50%', background: `hsl(${Math.random()*360},90%,60%)`, opacity: 0.8, animation: `fall${i} 1.5s linear forwards`, animationDelay: `${Math.random()}s` }}>
        <style>{`@keyframes fall${i} {0% { transform: translateY(-100px) scale(1); opacity: 1; }100% { transform: translateY(600px) scale(0.7); opacity: 0; }}`}</style>
      </Box>
    ))}
  </Box>
) : null;

const Slot = ({ saldo, updateSaldo }) => {
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState([Array(windowSize).fill(null), Array(windowSize).fill(null), Array(windowSize).fill(null)]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [reelAnim, setReelAnim] = useState([false, false, false]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [slotType, setSlotType] = useState('classica');




  // Rimuovo tutte le logiche demo e user, uso solo saldo e updateSaldo
  const spin = async () => {
    if (spinning) return;
    if (bet < 1 || bet > saldo) {
      setMessage('Puntata non valida.');
      return;
    }
    setSpinning(true);
    updateSaldo(-bet);
    setMessage('');
    setReelAnim([true, true, true]);
    const symbols = slotTypes[slotType];
    let newReelSymbols = [[], [], []];
    let final = [];
    // LOGICA CASINO REALE
    // 1 su 100: tripla (jackpot)
    // 1 su 14: doppia (bassa)
    // resto: nulla
    let outcome = Math.random();
    let triple = outcome < 0.01; // 1 su 100
    let double = !triple && outcome < 0.01 + 0.07; // 1 su 14 circa
    let chosenSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    if (triple) {
      final = [chosenSymbol, chosenSymbol, chosenSymbol];
    } else if (double) {
      let s1 = symbols[Math.floor(Math.random() * symbols.length)];
      let s2 = symbols[Math.floor(Math.random() * symbols.length)];
      let pos = Math.floor(Math.random() * 3);
      final = [s1, s2, s2];
      if (pos === 0) final = [s2, s2, s1];
      if (pos === 1) final = [s2, s1, s2];
    } else {
      // Nessuna combinazione vincente
      for (let i = 0; i < 3; i++) {
        let s;
        do {
          s = symbols[Math.floor(Math.random() * symbols.length)];
        } while (i > 0 && s.symbol === final[i-1].symbol);
        final.push(s);
      }
    }
    for (let i = 0; i < slotReelCount; i++) {
      for (let j = 0; j < 20; j++) {
        newReelSymbols[i].push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
      newReelSymbols[i][19] = final[i];
    }

    setTimeout(async () => {
      const windowed = final.map((_, i) => {
        const idx = 19;
        return newReelSymbols[i].slice(idx - Math.floor(windowSize/2), idx + Math.ceil(windowSize/2));
      });
      setReels(windowed);
      setReelAnim([false, false, false]);
      let payout = 0;
      let win = false;
      if (triple) {
        payout = final[0].payout * bet;
        win = true;
        updateSaldo(payout);
        setMessage(`JACKPOT! ${final[0].symbol} x3! Hai vinto €${payout}`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1800);
      } else if (double) {
        payout = Math.floor(bet * 2); // vincita bassa
        win = true;
        updateSaldo(payout);
        setMessage(`Doppia! ${final[1].symbol} x2! Hai vinto €${payout}`);
      } else {
        setMessage('Nessuna combinazione vincente. Riprova!');
      }
      // Aggiorna la cronologia
      setHistory(h => [{
        reels: final.map(s => s.symbol).join(' '),
        payout: win ? '+'+payout : '-'+bet,
        saldo: win ? saldo + payout : saldo - bet
      }, ...h].slice(0, 10));
      setSpinning(false);

    }, 1200);
  };

  React.useEffect(() => {
    setReels([Array(windowSize).fill(null), Array(windowSize).fill(null), Array(windowSize).fill(null)]);
  }, [slotType]);

  const changeBet = (delta) => {
    setBet(b => Math.max(1, b + delta));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      backgroundSize: 'cover',
      animation: 'bgmove 10s ease-in-out infinite alternate',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s',
    }}>
      <Confetti show={showConfetti} />
      <style>{`
        @keyframes bgmove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .reel-anim {
          animation: reelspin 1.2s cubic-bezier(.17,.67,.83,.67);
        }
        @keyframes reelspin {
          0% { transform: translateY(-180px) scale(1.2); opacity: 0.5; }
          80% { transform: translateY(10px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .slot-btn {
          background: #d32f2f !important;
          color: #fff !important;
          font-weight: 700;
          font-size: 22px;
          border-radius: 3px;
          box-shadow: 0 4px 16px #0004;
          transition: transform 0.18s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.18s;
        }
        .slot-btn:hover {
          transform: scale(1.08) rotate(-2deg);
          box-shadow: 0 8px 32px #d32f2f99;
          filter: brightness(1.1);
        }
      `}</style>
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Slot Machine</Typography>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, fontSize: 22, textShadow: '1px 1px 6px #000', color: saldo < 100 ? '#e53935' : saldo < 500 ? '#FFD600' : '#43a047' }}>
          Saldo: €{saldo}
        </Typography>

        <Button component={Link} to="/games" variant="contained" color="secondary" sx={{ mb: 2, fontWeight: 700, fontSize: 18 }}>Torna al menu</Button>
        <Box sx={{ mb: 2 }}>
          <Select value={slotType} onChange={e => setSlotType(e.target.value)} sx={{ mr: 2, minWidth: 180 }}>
            <MenuItem value="classica">Slot Classica</MenuItem>
            <MenuItem value="frutta">Slot Frutta</MenuItem>
            <MenuItem value="luxury">Slot Luxury</MenuItem>
          </Select>
        </Box>
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ my: 2, minHeight: 220 }}>
          {[0,1,2].map(i => (
            <Box key={i} sx={{ width: 120, height: 220, overflow: 'hidden', borderRadius: 2, background: '#fff', boxShadow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', transition: 'transform 1.2s cubic-bezier(.17,.67,.83,.67)', transform: spinning ? 'translateY(-120px)' : 'translateY(0)' }} className={reelAnim[i] ? 'reel-anim' : ''}>
                {reels[i].map((s, j) => (
                  <Box key={j} sx={{ fontSize: 80, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: j < windowSize-1 ? '2px solid #eee' : 'none', width: '100%' }}>{s ? s.symbol : ' '}</Box>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Button className="slot-btn" onClick={() => changeBet(-1)} disabled={spinning}>-</Button>
          <TextField
            label="Puntata (€)"
            type="number"
            value={bet}
            onChange={e => setBet(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1, max: saldo }}
            sx={{ width: 120, fontWeight: 700, fontSize: 22 }}
            disabled={spinning}
          />
          <Button className="slot-btn" onClick={() => changeBet(1)} disabled={spinning}>+</Button>
          <Button className="slot-btn" onClick={() => spin()} disabled={spinning} sx={{ ml: 3, px: 4, fontSize: 28 }}>SPIN</Button>
        </Box>
        <Typography variant="body1" sx={{ minHeight: 32 }}>{message}</Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Ultimi giri</Typography>
          {history.length === 0 && <Typography variant="body2">Nessun giro effettuato.</Typography>}
          {history.map((h, i) => (
            <Box key={i} sx={{ my: 1, p: 1, border: '1px solid #eee', borderRadius: 2, background: 'rgba(123,47,242,0.05)' }}>
              <Typography variant="body2">{h.reels}</Typography>
              <Typography variant="body2">Saldo: €{h.saldo} | {h.payout}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 4, color: '#FFD700', fontWeight: 700, textAlign: 'center', textShadow: '1px 1px 6px #000' }}>
          ⚡️ ATTENZIONE: Questa slot contiene animazioni e colori lampeggianti che potrebbero causare crisi epilettiche fotosensibili.<br/>
          Se sei sensibile a luci o colori forti, gioca con cautela.
        </Typography>
        {/* Banner pubblicitario non disturbante */}
        <GameAd position="sidebar" />
      </Container>
    </Box>
  );
};

export default Slot; 