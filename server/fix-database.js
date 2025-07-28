const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'casino.db'));

console.log('🔧 Aggiungendo colonne maxwin al database...');

const columns = [
  'maxwin_blackjack',
  'maxwin_roulette', 
  'maxwin_slot',
  'maxwin_poker',
  'maxwin_overall'
];

columns.forEach(column => {
  db.run(`ALTER TABLE users ADD COLUMN ${column} INTEGER DEFAULT 0`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log(`✅ Colonna ${column} già esistente`);
      } else {
        console.log(`❌ Errore aggiungendo ${column}:`, err.message);
      }
    } else {
      console.log(`✅ Colonna ${column} aggiunta con successo`);
    }
  });
});

// Chiudi il database dopo 2 secondi
setTimeout(() => {
  db.close();
  console.log('✅ Database aggiornato! Ora riavvia il server.');
}, 2000); 