const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'casino.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    avatar TEXT,
    saldo INTEGER DEFAULT 1000,
    poker_history TEXT DEFAULT '[]',
    bonus_welcome INTEGER DEFAULT 0,
    bonus_daily TEXT DEFAULT '',
    limit_deposit INTEGER DEFAULT 0,
    limit_loss INTEGER DEFAULT 0,
    limit_time INTEGER DEFAULT 0,
    notifications TEXT DEFAULT '[]',
    maxwin_blackjack INTEGER DEFAULT 0,
    maxwin_roulette INTEGER DEFAULT 0,
    maxwin_slot INTEGER DEFAULT 0,
    maxwin_poker INTEGER DEFAULT 0,
    maxwin_overall INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    game TEXT,
    bet INTEGER,
    result TEXT,
    saldo_before INTEGER,
    saldo_after INTEGER,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db; 