// === VARIABILI GLOBALI ===
let players = [
  { name: '', age: 0, saldo: 1000 },
  { name: '', age: 0, saldo: 1000 }
];
let playerCount = 1;
let currentPlayer = 0;
let currentGame = '';
let deck = [], playerHand = [], dealerHand = [];
let betAmount = 10;
let rouletteType = 'europea';
let gameInProgress = false;

// === ELEMENTI DOM ===
const screens = {
  welcome: document.getElementById('welcome-screen'),
  menu: document.getElementById('game-menu'),
  table: document.getElementById('game-table'),
  rules: document.getElementById('rules-popup')
};
const nameDisplay = document.getElementById('name-display');
const saldo1 = document.getElementById('saldo1');
const saldo2 = document.getElementById('saldo2');
const saldo2Container = document.getElementById('saldo2-container');
const currentSaldo = document.getElementById('current-saldo');
const turnIndicator = document.getElementById('turn-indicator');
const betSection = document.getElementById('bet-section');
const betInput = document.getElementById('bet-amount');
const placeBetBtn = document.getElementById('place-bet-btn');
const rouletteTypeSection = document.getElementById('roulette-type-section');
const rouletteTypeSelect = document.getElementById('roulette-type');
const rouletteBoard = document.getElementById('roulette-board');
const dealerCards = document.getElementById('dealer-cards');
const playerCards = document.getElementById('player-cards');
const gameMessage = document.getElementById('game-message');
const blackjackControls = document.getElementById('blackjack-controls');
const pokerControls = document.getElementById('poker-controls');
const backMenuBtn = document.getElementById('back-menu-btn');
const rulesPopup = document.getElementById('rules-popup');
const rulesContent = document.getElementById('rules-content');
const closeRules = document.getElementById('close-rules');
const welcomeWarning = document.getElementById('welcome-warning');

// === AGGIUNTA SLOT MACHINE ===
const slotMachine = document.getElementById('slot-machine');
const slotReels = document.getElementById('slot-reels');
const slotSpinBtn = document.getElementById('slot-spin-btn');
const slotPaytable = document.getElementById('slot-paytable');
const slotMessage = document.getElementById('slot-message');

const slotSymbols = [
  { symbol: '🍒', payout: 5 },
  { symbol: '🍋', payout: 10 },
  { symbol: '🔔', payout: 20 },
  { symbol: '🍀', payout: 30 },
  { symbol: '💎', payout: 50 },
  { symbol: '7️⃣', payout: 100 },
  { symbol: '⭐', payout: 200 }
];
const slotReelCount = 3;
let slotSpinning = false;

// === AGGIUNTA ROULETTE AVANZATA ===
const rouletteBetBoard = document.getElementById('roulette-bet-board');
let rouletteBets = {};

// === AGGIUNTA POKER DRAW ===
let pokerChangeControls = document.getElementById('poker-change-controls');
let pokerHistoryDiv = document.getElementById('poker-history');
let pokerHistory = [];
let pokerChangePhase = false;
let pokerSelectedToChange = [];

// === LOGIN/REGISTRAZIONE ===
const authScreen = document.getElementById('auth-screen');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginWarning = document.getElementById('login-warning');
const registerWarning = document.getElementById('register-warning');

let currentUser = null;

// Tab switch
loginTab.onclick = () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.style.display = '';
  registerForm.style.display = 'none';
  loginWarning.textContent = '';
  registerWarning.textContent = '';
};
registerTab.onclick = () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  loginForm.style.display = 'none';
  registerForm.style.display = '';
  loginWarning.textContent = '';
  registerWarning.textContent = '';
};

// LocalStorage helpers
function saveUserData(username, data) {
  localStorage.setItem('casino_user_' + username, JSON.stringify(data));
}
function loadUserData(username) {
  const d = localStorage.getItem('casino_user_' + username);
  return d ? JSON.parse(d) : null;
}

// Login
loginBtn.onclick = () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) {
    loginWarning.textContent = 'Inserisci username e password.';
    return;
  }
  const userData = loadUserData(username);
  if (!userData || userData.password !== password) {
    loginWarning.textContent = 'Credenziali errate o utente non registrato.';
    return;
  }
  currentUser = username;
  loginWarning.textContent = '';
  onLoginSuccess(userData);
};

// Registrazione
registerBtn.onclick = () => {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  if (!username || !password) {
    registerWarning.textContent = 'Inserisci username e password.';
    return;
  }
  if (loadUserData(username)) {
    registerWarning.textContent = 'Username già registrato.';
    return;
  }
  // Crea nuovo utente con progressi iniziali
  const userData = {
    password,
    saldo: 1000,
    pokerHistory: [],
    // altri progressi futuri
  };
  saveUserData(username, userData);
  currentUser = username;
  registerWarning.textContent = '';
  onLoginSuccess(userData);
};

function onLoginSuccess(userData) {
  // Carica progressi utente
  players[0].saldo = userData.saldo || 1000;
  pokerHistory = userData.pokerHistory || [];
  // Nascondi auth, mostra welcome
  authScreen.classList.remove('active');
  welcomeWarning.textContent = '';
  screens.welcome.classList.add('active');
  // Reset campi
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('register-username').value = '';
  document.getElementById('register-password').value = '';
}

// Salva progressi dopo ogni partita
function saveProgress() {
  if (!currentUser) return;
  const userData = loadUserData(currentUser) || {};
  userData.saldo = players[0].saldo;
  userData.pokerHistory = pokerHistory;
  saveUserData(currentUser, userData);
}

// === EVENTI INIZIALI ===
document.getElementById('enter-btn').onclick = enterCasino;
document.getElementById('single-btn').onclick = () => setPlayers(1);
document.getElementById('multi-btn').onclick = () => setPlayers(2);
document.querySelectorAll('.game-btn').forEach(btn => btn.onclick = () => selectGame(btn.dataset.game));
placeBetBtn.onclick = placeBet;
rouletteTypeSelect.onchange = e => rouletteType = e.target.value;
document.getElementById('hit-btn').onclick = hitCard;
document.getElementById('stand-btn').onclick = stand;
document.getElementById('restart-btn').onclick = restartGame;
document.getElementById('back-menu-btn').onclick = () => switchScreen('menu');
closeRules.onclick = () => rulesPopup.style.display = 'none';

// === FUNZIONI DI SCHERMATA ===
function switchScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function setPlayers(n) {
  playerCount = n;
  saldo2Container.style.display = n === 2 ? '' : 'none';
  players[1].name = '';
  players[1].age = 0;
  players[0].saldo = 1000;
  players[1].saldo = 1000;
  updateSaldoDisplay();
  alert(`Modalità ${n === 1 ? 'singolo' : 'multigiocatore'} selezionata.`);
}

function updateSaldoDisplay() {
  saldo1.textContent = `€${players[0].saldo}`;
  saldo2.textContent = `€${players[1].saldo}`;
  currentSaldo.textContent = `€${players[currentPlayer].saldo}`;
}

function updateTurnIndicator() {
  if (playerCount === 2) {
    turnIndicator.textContent = `Turno di: ${players[currentPlayer].name}`;
  } else {
    turnIndicator.textContent = '';
  }
}

// === INGRESSO NEL CASINO ===
function enterCasino() {
  const name1 = document.getElementById('player1-name').value.trim();
  const age1 = parseInt(document.getElementById('player1-age').value);
  const name2 = document.getElementById('player2-name').value.trim();
  const age2 = parseInt(document.getElementById('player2-age').value);
  if (!name1 || isNaN(age1) || age1 < 18) {
    welcomeWarning.textContent = 'Il giocatore 1 deve avere almeno 18 anni e inserire un nome valido.';
    return;
  }
  players[0].name = name1;
  players[0].age = age1;
  players[0].saldo = 1000;
  if (name2 && !isNaN(age2)) {
    if (age2 < 18) {
      welcomeWarning.textContent = 'Il giocatore 2 deve avere almeno 18 anni.';
      return;
    }
    players[1].name = name2;
    players[1].age = age2;
    players[1].saldo = 1000;
    playerCount = 2;
    saldo2Container.style.display = '';
  } else {
    players[1].name = '';
    players[1].age = 0;
    playerCount = 1;
    saldo2Container.style.display = 'none';
  }
  nameDisplay.textContent = players[0].name + (playerCount === 2 && players[1].name ? ' & ' + players[1].name : '');
  updateSaldoDisplay();
  welcomeWarning.textContent = '';
  switchScreen('menu');
}

// === SELEZIONE GIOCO ===
function selectGame(game) {
  currentGame = game;
  currentPlayer = 0;
  updateTurnIndicator();
  updateSaldoDisplay();
  slotMachine.style.display = 'none';
  document.getElementById('roulette-bet-board').style.display = 'none';
  if (game === 'blackjack') {
    startBlackjack();
  } else if (game === 'roulette') {
    startRoulette();
  } else if (game === 'poker') {
    startPoker();
  } else if (game === 'slot') {
    startSlot();
  }
}

// === PUNTATA ===
function placeBet() {
  betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount < 1) {
    gameMessage.textContent = 'Inserisci una puntata valida.';
    return;
  }
  if (betAmount > players[currentPlayer].saldo) {
    gameMessage.textContent = 'Saldo insufficiente per questa puntata.';
    return;
  }
  if (currentGame === 'blackjack') {
    startBlackjackHand();
  } else if (currentGame === 'roulette') {
    startRouletteHand();
  } else if (currentGame === 'poker') {
    startPokerHand();
  } else if (currentGame === 'slot') {
    slotSpin();
  }
}

// === BLACKJACK ===
function startBlackjack() {
  switchScreen('table');
  document.getElementById('game-title').textContent = 'Blackjack';
  hideAllGameElements();
  betSection.style.display = '';
  blackjackControls.style.display = 'none';
  pokerControls.style.display = 'none';
  pokerChangeControls.style.display = 'none';
  pokerHistoryDiv.style.display = 'none';
  rouletteTypeSection.style.display = 'none';
  rouletteBoard.style.display = 'none';
  document.getElementById('roulette-bet-board').style.display = 'none';
  slotMachine.style.display = 'none';
  dealerCards.style.display = '';
  playerCards.style.display = '';
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  gameMessage.textContent = '';
  updateTurnIndicator();
  updateSaldoDisplay();
  gameInProgress = false;
  showRulesOnStart('blackjack');
}
function startBlackjackHand() {
  createDeck();
  deck.sort(() => Math.random() - 0.5);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderCards(playerCards, playerHand);
  renderCards(dealerCards, [dealerHand[0], { suit: '', value: '?' }]);
  blackjackControls.style.display = '';
  betSection.style.display = 'none';
  gameMessage.textContent = '';
  gameInProgress = true;
}
function hitCard() {
  if (!gameInProgress) return;
  playerHand.push(drawCard());
  renderCards(playerCards, playerHand);
  if (getScore(playerHand) > 21) {
    endBlackjack('Hai sballato!');
  }
}
function stand() {
  if (!gameInProgress) return;
  // Scopri la carta dealer
  renderCards(dealerCards, dealerHand);
  while (getScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
    renderCards(dealerCards, dealerHand);
  }
  const playerScore = getScore(playerHand);
  const dealerScore = getScore(dealerHand);
  let result = '';
  if (playerScore > 21) result = 'Hai sballato!';
  else if (dealerScore > 21 || playerScore > dealerScore) result = 'Hai vinto!';
  else if (playerScore < dealerScore) result = 'Hai perso!';
  else result = 'Pareggio!';
  endBlackjack(result);
}
function endBlackjack(result) {
  gameMessage.textContent = result;
  blackjackControls.style.display = 'none';
  betSection.style.display = '';
  gameInProgress = false;
  // Gestione saldo
  if (result === 'Hai vinto!') {
    players[currentPlayer].saldo += betAmount;
  } else if (result === 'Hai perso!' || result === 'Hai sballato!') {
    players[currentPlayer].saldo -= betAmount;
  }
  updateSaldoDisplay();
  saveProgress(); // Aggiorna progressi

}
function restartGame() {
  if (currentGame === 'blackjack') startBlackjack();
  else if (currentGame === 'poker') startPoker();
  else if (currentGame === 'roulette') startRoulette();
  else if (currentGame === 'slot') startSlot();
}

// === ROULETTE ===
function startRoulette() {
  switchScreen('table');
  document.getElementById('game-title').textContent = 'Roulette';
  hideAllGameElements();
  betSection.style.display = '';
  blackjackControls.style.display = 'none';
  pokerControls.style.display = 'none';
  pokerChangeControls.style.display = 'none';
  pokerHistoryDiv.style.display = '';
  rouletteTypeSection.style.display = '';
  rouletteBoard.style.display = '';
  slotMachine.style.display = 'none';
  document.getElementById('roulette-bet-board').style.display = '';
  dealerCards.style.display = 'none';
  playerCards.style.display = 'none';
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  gameMessage.textContent = '';
  updateTurnIndicator();
  updateSaldoDisplay();
  renderRouletteBoard();
  renderRouletteBetBoard();
  gameInProgress = false;
  showRulesOnStart('roulette');
}
function startRouletteHand() {
  if (Object.keys(rouletteBets).length === 0) {
    gameMessage.textContent = 'Seleziona almeno una puntata sul tabellone.';
    return;
  }
  betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount < 1) {
    gameMessage.textContent = 'Inserisci una puntata valida.';
    return;
  }
  if (betAmount > players[currentPlayer].saldo) {
    gameMessage.textContent = 'Saldo insufficiente.';
    return;
  }
  // Animazione ruota
  renderRouletteBoard();
  const wheel = document.getElementById('wheel');
  const ball = document.getElementById('ball');
  wheel.style.animation = 'spinRoulette 3s cubic-bezier(.17,.67,.83,.67) forwards';
  ball.style.animation = 'ballSpin 3s cubic-bezier(.17,.67,.83,.67) forwards';
  setTimeout(() => {
    let result = Math.floor(Math.random() * 37);
    let win = false;
    let payout = 0;
    // Numeri
    if (rouletteBets['num-' + result]) {
      win = true;
      payout += betAmount * 35;
      highlightRouletteCell('num', result);
    }
    // Colore
    let color = result === 0 ? 'Verde' : (isRouge(result) ? 'Rosso' : 'Nero');
    if (rouletteBets['colore-' + color]) {
      win = true;
      payout += betAmount * 2;
      highlightRouletteCell('colore', color);
    }
    // Pari/Dispari
    if (result !== 0) {
      if (rouletteBets['paridispari-Pari'] && result % 2 === 0) {
        win = true;
        payout += betAmount * 2;
        highlightRouletteCell('paridispari', 'Pari');
      }
      if (rouletteBets['paridispari-Dispari'] && result % 2 === 1) {
        win = true;
        payout += betAmount * 2;
        highlightRouletteCell('paridispari', 'Dispari');
      }
    }
    // Dozzine
    if (result >= 1 && result <= 12 && rouletteBets['dozzina-1-12']) {
      win = true;
      payout += betAmount * 3;
      highlightRouletteCell('dozzina', '1-12');
    }
    if (result >= 13 && result <= 24 && rouletteBets['dozzina-13-24']) {
      win = true;
      payout += betAmount * 3;
      highlightRouletteCell('dozzina', '13-24');
    }
    if (result >= 25 && result <= 36 && rouletteBets['dozzina-25-36']) {
      win = true;
      payout += betAmount * 3;
      highlightRouletteCell('dozzina', '25-36');
    }
    if (win) {
      players[currentPlayer].saldo += payout;
      gameMessage.textContent = `Numero uscito: ${result}. Hai vinto €${payout}!`;
    } else {
      players[currentPlayer].saldo -= betAmount;
      gameMessage.textContent = `Numero uscito: ${result}. Hai perso!`;
    }
    updateSaldoDisplay();
    gameInProgress = false;
    saveProgress(); // Aggiorna progressi
    if (playerCount === 2) setTimeout(nextPlayer, 1500);
  }, 3100);
}
function renderRouletteBoard() {
  // Ruota grafica animata
  rouletteBoard.innerHTML = '<div class="roulette-wheel" id="wheel"></div><div class="roulette-ball" id="ball"></div>';
}
function renderRouletteBetBoard() {
  rouletteBetBoard.style.display = '';
  rouletteBetBoard.innerHTML = '';
  rouletteBets = {};
  // Etichette
  const label = document.createElement('div');
  label.style.width = '100%';
  label.style.textAlign = 'center';
  label.style.margin = '8px 0 8px 0';
  label.innerHTML = '<b>Punta su:</b> <span style="color:#ffd700">Numero</span> | <span style="color:#ff4e50">Colore</span> | <span style="color:#00c853">Pari/Dispari</span> | <span style="color:#00c853">Dozzina</span>';
  rouletteBetBoard.appendChild(label);
  // Numeri 0-36
  const numWrap = document.createElement('div');
  numWrap.style.display = 'flex';
  numWrap.style.flexWrap = 'wrap';
  numWrap.style.justifyContent = 'center';
  numWrap.style.gap = '4px';
  numWrap.style.marginBottom = '8px';
  numWrap.style.width = '100%';
  for (let i = 0; i <= 36; i++) {
    const cell = document.createElement('div');
    cell.className = 'roulette-cell ' + (i === 0 ? 'green' : (isRouge(i) ? 'red' : 'black'));
    cell.textContent = i;
    cell.onclick = () => toggleRouletteBet('num', i, cell);
    numWrap.appendChild(cell);
  }
  rouletteBetBoard.appendChild(numWrap);
  // Colori
  const colorWrap = document.createElement('div');
  colorWrap.style.display = 'flex';
  colorWrap.style.justifyContent = 'center';
  colorWrap.style.gap = '8px';
  colorWrap.style.margin = '8px 0';
  ['Rosso','Nero','Verde'].forEach((col, idx) => {
    const cell = document.createElement('div');
    cell.className = 'roulette-cell ' + (col === 'Rosso' ? 'red' : col === 'Nero' ? 'black' : 'green');
    cell.textContent = col;
    cell.style.minWidth = '70px';
    cell.onclick = () => toggleRouletteBet('colore', col, cell);
    colorWrap.appendChild(cell);
  });
  rouletteBetBoard.appendChild(colorWrap);
  // Pari/Dispari
  const pdWrap = document.createElement('div');
  pdWrap.style.display = 'flex';
  pdWrap.style.justifyContent = 'center';
  pdWrap.style.gap = '8px';
  pdWrap.style.margin = '8px 0';
  ['Pari','Dispari'].forEach(val => {
    const cell = document.createElement('div');
    cell.className = 'roulette-cell';
    cell.textContent = val;
    cell.style.minWidth = '70px';
    cell.onclick = () => toggleRouletteBet('paridispari', val, cell);
    pdWrap.appendChild(cell);
  });
  rouletteBetBoard.appendChild(pdWrap);
  // Dozzine
  const dzWrap = document.createElement('div');
  dzWrap.style.display = 'flex';
  dzWrap.style.justifyContent = 'center';
  dzWrap.style.gap = '8px';
  dzWrap.style.margin = '8px 0';
  ['1-12','13-24','25-36'].forEach((dz, idx) => {
    const cell = document.createElement('div');
    cell.className = 'roulette-cell';
    cell.textContent = dz;
    cell.style.minWidth = '70px';
    cell.onclick = () => toggleRouletteBet('dozzina', dz, cell);
    dzWrap.appendChild(cell);
  });
  rouletteBetBoard.appendChild(dzWrap);
}
function isRouge(n) {
  return [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n);
}
function toggleRouletteBet(type, value, cell) {
  const key = type + '-' + value;
  if (rouletteBets[key]) {
    delete rouletteBets[key];
    cell.classList.remove('selected');
  } else {
    rouletteBets[key] = true;
    cell.classList.add('selected');
  }
}
function highlightRouletteCell(type, value) {
  const cells = rouletteBetBoard.querySelectorAll('.roulette-cell');
  cells.forEach(cell => {
    if ((type === 'num' && cell.textContent == value) ||
        (type === 'colore' && cell.textContent == value) ||
        (type === 'paridispari' && cell.textContent == value) ||
        (type === 'dozzina' && cell.textContent == value)) {
      cell.classList.add('win');
      setTimeout(() => cell.classList.remove('win'), 1200);
    }
  });
}

// === POKER SEMPLIFICATO ===
function startPoker() {
  switchScreen('table');
  document.getElementById('game-title').textContent = 'Poker';
  hideAllGameElements();
  betSection.style.display = '';
  blackjackControls.style.display = 'none';
  pokerControls.style.display = 'none';
  pokerChangeControls.style.display = 'none';
  pokerHistoryDiv.style.display = '';
  rouletteTypeSection.style.display = 'none';
  rouletteBoard.style.display = 'none';
  document.getElementById('roulette-bet-board').style.display = 'none';
  slotMachine.style.display = 'none';
  dealerCards.style.display = 'none';
  playerCards.style.display = '';
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  gameMessage.textContent = '';
  updateTurnIndicator();
  updateSaldoDisplay();
  gameInProgress = false;
  showRulesOnStart('poker');
  renderPokerHistory();
}

function startPokerHand() {
  createDeck();
  deck.sort(() => Math.random() - 0.5);
  playerHand = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard()];
  pokerSelectedToChange = [];
  pokerChangePhase = true;
  renderPokerHandSelectable();
  pokerChangeControls.style.display = '';
  pokerChangeControls.innerHTML = '<button id="confirm-change">Cambia carte</button>';
  document.getElementById('confirm-change').onclick = confirmPokerChange;
  pokerControls.style.display = 'none';
  betSection.style.display = 'none';
  gameMessage.textContent = 'Seleziona fino a 3 carte da cambiare.';
  gameInProgress = true;
}

function renderPokerHandSelectable() {
  playerCards.innerHTML = '';
  playerHand.forEach((card, idx) => {
    const img = document.createElement('img');
    const suitMap = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' };
    const valueMap = { '10': '0', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A', '?': 'back' };
    const value = valueMap[card.value] || card.value;
    const suit = suitMap[card.suit] || 'X';
    img.src = `https://deckofcardsapi.com/static/img/${value}${suit}.png`;
    img.className = 'card-img poker-selectable' + (pokerSelectedToChange.includes(idx) ? ' selected' : '');
    img.onclick = () => togglePokerCardSelect(idx, img);
    playerCards.appendChild(img);
  });
}

function togglePokerCardSelect(idx, img) {
  if (!pokerChangePhase) return;
  const i = pokerSelectedToChange.indexOf(idx);
  if (i !== -1) {
    pokerSelectedToChange.splice(i, 1);
    img.classList.remove('selected');
  } else {
    if (pokerSelectedToChange.length >= 3) return;
    pokerSelectedToChange.push(idx);
    img.classList.add('selected');
  }
}

function confirmPokerChange() {
  // Cambia le carte selezionate
  pokerSelectedToChange.forEach(idx => {
    playerHand[idx] = drawCard();
  });
  pokerChangePhase = false;
  pokerChangeControls.style.display = 'none';
  renderCards(playerCards, playerHand);
  pokerControls.style.display = '';
  pokerControls.innerHTML = '<button id="eval-poker">Valuta Mano</button>';
  document.getElementById('eval-poker').onclick = evaluatePoker;
  gameMessage.textContent = 'Premi "Valuta Mano" per scoprire la combinazione.';
}

// Poker: valutazione combinazioni realistica + payout personalizzati + cronologia
function evaluatePoker() {
  if (!gameInProgress) return;
  const values = playerHand.map(c => c.value);
  const suits = playerHand.map(c => c.suit);
  const valueOrder = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const freqs = Object.values(counts).sort((a, b) => b - a);
  let result = 'Carta alta';
  let payout = 0;
  let payoutTable = {
    'Scala reale': 100,
    'Poker': 50,
    'Full': 12,
    'Colore': 8,
    'Scala': 6,
    'Tris': 3,
    'Doppia coppia': 2,
    'Coppia': 1,
    'Carta alta': 0
  };
  // Scala reale
  let isFlush = suits.every(s => s === suits[0]);
  let sorted = values.map(v => valueOrder.indexOf(v)).sort((a,b) => a-b);
  let isStraight = sorted.every((v,i,arr) => i===0 || v === arr[i-1]+1);
  if (!isStraight && sorted.toString() === '0,1,2,3,12') isStraight = true;
  if (isFlush && isStraight && sorted[0] === 8) { result = 'Scala reale'; payout = betAmount * payoutTable['Scala reale']; }
  else if (freqs[0] === 4) { result = 'Poker'; payout = betAmount * payoutTable['Poker']; }
  else if (freqs[0] === 3 && freqs[1] === 2) { result = 'Full'; payout = betAmount * payoutTable['Full']; }
  else if (isFlush) { result = 'Colore'; payout = betAmount * payoutTableTable['Colore']; }
  else if (isStraight) { result = 'Scala'; payout = betAmount * payoutTable['Scala']; }
  else if (freqs[0] === 3) { result = 'Tris'; payout = betAmount * payoutTable['Tris']; }
  else if (freqs[0] === 2 && freqs[1] === 2) { result = 'Doppia coppia'; payout = betAmount * payoutTable['Doppia coppia']; }
  else if (freqs[0] === 2) { result = 'Coppia'; payout = betAmount * payoutTable['Coppia']; }
  else { result = 'Carta alta'; payout = 0; }
  gameMessage.textContent = `Hai ottenuto: ${result}${payout > 0 ? ' (+€'+payout+')' : ' (perdi la puntata)'}`;
  if (payout > 0) players[currentPlayer].saldo += payout;
  else players[currentPlayer].saldo -= betAmount;
  updateSaldoDisplay();
  saveProgress(); // Aggiorna progressi
  pokerControls.style.display = 'none';
  betSection.style.display = '';
  gameInProgress = false;
  // Aggiorna cronologia
  pokerHistory.unshift({
    hand: playerHand.map(c => c.value + c.suit).join(' '),
    result,
    payout: payout > 0 ? '+'+payout : '-'+betAmount,
    saldo: players[currentPlayer].saldo
  });
  if (pokerHistory.length > 10) pokerHistory = pokerHistory.slice(0,10);
  renderPokerHistory();
  if (playerCount === 2) setTimeout(nextPlayer, 1500);
}

function renderPokerHistory() {
  if (!pokerHistoryDiv) return;
  if (pokerHistory.length === 0) {
    pokerHistoryDiv.innerHTML = '<b>Cronologia mani:</b><br>Nessuna mano giocata.';
    return;
  }
  pokerHistoryDiv.innerHTML = '<b>Cronologia mani (ultime 10):</b><br>' + pokerHistory.map(h => `<span style='color:#fff;'>${h.hand}</span> — <b>${h.result}</b> <span style='color:${h.payout.startsWith("+") ? "#00c853" : "#ff4e50"};'>${h.payout}€</span> <span style='color:#aaa;'>[Saldo: ${h.saldo}€]</span>`).join('<br>');
}

// === SLOT MACHINE ===
function startSlot() {
  switchScreen('table');
  document.getElementById('game-title').textContent = 'Slot Machine';
  hideAllGameElements();
  betSection.style.display = '';
  blackjackControls.style.display = 'none';
  pokerControls.style.display = 'none';
  pokerChangeControls.style.display = 'none';
  pokerHistoryDiv.style.display = 'none';
  rouletteTypeSection.style.display = 'none';
  rouletteBoard.style.display = 'none';
  document.getElementById('roulette-bet-board').style.display = 'none';
  slotMachine.style.display = '';
  slotPaytable.innerHTML = getSlotPaytableHTML();
  slotMessage.textContent = '';
  slotReels.innerHTML = '';
  updateTurnIndicator();
  updateSaldoDisplay();
  gameInProgress = false;
  slotSpinBtn.onclick = slotSpin;
  showRulesOnStart('slot');
}
function getSlotPaytableHTML() {
  return '<b>Tabella Pagamenti:</b><br>' + slotSymbols.map(s => `${s.symbol} x3 = x${s.payout}`).join(' &nbsp; ');
}
function slotSpin() {
  if (slotSpinning) return;
  betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount < 1) {
    slotMessage.textContent = 'Inserisci una puntata valida.';
    return;
  }
  if (betAmount > players[currentPlayer].saldo) {
    slotMessage.textContent = 'Saldo insufficiente.';
    return;
  }
  slotSpinning = true;
  slotMessage.textContent = '';
  slotReels.innerHTML = '';
  let reels = [];
  for (let i = 0; i < slotReelCount; i++) {
    const idx = Math.floor(Math.random() * slotSymbols.length);
    reels.push(slotSymbols[idx]);
  }
  // Animazione rulli
  for (let i = 0; i < slotReelCount; i++) {
    const reelDiv = document.createElement('div');
    reelDiv.className = 'slot-reel';
    reelDiv.textContent = '🎰';
    slotReels.appendChild(reelDiv);
  }
  setTimeout(() => {
    for (let i = 0; i < slotReelCount; i++) {
      slotReels.children[i].textContent = reels[i].symbol;
    }
    // Calcolo vincita
    let win = false;
    let payout = 0;
    if (reels.every(r => r.symbol === reels[0].symbol)) {
      win = true;
      payout = reels[0].payout * betAmount;
      players[currentPlayer].saldo += payout;
      slotMessage.textContent = `JACKPOT! ${reels[0].symbol} x3! Hai vinto €${payout}`;
    } else if (reels[0].symbol === reels[1].symbol || reels[1].symbol === reels[2].symbol) {
      win = true;
      payout = slotSymbols.find(s => s.symbol === reels[1].symbol).payout * Math.floor(betAmount/2);
      players[currentPlayer].saldo += payout;
      slotMessage.textContent = `Doppia! ${reels[1].symbol} x2! Hai vinto €${payout}`;
    } else {
      players[currentPlayer].saldo -= betAmount;
      slotMessage.textContent = 'Nessuna combinazione vincente.';
    }
    updateSaldoDisplay();
    saveProgress(); // Aggiorna progressi
    slotSpinning = false;
    if (playerCount === 2) setTimeout(nextPlayer, 1500);
  }, 900);
}

// === UTILITY CARTE ===
function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}
function drawCard() {
  return deck.pop();
}
function getCardValue(card) {
  if (['J','Q','K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}
function getScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (score > 21 && aces) {
    score -= 10;
    aces--;
  }
  return score;
}
function renderCards(container, hand) {
  container.innerHTML = '';
  hand.forEach(card => {
    const img = document.createElement('img');
    const suitMap = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' };
    const valueMap = { '10': '0', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A', '?': 'back' };
    const value = valueMap[card.value] || card.value;
    const suit = suitMap[card.suit] || 'X';
    if (value === 'back' || card.value === '?') {
      img.src = 'https://deckofcardsapi.com/static/img/back.png';
    } else {
      img.src = `https://deckofcardsapi.com/static/img/${value}${suit}.png`;
    }
    img.className = 'card-img';
    img.style.animation = 'dealCard 0.6s cubic-bezier(.68,-0.55,.27,1.55)';
    container.appendChild(img);
  });
}

// === GESTIONE TURNI MULTIGIOCATORE ===
function nextPlayer() {
  if (playerCount === 2) {
    currentPlayer = (currentPlayer + 1) % 2;
    updateTurnIndicator();
    updateSaldoDisplay();
    // Ripropone la schermata di puntata per il prossimo giocatore
    if (currentGame === 'blackjack') startBlackjack();
    else if (currentGame === 'roulette') startRoulette();
    else if (currentGame === 'poker') startPoker();
    else if (currentGame === 'slot') startSlot();
  }
}

// === POPUP REGOLE (opzionale, da completare) ===
// Esempio: mostraRegole('blackjack') per mostrare popup
function mostraRegole(gioco) {
  let testo = '';
  if (gioco === 'blackjack') testo = '<b>Blackjack</b><br>Scopo: avvicinarsi a 21 senza superarlo. Il banco si ferma a 17. Se superi 21 hai sballato.';
  else if (gioco === 'roulette') testo = '<b>Roulette</b><br>Punta su numeri, colori, pari/dispari o dozzine. La ruota gira e se esce la tua puntata vinci secondo la tabella pagamenti.';
  else if (gioco === 'poker') testo = `<b>Poker Draw 5 carte</b><br>Scopo: ottenere la miglior combinazione di 5 carte.<br>1. Ricevi 5 carte.<br>2. Puoi cambiare fino a 3 carte.<br>3. La mano viene valutata secondo la seguente tabella:<br><ul style='text-align:left;'><li><b>Scala reale</b>: x100</li><li><b>Poker</b>: x50</li><li><b>Full</b>: x12</li><li><b>Colore</b>: x8</li><li><b>Scala</b>: x6</li><li><b>Tris</b>: x3</li><li><b>Doppia coppia</b>: x2</li><li><b>Coppia</b>: x1</li><li><b>Carta alta</b>: perdi la puntata</li></ul>`;
  else if (gioco === 'slot') testo = '<b>Slot Machine</b><br>Premi SPIN e cerca di ottenere 3 simboli uguali per il jackpot!';
  rulesContent.innerHTML = testo;
  rulesPopup.style.display = 'flex';
  rulesPopup.style.opacity = '1';
  rulesPopup.style.pointerEvents = 'auto';
}

// Assicuro che il pulsante Regole sia sempre visibile nella schermata di gioco
function showRulesOnStart(gioco) {
  const showRulesBtn = document.getElementById('show-rules-btn');
  if (showRulesBtn) {
    showRulesBtn.style.display = '';
    showRulesBtn.disabled = false;
    showRulesBtn.onclick = () => mostraRegole(currentGame);
    setTimeout(() => mostraRegole(gioco), 400);
  }
}

function hideAllGameElements() {
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  dealerCards.style.display = 'none';
  playerCards.style.display = 'none';
  pokerChangeControls.style.display = 'none';
  pokerControls.style.display = 'none';
  pokerHistoryDiv.style.display = 'none';
}

// === LEADERBOARD ===
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeLeaderboard = document.getElementById('close-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
leaderboardBtn.onclick = async () => {
  leaderboardModal.style.display = 'flex';
  leaderboardList.innerHTML = '<div>Caricamento...</div>';
  const res = await fetch('http://localhost:3001/api/leaderboard');
  const data = await res.json();
  leaderboardList.innerHTML = '';
  data.forEach((row, i) => {
    const div = document.createElement('div');
    div.className = 'leaderboard-row' + (row.username === currentUser ? ' me' : '');
    div.innerHTML = `<span class='leaderboard-rank'>${i+1}</span>` +
      `<img class='leaderboard-avatar' src='${row.avatar || "https://ui-avatars.com/api/?name="+row.username}' alt='avatar'>` +
      `<span>${row.username}</span> <span style='margin-left:auto;font-weight:bold;'>€${row.saldo}</span>`;
    leaderboardList.appendChild(div);
  });
};
closeLeaderboard.onclick = () => leaderboardModal.style.display = 'none';

// === AVATAR ===
const userAvatar = document.getElementById('user-avatar');
const profileAvatar = document.getElementById('profile-avatar');
profileAvatar.onchange = async function() {
  if (!profileAvatar.files[0]) return;
  const formData = new FormData();
  formData.append('avatar', profileAvatar.files[0]);
  const res = await fetch('http://localhost:3001/api/avatar', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + authToken },
    body: formData
  });
  const data = await res.json();
  userAvatar.src = data.avatar;
  userAvatar.style.display = '';
  showToast('Avatar aggiornato!');
};
async function loadUserAvatar() {
  const res = await fetch('http://localhost:3001/api/avatar', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  if (data.avatar) {
    userAvatar.src = data.avatar;
    userAvatar.style.display = '';
  } else {
    userAvatar.style.display = 'none';
  }
}

// === NOTIFICHE TOAST ===
const toastArea = document.getElementById('toast-area');
function showToast(msg, time=3500) {
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  toastArea.appendChild(div);
  setTimeout(() => { div.remove(); }, time);
  div.onclick = () => div.remove();
}

// === BONUS ===
const bonusBtn = document.getElementById('bonus-btn');
const bonusModal = document.getElementById('bonus-modal');
const closeBonus = document.getElementById('close-bonus');
const bonusList = document.getElementById('bonus-list');
const claimBonusBtn = document.getElementById('claim-bonus-btn');
const bonusWarning = document.getElementById('bonus-warning');
let lastBonusDate = '';
bonusBtn.onclick = async () => {
  bonusModal.style.display = 'flex';
  bonusWarning.textContent = '';
  const res = await fetch('http://localhost:3001/api/bonus', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  let html = '';
  if (!data.bonus_welcome) html += '<div>Bonus di benvenuto disponibile!</div>';
  if (data.bonus_daily !== new Date().toISOString().slice(0,10)) html += '<div>Bonus giornaliero disponibile!</div>';
  if (!html) html = '<div>Nessun bonus disponibile.</div>';
  bonusList.innerHTML = html;
  claimBonusBtn.disabled = !!html.match(/Nessun bonus/);
  lastBonusDate = data.bonus_daily;
};
closeBonus.onclick = () => bonusModal.style.display = 'none';
claimBonusBtn.onclick = async () => {
  const today = new Date().toISOString().slice(0,10);
  let claimed = false;
  // Welcome bonus
  const res = await fetch('http://localhost:3001/api/bonus', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  if (!data.bonus_welcome) {
    await fetch('http://localhost:3001/api/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken },
      body: JSON.stringify({ type: 'welcome' })
    });
    showToast('Bonus di benvenuto accreditato!');
    claimed = true;
  }
  if (data.bonus_daily !== today) {
    await fetch('http://localhost:3001/api/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken },
      body: JSON.stringify({ type: 'daily', date: today })
    });
    showToast('Bonus giornaliero accreditato!');
    claimed = true;
  }
  if (!claimed) showToast('Nessun bonus disponibile.');
  bonusModal.style.display = 'none';
};

// === CRONOLOGIA DETTAGLIATA ===
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');
const exportHistoryBtn = document.getElementById('export-history-btn');
historyBtn.onclick = async () => {
  historyModal.style.display = 'flex';
  historyList.innerHTML = '<div>Caricamento...</div>';
  const res = await fetch('http://localhost:3001/api/history', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  let html = '<table class="history-table"><tr><th>Data</th><th>Gioco</th><th>Puntata</th><th>Risultato</th><th>Saldo prima</th><th>Saldo dopo</th><th>Dettagli</th></tr>';
  data.forEach(row => {
    html += `<tr${row.username === currentUser ? ' class="me"' : ''}><td>${row.created_at.slice(0,16).replace('T',' ')}</td><td>${row.game}</td><td>€${row.bet}</td><td>${row.result}</td><td>€${row.saldo_before}</td><td>€${row.saldo_after}</td><td>${row.details ? JSON.stringify(JSON.parse(row.details)) : ''}</td></tr>`;
  });
  html += '</table>';
  historyList.innerHTML = html;
};
closeHistory.onclick = () => historyModal.style.display = 'none';
exportHistoryBtn.onclick = async () => {
  const res = await fetch('http://localhost:3001/api/history', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `casino_cronologia_${currentUser}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// === LIMITI DI GIOCO ===
const limitsBtn = document.getElementById('limits-btn');
const limitsModal = document.getElementById('limits-modal');
const closeLimits = document.getElementById('close-limits');
const limitsForm = document.getElementById('limits-form');
const limitDeposit = document.getElementById('limit-deposit');
const limitLoss = document.getElementById('limit-loss');
const limitTime = document.getElementById('limit-time');
const limitsWarning = document.getElementById('limits-warning');
limitsBtn.onclick = async () => {
  limitsModal.style.display = 'flex';
  limitsWarning.textContent = '';
  const res = await fetch('http://localhost:3001/api/limits', { headers: { Authorization: 'Bearer ' + authToken } });
  const data = await res.json();
  limitDeposit.value = data.limit_deposit || '';
  limitLoss.value = data.limit_loss || '';
  limitTime.value = data.limit_time || '';
};
closeLimits.onclick = () => limitsModal.style.display = 'none';
limitsForm.onsubmit = async e => {
  e.preventDefault();
  const deposit = parseInt(limitDeposit.value) || 0;
  const loss = parseInt(limitLoss.value) || 0;
  const time = parseInt(limitTime.value) || 0;
  await fetch('http://localhost:3001/api/limits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken },
    body: JSON.stringify({ deposit, loss, time })
  });
  showToast('Limiti aggiornati!');
  limitsModal.style.display = 'none';
};

// === PRIVACY ===
const privacyBtn = document.getElementById('privacy-btn');
const privacyModal = document.getElementById('privacy-modal');
const closePrivacy = document.getElementById('close-privacy');
const deleteAccountBtn = document.getElementById('delete-account-btn');
const privacyWarning = document.getElementById('privacy-warning');
privacyBtn.onclick = () => {
  privacyModal.style.display = 'flex';
  privacyWarning.textContent = '';
};
closePrivacy.onclick = () => privacyModal.style.display = 'none';
deleteAccountBtn.onclick = async () => {
  if (!confirm('Sei sicuro di voler cancellare il tuo account?')) return;
  await fetch('http://localhost:3001/api/delete-account', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + authToken }
  });
  showToast('Account cancellato!');
  setTimeout(() => { logoutBtn.onclick(); }, 1200);
};

// === MULTI-LINGUA ===
const langSelect = document.getElementById('lang-select');
let lang = 'it';
const translations = {
  it: {
    leaderboard: 'Leaderboard',
    history: 'Cronologia',
    limits: 'Limiti',
    bonus: 'Bonus',
    privacy: 'Privacy',
    profile: 'Profilo',
    export: 'Esporta dati',
    logout: 'Logout',
    // ... altri testi ...
  },
  en: {
    leaderboard: 'Leaderboard',
    history: 'History',
    limits: 'Limits',
    bonus: 'Bonus',
    privacy: 'Privacy',
    profile: 'Profile',
    export: 'Export data',
    logout: 'Logout',
    // ... altri testi ...
  }
};
langSelect.onchange = () => {
  lang = langSelect.value;
  // Aggiorna testi UI (esempio)
  leaderboardBtn.textContent = translations[lang].leaderboard;
  historyBtn.textContent = translations[lang].history;
  limitsBtn.textContent = translations[lang].limits;
  bonusBtn.textContent = translations[lang].bonus;
  privacyBtn.textContent = translations[lang].privacy;
  profileBtn.textContent = translations[lang].profile;
  exportBtn.textContent = translations[lang].export;
  logoutBtn.textContent = translations[lang].logout;
  // ... aggiorna altri testi ...
};

// === DEALER VIRTUALE / MOTIVAZIONE ===
async function showDealerMessage() {
  const res = await fetch('http://localhost:3001/api/motivation');
  const data = await res.json();
  showToast(data.message, 5000);
}
// Mostra messaggio motivazionale dopo login e ogni partita
window.addEventListener('casino:afterLogin', showDealerMessage);
window.addEventListener('casino:afterGame', showDealerMessage);

// === LOGOUT AUTOMATICO ===
let logoutTimer = null;
function resetLogoutTimer() {
  if (logoutTimer) clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    showToast('Logout automatico per inattività');
    logoutBtn.onclick();
  }, 1000 * 60 * 15); // 15 minuti
}
document.body.addEventListener('mousemove', resetLogoutTimer);
document.body.addEventListener('keydown', resetLogoutTimer);
// Avvia timer dopo login
window.addEventListener('casino:afterLogin', resetLogoutTimer);

// === INTEGRAZIONE EVENTI ===
function afterLoginEvents() {
  loadUserAvatar();
  showDealerMessage();
  resetLogoutTimer();
  // ...altre azioni post-login...
}
function afterGameEvents() {
  showDealerMessage();
  // ...altre azioni post-partita...
}
// Trigger eventi custom
function triggerAfterLogin() { window.dispatchEvent(new Event('casino:afterLogin')); }
function triggerAfterGame() { window.dispatchEvent(new Event('casino:afterGame')); }

// Chiamare triggerAfterLogin() dopo login, triggerAfterGame() dopo ogni partita
