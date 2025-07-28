const db = require('../db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const User = {
  async register({ username, password, email }) {
    const hash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, password_hash, email, saldo) VALUES (?, ?, ?, 1000)`,
        [username, hash, email],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, username, email, saldo: 1000, poker_history: [] });
        }
      );
    });
  },
  async login({ username, password }) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ? OR email = ?`,
        [username, username],
        async (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          const match = await bcrypt.compare(password, row.password_hash);
          if (!match) return resolve(null);
          resolve(row);
        }
      );
    });
  },
  async getByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  async updateProfile(username, { email }) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET email = ? WHERE username = ?`, [email, username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async updatePassword(username, newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET password_hash = ? WHERE username = ?`, [hash, username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async updateProgress(username, { saldo, poker_history }) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET saldo = ?, poker_history = ? WHERE username = ?`,
        [saldo, JSON.stringify(poker_history), username],
        function (err) {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });
  },
  async exportData(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT username, email, saldo, poker_history, created_at FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  async setAvatar(username, avatarPath) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET avatar = ? WHERE username = ?`, [avatarPath, username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async getAvatar(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT avatar FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.avatar : null);
      });
    });
  },
  async setLimits(username, { deposit, loss, time }) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET limit_deposit = ?, limit_loss = ?, limit_time = ? WHERE username = ?`, [deposit, loss, time, username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async getLimits(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT limit_deposit, limit_loss, limit_time FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  async setBonusWelcome(username) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET bonus_welcome = 1 WHERE username = ?`, [username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async setBonusDaily(username, date) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET bonus_daily = ? WHERE username = ?`, [date, username], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async getBonus(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT bonus_welcome, bonus_daily FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  async addNotification(username, notification) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT notifications FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        let nots = [];
        try { nots = JSON.parse(row.notifications); } catch {}
        nots.unshift(notification);
        if (nots.length > 20) nots = nots.slice(0, 20);
        db.run(`UPDATE users SET notifications = ? WHERE username = ?`, [JSON.stringify(nots), username], function (err2) {
          if (err2) return reject(err2);
          resolve(true);
        });
      });
    });
  },
  async getNotifications(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT notifications FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        let nots = [];
        try { nots = JSON.parse(row.notifications); } catch {}
        resolve(nots);
      });
    });
  },
  async addHistory(entry) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO history (username, game, bet, result, saldo_before, saldo_after, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [entry.username, entry.game, entry.bet, entry.result, entry.saldo_before, entry.saldo_after, JSON.stringify(entry.details || {})],
        function (err) {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });
  },
  async getHistory(username, limit = 50) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM history WHERE username = ? ORDER BY created_at DESC LIMIT ?`, [username, limit], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  async exportHistory(username) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM history WHERE username = ? ORDER BY created_at DESC`, [username], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  async deleteAccount(username) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM users WHERE username = ?`, [username], function (err) {
        if (err) return reject(err);
        db.run(`DELETE FROM history WHERE username = ?`, [username], function (err2) {
          if (err2) return reject(err2);
          resolve(true);
        });
      });
    });
  },
  async leaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT username, saldo, avatar FROM users ORDER BY saldo DESC LIMIT ?`, [limit], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  async updateMaxWin(username, game, amount) {
    const col = {
      blackjack: 'maxwin_blackjack',
      roulette: 'maxwin_roulette',
      slot: 'maxwin_slot',
      poker: 'maxwin_poker'
    }[game];
    if (!col) throw new Error('Gioco non valido');
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET ${col} = ? WHERE username = ? AND (${col} IS NULL OR ${col} < ?)`, [amount, username, amount], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async updateMaxWinOverall(username, amount) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET maxwin_overall = ? WHERE username = ? AND (maxwin_overall IS NULL OR maxwin_overall < ?)`, [amount, username, amount], function (err) {
        if (err) return reject(err);
        resolve(true);
      });
    });
  },
  async getMaxWinOverall(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT maxwin_overall FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.maxwin_overall : 0);
      });
    });
  },
  async getRichest(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT username, avatar, saldo FROM users ORDER BY saldo DESC LIMIT ?`, [limit], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  async getLeaderboard(game, limit = 10) {
    const col = {
      blackjack: 'maxwin_blackjack',
      roulette: 'maxwin_roulette',
      slot: 'maxwin_slot',
      poker: 'maxwin_poker'
    }[game];
    if (!col) throw new Error('Gioco non valido');
    return new Promise((resolve, reject) => {
      db.all(`SELECT username, avatar, ${col} as maxWin FROM users WHERE ${col} > 0 ORDER BY ${col} DESC LIMIT ?`, [limit], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  getMotivation() {
    const phrases = [
      'La fortuna aiuta gli audaci!',
      'Non mollare mai, la prossima mano può essere quella giusta!',
      'Il vero giocatore sa quando fermarsi.',
      'Ricorda: gioca responsabilmente!',
      'Il banco non dorme mai... ma tu puoi vincere!',
      'Dealer: "Vuoi una carta?"',
      'Dealer: "Oggi sento che la tua fortuna sta cambiando!"',
      'Dealer: "La strategia è tutto!"',
      'Dealer: "Hai già provato la slot oggi?"',
      'Dealer: "La costanza premia!"',
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },
};

module.exports = User; 