import React, { useState } from "react";
import { Container, Typography, Box, Button, TextField, Stack, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import GameAd from "../components/GameAd";

const valueOrderFrancesi = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const valueOrderNapoletane = ["1","2","3","4","5","6","7","8","9","10","F","C","R"];
const suitsFrancesi = ["♠️","♥️","♦️","♣️"];
const suitsNapoletane = ["♠️","♥️","♦️","♣️"];
const suitSymbols = {"♠️":"black","♣️":"black","♥️":"red","♦️":"red"};
// Tabella pagamenti facilitata
const payoutTable = {
  'Coppia': 2,
  'Doppia Coppia': 4,
  'Tris': 8,
  'Scala': 12,
  'Colore': 20,
  'Full': 40,
  'Poker': 100,
  'Scala Colore': 200,
  'Scala Reale': 400
};

function createDeck(type) {
  const deck = [];
  const values = type === 'napoletane' ? valueOrderNapoletane : valueOrderFrancesi;
  const suits = type === 'napoletane' ? suitsNapoletane : suitsFrancesi;
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

function getHandResult(hand, type) {
  const values = hand.map(c => c.value);
  const suitsArr = hand.map(c => c.suit);
  const valueOrder = type === 'napoletane' ? valueOrderNapoletane : valueOrderFrancesi;
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const freqs = Object.values(counts).sort((a, b) => b - a);
  let result = 'Carta alta';
  // Scala reale
  let isFlush = suitsArr.every(s => s === suitsArr[0]);
  let sorted = values.map(v => valueOrder.indexOf(v)).sort((a,b) => a-b);
  let isStraight = sorted.every((v,i,arr) => i===0 || v === arr[i-1]+1);
  if (!isStraight && sorted.toString() === '0,1,2,3,12') isStraight = true;
  // Rendi la vittoria più rara: solo tris o meglio sono vincenti
  if (isFlush && isStraight && sorted[0] === valueOrder.length-5) result = 'Scala reale';
  else if (freqs[0] === 4) result = 'Poker';
  else if (freqs[0] === 3 && freqs[1] === 2) result = 'Full';
  else if (isFlush) result = 'Colore';
  else if (isStraight) result = 'Scala';
  else if (freqs[0] === 3) result = 'Tris';
  // Doppia coppia, coppia e carta alta non sono più vincenti
  return result;
}

const Card = ({ value, suit, animate }) => (
  <Box
    className={animate ? "card-animate" : ""}
    sx={{
      width: 60,
      height: 90,
      borderRadius: 2,
      boxShadow: 3,
      background: "#fff",
      color: suitSymbols[suit] === "red" ? "#d32f2f" : "#222",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      fontWeight: 700,
      fontSize: 24,
      p: 1,
      m: 0.5,
      border: "2px solid #fff",
      transition: "transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
      transform: animate ? "rotateY(360deg) scale(1.1)" : "none"
    }}
  >
    <span style={{fontSize:18}}>{value}</span>
    <span style={{fontSize:28}}>{suit}</span>
  </Box>
);

const Confetti = ({ show }) => show ? (
  <Box sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden',
  }}>
    {[...Array(60)].map((_, i) => (
      <Box key={i} sx={{
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: `hsl(${Math.random()*360},90%,60%)`,
        opacity: 0.8,
        animation: `fall${i} 1.5s linear forwards`,
        animationDelay: `${Math.random()}s`
      }}>
        <style>{`
          @keyframes fall${i} {
            0% { transform: translateY(-100px) scale(1); opacity: 1; }
            100% { transform: translateY(600px) scale(0.7); opacity: 0; }
          }
        `}</style>
      </Box>
    ))}
  </Box>
) : null;

const Poker = ({ saldo, updateSaldo }) => {
  const [bet, setBet] = useState(10);
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('bet'); // bet, change, eval, result
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cardType, setCardType] = useState('francesi');


  // Rimuovo tutte le logiche demo e user, uso solo saldo e updateSaldo
  const startHand = async () => {
    if (bet < 1 || bet > saldo) {
      setMessage('Puntata non valida.');
      return;
    }
    let d = createDeck(cardType);
    d = d.sort(() => Math.random() - 0.5);
    setDeck(d.slice(5));
    setHand(d.slice(0,5));
    setSelected([]);
    setPhase('change');
    setMessage('Seleziona fino a 3 carte da cambiare.');
    updateSaldo(-bet);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  const toggleSelect = idx => {
    if (phase !== 'change') return;
    setSelected(sel => sel.includes(idx)
      ? sel.filter(i => i !== idx)
      : sel.length < 3 ? [...sel, idx] : sel
    );
  };

  const changeCards = () => {
    if (selected.length === 0) {
      setMessage('Seleziona almeno una carta da cambiare.');
      return;
    }
    let newHand = [...hand];
    let newDeck = [...deck];
    selected.forEach(idx => {
      newHand[idx] = newDeck.shift();
    });
    setHand(newHand);
    setDeck(newDeck);
    setSelected([]);
    setPhase('eval');
    setMessage('Premi "Valuta Mano" per scoprire la combinazione.');
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  const evalHand = async () => {
    const result = getHandResult(hand, cardType);
    const payout = bet * payoutTable[result];
    if (payout > 0) updateSaldo(payout);
    setHistory(h => [{ hand: hand.map(c => c.value + c.suit).join(' '), result, payout: payout > 0 ? '+'+payout : '-'+bet, saldo: saldo + payout }, ...h].slice(0,10));
    setPhase('result');
    setMessage(`Hai ottenuto: ${result}${payout > 0 ? ' (+€'+payout+')' : ' (perdi la puntata)'}`);
    setShowConfetti(payout > 0);
    if (payout > 0) setTimeout(() => setShowConfetti(false), 1800);

  };

  const restart = () => {
    setPhase('bet');
    setMessage('');
    setHand([]);
    setSelected([]);

    // Non uscire dal gioco, resta nella schermata
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
      backgroundSize: '200% 200%',
      animation: 'greenmove 8s ease-in-out infinite alternate',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Confetti show={showConfetti} />
      <style>{`
        @keyframes greenmove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .card-animate {
          animation: cardflip 0.5s;
        }
        @keyframes cardflip {
          0% { transform: rotateY(0deg) scale(1); }
          100% { transform: rotateY(360deg) scale(1.1); }
        }
      `}</style>
      <Container maxWidth="sm" sx={{
        mt: 4,
        mb: 4,
        px: { xs: 1, sm: 3 },
        py: 3,
        background: 'rgba(30,30,40,0.92)',
        borderRadius: 5,
        boxShadow: '0 0 32px #000a, 0 0 0 4px #43a04744',
        border: '2px solid #43a047',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#FFD700', textShadow: '2px 2px 8px #000' }}>Poker Draw 5 carte</Typography>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, fontSize: 22, textShadow: '1px 1px 6px #000', color: saldo < 100 ? '#e53935' : saldo < 500 ? '#FFD600' : '#43a047' }}>
          Saldo: €{saldo}
        </Typography>

        <Button component={Link} to="/games" variant="contained" color="secondary" sx={{ mb: 2, fontWeight: 700, fontSize: 18, borderRadius: 3 }}>Torna al menu</Button>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Select value={cardType} onChange={e => setCardType(e.target.value)} sx={{ minWidth: 120, fontWeight: 700, fontSize: 16 }}>
            <MenuItem value="francesi">Carte Francesi</MenuItem>
            <MenuItem value="napoletane">Carte Napoletane</MenuItem>
          </Select>
        </Box>
        {(phase === 'bet' || phase === 'result') && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'rgba(255,255,255,0.13)', borderRadius: 4, boxShadow: '0 2px 12px #0002', px: 2, py: 1 }}>
            <TextField
              label="Puntata (€)"
              type="number"
              value={bet}
              onChange={e => setBet(Number(e.target.value))}
              inputProps={{ min: 1, max: saldo }}
              sx={{ width: 120, fontWeight: 700, fontSize: 20, background: '#fff', borderRadius: 3, boxShadow: '0 1px 6px #0001', mr: 2 }}
              InputProps={{
                startAdornment: <span style={{fontSize:22,marginRight:6}}>🎲</span>
              }}
            />
            <Button variant="contained" color="success" onClick={startHand} sx={{ fontWeight: 900, fontSize: 22, px: 4, borderRadius: 3, boxShadow: '0 2px 12px #43a04788' }} disabled={saldo < bet}>
              <span style={{fontSize:24,marginRight:8}}>💰</span>Punta
            </Button>
          </Box>
        )}
        {(phase === 'change' || phase === 'eval' || phase === 'result') && (
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFD700', fontWeight: 700, fontSize: 18, textShadow: '1px 1px 6px #000' }}>La tua mano:</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ my: 1 }}>
              {hand.map((card, idx) => (
                <Box key={idx} onClick={() => toggleSelect(idx)} sx={{ cursor: phase === 'change' ? 'pointer' : 'default', border: selected.includes(idx) ? '2px solid #f357a8' : '' }}>
                  <Card value={card.value} suit={card.suit} animate={animate} />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
        {phase === 'change' && (
          <Button variant="contained" color="secondary" onClick={changeCards} sx={{ mb: 2, fontWeight: 900, fontSize: 18, borderRadius: 2 }}>Cambia carte</Button>
        )}
        {phase === 'eval' && (
          <Button variant="contained" color="success" onClick={evalHand} sx={{ mb: 2, fontWeight: 900, fontSize: 18, borderRadius: 2 }}>Valuta Mano</Button>
        )}
        {phase === 'result' && (
          <Button variant="contained" color="success" onClick={restart} sx={{ mb: 1, fontWeight: 900, fontSize: 18, borderRadius: 2 }}>Nuova mano</Button>
        )}
        <Typography variant="body1" sx={{ mt: 1, minHeight: 28, color: '#fff', fontWeight: 700, fontSize: 18, textShadow: '1px 1px 6px #000' }}>{message}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Ultime mani</Typography>
          {history.length === 0 && <Typography variant="body2">Nessuna mano giocata.</Typography>}
          {history.map((h, i) => (
            <Box key={i} sx={{ my: 1, p: 1, border: '1px solid #eee', borderRadius: 2, background: 'rgba(123,47,242,0.05)' }}>
              <Typography variant="body2">{h.hand}</Typography>
              <Typography variant="body2">Risultato: {h.result} | Saldo: €{h.saldo} | {h.payout}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: '#FFD700', fontWeight: 700, textAlign: 'center', textShadow: '1px 1px 6px #000' }}>
          ⚡️ ATTENZIONE: Questo gioco contiene animazioni e colori lampeggianti che potrebbero causare crisi epilettiche fotosensibili.<br/>
          Se sei sensibile a luci o colori forti, gioca con cautela.
        </Typography>
        {/* Banner pubblicitario non disturbante */}
        <GameAd position="sidebar" />
      </Container>
    </Box>
  );
};

export default Poker; 