# 🎰 Casino Online

Un casino online completo con giochi popolari come Blackjack, Roulette, Slot Machine e Poker. Sviluppato con React per il frontend e Express.js per il backend.

## 🎮 Giochi Disponibili

- **Blackjack**: Il classico gioco delle 21
- **Roulette**: Roulette europea con puntate multiple
- **Slot Machine**: Slot con diversi temi e jackpot
- **Poker**: Video Poker con carte francesi e napoletane

## 🚀 Caratteristiche

- ✅ Interfaccia moderna e responsive
- ✅ Animazioni fluide e effetti visivi
- ✅ Sistema di saldo persistente
- ✅ Bonus salvavita automatico
- ✅ Design ottimizzato per mobile
- ✅ Avvisi di sicurezza per epilessia
- ✅ Pronto per il deployment online

## 🛠️ Tecnologie

### Frontend
- **React 19** - Framework UI
- **Material-UI** - Componenti UI
- **React Router** - Navigazione
- **CSS3** - Animazioni e styling

### Backend
- **Express.js** - Server API
- **SQLite** - Database
- **JWT** - Autenticazione
- **CORS** - Cross-origin requests

## 📦 Installazione

### Prerequisiti
- Node.js >= 18.0.0
- npm o yarn

### Setup Locale

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd BLACKJACK
   ```

2. **Installa dipendenze frontend**
   ```bash
   cd client
   npm install
   ```

3. **Installa dipendenze backend**
   ```bash
   cd ../server
   npm install
   ```

4. **Avvia il backend**
   ```bash
   npm start
   ```

5. **Avvia il frontend** (in un nuovo terminale)
   ```bash
   cd ../client
   npm start
   ```

6. **Apri il browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🌐 Deployment

Per mettere il sito online, consulta la [Guida al Deployment](DEPLOYMENT.md).

### Opzioni di Deployment
- **Vercel + Railway** (Raccomandato)
- **Netlify + Render**
- **Heroku** (Tutto in uno)

## 🎯 Come Giocare

1. **Inizia con €1000** di saldo demo
2. **Scegli un gioco** dal menu principale
3. **Piazza la tua puntata** (min €1)
4. **Gioca e vinci!** 🎉

### Sistema di Bonus
- **Bonus salvavita**: Ricevi €100 quando il saldo arriva a 0
- **Saldo persistente**: Il tuo saldo viene salvato automaticamente

## 🔧 Configurazione

### Variabili d'Ambiente

Crea un file `.env` nel backend:

```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Database

Il database SQLite viene creato automaticamente. Per resettare:

```bash
cd server
rm casino.db
node index.js
```

## 📱 Responsive Design

Il sito è ottimizzato per:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🎨 Design System

### Colori Principali
- **Primario**: #7b2ff2 (Viola)
- **Secondario**: #f357a8 (Rosa)
- **Accento**: #FFD700 (Oro)
- **Successo**: #43a047 (Verde)

### Font
- **Titoli**: Roboto Bold
- **Testo**: Roboto Regular

## 🚨 Sicurezza

### Avvisi Importanti
- ⚡ **Epilessia**: I giochi contengono luci lampeggianti
- 🎰 **Demo**: Questo è un casino demo per scopi educativi
- 💰 **Denaro reale**: Non è possibile vincere denaro reale

### Best Practices
- ✅ Validazione input lato server
- ✅ CORS configurato
- ✅ Rate limiting implementato
- ✅ Sanitizzazione dati

## 🧪 Testing

### Test Manuali
```bash
# Test frontend
cd client
npm test

# Test backend
cd ../server
npm test
```

### Test API
```bash
# Test endpoint salute
curl http://localhost:3001/api/health

# Test leaderboard
curl http://localhost:3001/api/leaderboard
```

## 📊 Performance

### Ottimizzazioni Implementate
- ✅ Code splitting React
- ✅ Lazy loading componenti
- ✅ Compressione gzip
- ✅ Cache headers
- ✅ Bundle size ottimizzato

### Metriche
- **Bundle size**: ~137KB gzipped
- **Load time**: < 2s
- **Lighthouse score**: 90+

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 🙏 Ringraziamenti

- **Material-UI** per i componenti
- **React** per il framework
- **Express.js** per il backend
- **SQLite** per il database

---

## 🎉 Pronto per il Deployment!

Il tuo casino online è pronto per essere messo online! Segui la [Guida al Deployment](DEPLOYMENT.md) per iniziare.

**Buona fortuna! 🍀** 