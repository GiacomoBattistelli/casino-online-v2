const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

// Multer setup per avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user.username + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

// Nodemailer setup (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Middleware autenticazione
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token mancante' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido' });
  }
}

// API
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('REGISTER:', { username, password, email });
  if (!username || !password) return res.status(400).json({ error: 'Username e password obbligatori' });
  try {
    const user = await User.register({ username, password, email });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username, email, saldo: user.saldo, poker_history: user.poker_history } });
  } catch (e) {
    res.status(400).json({ error: 'Username già registrato' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('LOGIN:', { username, password });
  const user = await User.login({ username, password });
  if (!user) {
    console.log('LOGIN FAILED');
    return res.status(401).json({ error: 'Credenziali errate' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { username, email: user.email, saldo: user.saldo, poker_history: JSON.parse(user.poker_history) } });
});

app.post('/api/logout', (req, res) => {
  // Logout lato client: basta eliminare il token
  res.json({ ok: true });
});

app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await User.getByUsername(req.user.username);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.json({ username: user.username, email: user.email, saldo: user.saldo, avatar: user.avatar, poker_history: JSON.parse(user.poker_history) });
});

app.post('/api/profile', authMiddleware, async (req, res) => {
  const { email } = req.body;
  await User.updateProfile(req.user.username, { email });
  res.json({ ok: true });
});

app.post('/api/reset-password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'Password obbligatoria' });
  await User.updatePassword(req.user.username, newPassword);
  res.json({ ok: true });
});

app.get('/api/export', authMiddleware, async (req, res) => {
  const data = await User.exportData(req.user.username);
  res.json(data);
});

app.post('/api/progress', authMiddleware, async (req, res) => {
  const { saldo, poker_history } = req.body;
  await User.updateProgress(req.user.username, { saldo, poker_history });
  res.json({ ok: true });
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const data = await User.leaderboard(10);
  res.json(data);
});

// Leaderboard: restituisce la classifica per un gioco
app.get('/api/leaderboard/:game', async (req, res) => {
  const { game } = req.params;
  try {
    const data = await User.getLeaderboard(game, 10);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: 'Gioco non valido' });
  }
});

// Aggiorna la vincita massima di un utente (autenticato)
app.post('/api/leaderboard/win', authMiddleware, async (req, res) => {
  const { game, amount } = req.body;
  if (!game || typeof amount !== 'number') return res.status(400).json({ error: 'Dati mancanti' });
  try {
    await User.updateMaxWin(req.user.username, game, amount);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Gioco non valido' });
  }
});

// Avatar upload
app.post('/api/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  const avatarPath = '/avatars/' + req.file.filename;
  await User.setAvatar(req.user.username, avatarPath);
  res.json({ avatar: avatarPath });
});
// Avatar get
app.get('/api/avatar', authMiddleware, async (req, res) => {
  const avatar = await User.getAvatar(req.user.username);
  res.json({ avatar });
});

// Cronologia
app.get('/api/history', authMiddleware, async (req, res) => {
  const history = await User.getHistory(req.user.username, 50);
  res.json(history);
});
app.post('/api/history', authMiddleware, async (req, res) => {
  await User.addHistory({ ...req.body, username: req.user.username });
  res.json({ ok: true });
});

// Notifiche
  app.get('/api/notifications', authMiddleware, async (req, res) => {
  const nots = await User.getNotifications(req.user.username);
  res.json(nots);
});
app.post('/api/notifications', authMiddleware, async (req, res) => {
  await User.addNotification(req.user.username, req.body.notification);
  res.json({ ok: true });
});

// Bonus
app.get('/api/bonus', authMiddleware, async (req, res) => {
  const bonus = await User.getBonus(req.user.username);
  res.json(bonus);
});
app.post('/api/bonus', authMiddleware, async (req, res) => {
  const { type, date } = req.body;
  if (type === 'welcome') await User.setBonusWelcome(req.user.username);
  if (type === 'daily') await User.setBonusDaily(req.user.username, date);
  res.json({ ok: true });
});

// Limiti
app.get('/api/limits', authMiddleware, async (req, res) => {
  const limits = await User.getLimits(req.user.username);
  res.json(limits);
});
app.post('/api/limits', authMiddleware, async (req, res) => {
  const { deposit, loss, time } = req.body;
  await User.setLimits(req.user.username, { deposit, loss, time });
  res.json({ ok: true });
});

// Cancellazione account
app.post('/api/delete-account', authMiddleware, async (req, res) => {
  await User.deleteAccount(req.user.username);
  res.json({ ok: true });
});

// Dealer/motivazione
app.get('/api/motivation', (req, res) => {
  res.json({ message: User.getMotivation() });
});

// Reset password via email
const resetTokens = {};
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email obbligatoria' });
  // Trova utente
  const users = await new Promise((resolve, reject) => {
    User.db.all('SELECT username FROM users WHERE email = ?', [email], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
  if (!users || users.length === 0) return res.status(404).json({ error: 'Email non trovata' });
  const username = users[0].username;
  const token = Math.random().toString(36).substr(2, 8);
  resetTokens[token] = username;
  // Invia email
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reset password Casinò',
    text: `Ciao! Per reimpostare la password usa questo codice: ${token}`
  });
  res.json({ ok: true });
});
app.post('/api/reset-password-token', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token e nuova password obbligatori' });
  const username = resetTokens[token];
  if (!username) return res.status(400).json({ error: 'Token non valido o scaduto' });
  await User.updatePassword(username, newPassword);
  delete resetTokens[token];
  res.json({ ok: true });
});

// Classifica dei più ricchi
app.get('/api/leaderboard/richest', async (req, res) => {
  try {
    const data = await User.getRichest(10);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: 'Errore classifica ricchi' });
  }
});

// Record generale dell’utente autenticato
app.get('/api/leaderboard/record', authMiddleware, async (req, res) => {
  try {
    const maxwin = await User.getMaxWinOverall(req.user.username);
    res.json({ maxwin });
  } catch (e) {
    res.status(400).json({ error: 'Errore record' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Casino API server running!' });
});

app.listen(PORT, () => {
  console.log(`Server API avviato su http://localhost:${PORT}`);
}); 