const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'casino.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Aggiungendo colonne maxwin al database...');

// Aggiungi colonne maxwin se non esistono
db.serialize(() => {
  // Controlla se le colonne esistono
  db.get("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('❌ Errore nel controllare la struttura della tabella:', err);
      return;
    }
    
    db.all("PRAGMA table_info(users)", (err, columns) => {
      if (err) {
        console.error('❌ Errore nel controllare le colonne:', err);
        return;
      }
      
      const columnNames = columns.map(col => col.name);
      
      // Aggiungi colonna avatar se non esiste
      if (!columnNames.includes('avatar')) {
        console.log('➕ Aggiungendo colonna avatar...');
        db.run('ALTER TABLE users ADD COLUMN avatar TEXT', (err) => {
          if (err) {
            console.error('❌ Errore nell\'aggiungere colonna avatar:', err);
          } else {
            console.log('✅ Colonna avatar aggiunta');
          }
        });
      } else {
        console.log('✅ Colonna avatar già esistente');
      }
      
      // Aggiungi colonne maxwin se non esistono
      const maxwinColumns = ['maxwin_blackjack', 'maxwin_roulette', 'maxwin_slot', 'maxwin_poker', 'maxwin_overall'];
      
      maxwinColumns.forEach(col => {
        if (!columnNames.includes(col)) {
          console.log(`➕ Aggiungendo colonna ${col}...`);
          db.run(`ALTER TABLE users ADD COLUMN ${col} INTEGER DEFAULT 0`, (err) => {
            if (err) {
              console.error(`❌ Errore nell'aggiungere colonna ${col}:`, err);
            } else {
              console.log(`✅ Colonna ${col} aggiunta`);
            }
          });
        } else {
          console.log(`✅ Colonna ${col} già esistente`);
        }
      });
      
      setTimeout(() => {
        console.log('✅ Database aggiornato! Ora riavvia il server.');
        db.close();
      }, 1000);
    });
  });
}); 