import React, { useState } from "react";
import { Container, Typography, Box, Button, Stack, TextField, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import GameAd from "../components/GameAd";

const valueOrderFrancesi = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const valueOrderNapoletane = ["1","2","3","4","5","6","7","8","9","10","F","C","R"];
const suitsFrancesi = ["♠️","♥️","♦️","♣️"];
const suitsNapoletane = ["♠️","♥️","♦️","♣️"];
const suitSymbols = {"♠️":"black","♣️":"black","♥️":"red","♦️":"red"};

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

function getCardValue(card, type) {
  if (type === 'napoletane') {
    if (["F","C","R"].includes(card.value)) return 10;
    if (card.value === "1") return 11;
    return parseInt(card.value);
  }
  if (["J","Q","K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

function getScore(hand, type) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += getCardValue(card, type);
    if ((type === 'napoletane' && card.value === '1') || (type !== 'napoletane' && card.value === 'A')) aces++;
  }
  while (score > 21 && aces) {
    score -= 10;
    aces--;
  }
  return score;
}

const Card = ({ value, suit, hidden, animate }) => (
  <Box
    className={animate ? "card-animate" : ""}
    sx={{
      width: 60,
      height: 90,
      borderRadius: 2,
      boxShadow: 3,
      background: hidden ? "#bbb" : "#fff",
      color: hidden ? "#bbb" : suitSymbols[suit] === "red" ? "#d32f2f" : "#222",
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
    {hidden ? "?" : (
      <>
        <span style={{fontSize:18}}>{value}</span>
        <span style={{fontSize:28}}>{suit}</span>
      </>
    )}
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

const Blackjack = ({ saldo, updateSaldo }) => {
  const [bet, setBet] = useState(10);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [phase, setPhase] = useState('bet'); // bet, play, result
  const [message, setMessage] = useState('');
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cardType, setCardType] = useState('francesi');
  const [deckStyle, setDeckStyle] = useState('blackjack'); // blackjack o poker
  const [busted, setBusted] = useState(false);




  // Rimuovo tutte le logiche demo e user, uso solo saldo e updateSaldo
  const startHand = async () => {
    if (bet < 1 || bet > saldo) {
      setMessage('Puntata non valida.');
      return;
    }
    let d = createDeck(cardType);
    d = d.sort(() => Math.random() - 0.5);
    setDeck(d.slice(4));
    setPlayerHand([d[1], d[3]]);
    setDealerHand([d[0], d[2]]);
    setPhase('play');
    setMessage('');
    updateSaldo(-bet);
    setAnimate(true);
    setBusted(false);
    setTimeout(() => setAnimate(false), 250);
  };

  const hit = () => {
    setPlayerHand(h => {
      const newHand = [...h, deck[0]];
      setDeck(d => d.slice(1));
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
      if (getScore(newHand, cardType) > 21) {
        setMessage('Hai sballato!');
        setPhase('result');
        setBusted(true);
      }
      return newHand;
    });
  };

  const stand = async () => {
    let dHand = [...dealerHand];
    let d = [...deck];
    // Il banco pesca sempre fino a 17 (più facile per il giocatore)
    while (getScore(dHand, cardType) < 17) {
      dHand.push(d[0]);
      d = d.slice(1);
    }
    setDealerHand(dHand);
    setDeck(d);
    const pScore = getScore(playerHand, cardType);
    const dScore = getScore(dHand, cardType);
    let result = '';
    let payout = 0;
    let win = false;
    // Se il giocatore fa 20 o meno, il banco vince in caso di pareggio
    if (pScore > 21) result = 'Hai sballato!';
    else if (dScore > 21 || pScore > dScore) { result = 'Hai vinto!'; payout = bet * 2; win = true; }
    else if (pScore < dScore || (pScore <= 20 && pScore === dScore)) result = 'Hai perso!';
    else { result = 'Pareggio!'; payout = bet; }
    setMessage(result + (payout ? ` (+€${payout})` : ''));
    if (payout > 0) updateSaldo(payout);
    setPhase('result');
    setShowConfetti(win);
    if (win) setTimeout(() => setShowConfetti(false), 1800);

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
        boxShadow: '0 0 32px #000a, 0 0 0 4px #388e3c44',
        border: '2px solid #388e3c',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#FFD700', textShadow: '2px 2px 8px #000' }}>Blackjack</Typography>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, fontSize: 22, textShadow: '1px 1px 6px #000', color: saldo < 100 ? '#e53935' : saldo < 500 ? '#FFD600' : '#43a047' }}>
          Saldo: €{saldo}
        </Typography>

        <Button component={Link} to="/games" variant="contained" color="secondary" sx={{ mb: 2, fontWeight: 700, fontSize: 18, borderRadius: 3 }}>Torna al menu</Button>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Select value={cardType} onChange={e => setCardType(e.target.value)} sx={{ minWidth: 120, fontWeight: 700, fontSize: 16 }}>
            <MenuItem value="francesi">Carte Francesi</MenuItem>
            <MenuItem value="napoletane">Carte Napoletane</MenuItem>
          </Select>
          <Select value={deckStyle} onChange={e => setDeckStyle(e.target.value)} sx={{ minWidth: 120, fontWeight: 700, fontSize: 16 }}>
            <MenuItem value="blackjack">Mazzo Blackjack</MenuItem>
            <MenuItem value="poker">Mazzo Poker</MenuItem>
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
            <Button variant="contained" color="success" onClick={startHand} sx={{ fontWeight: 900, fontSize: 22, px: 4, borderRadius: 3, boxShadow: '0 2px 12px #43a04788' }} disabled={bet > saldo}>
              <span style={{fontSize:24,marginRight:8}}>💰</span>Punta
            </Button>
          </Box>
        )}
        {(phase === 'play' || phase === 'result') && (
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFD700', fontWeight: 700, fontSize: 18, textShadow: '1px 1px 6px #000' }}>Mano giocatore ({getScore(playerHand, cardType)})</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 1, background: '#388e3c', borderRadius: 2, p: 1, boxShadow: 1 }}>
              {playerHand.map((card, idx) => (
                <Card key={idx} value={card.value} suit={card.suit} animate={animate} />
              ))}
            </Stack>
            <Typography variant="subtitle1" sx={{ color: '#FFD700', fontWeight: 700, fontSize: 18, textShadow: '1px 1px 6px #000' }}>Mano banco ({phase === 'play' ? '?' : getScore(dealerHand, cardType)})</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 1, background: '#388e3c', borderRadius: 2, p: 1, boxShadow: 1 }}>
              {dealerHand.map((card, idx) => (
                <Card key={idx} value={card.value} suit={card.suit} hidden={phase === 'play' && idx === 1} animate={animate} />
              ))}
            </Stack>
          </Box>
        )}
        {phase === 'play' && !busted && (
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Button variant="contained" color="primary" onClick={hit} sx={{ fontWeight: 900, fontSize: 18, borderRadius: 2 }}>Carta</Button>
            <Button variant="contained" color="secondary" onClick={stand} sx={{ fontWeight: 900, fontSize: 18, borderRadius: 2 }}>Stai</Button>
          </Box>
        )}
        <Typography variant="body1" sx={{ mt: 1, minHeight: 28, color: '#fff', fontWeight: 700, fontSize: 18, textShadow: '1px 1px 6px #000' }}>{message}</Typography>
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

export default Blackjack; 