# 🚀 Guida al Deployment del Casino Online

## Panoramica
Questo progetto è composto da:
- **Frontend**: React app (cartella `client/`)
- **Backend**: Express.js server (cartella `server/`)

## Opzioni di Deployment

### Opzione 1: Vercel + Railway (Raccomandato)

#### Frontend su Vercel
1. **Preparazione**:
   ```bash
   cd client
   npm run build
   ```

2. **Deployment**:
   - Vai su [vercel.com](https://vercel.com)
   - Connetti il tuo repository GitHub
   - Seleziona la cartella `client`
   - Vercel rileverà automaticamente che è un'app React

3. **Configurazione**:
   - Vercel userà automaticamente il file `vercel.json`
   - Il build command è già configurato: `npm run build`
   - Output directory: `build`

#### Backend su Railway
1. **Preparazione**:
   ```bash
   cd server
   ```

2. **Deployment**:
   - Vai su [railway.app](https://railway.app)
   - Connetti il tuo repository GitHub
   - Seleziona la cartella `server`
   - Railway userà automaticamente `npm start`

3. **Configurazione Database**:
   - Railway fornisce automaticamente variabili d'ambiente
   - Il database SQLite sarà persistente

### Opzione 2: Netlify + Render

#### Frontend su Netlify
1. Vai su [netlify.com](https://netlify.com)
2. Connetti il repository
3. Build command: `cd client && npm run build`
4. Publish directory: `client/build`

#### Backend su Render
1. Vai su [render.com](https://render.com)
2. Crea un nuovo Web Service
3. Connetti il repository
4. Build command: `cd server && npm install`
5. Start command: `cd server && npm start`

### Opzione 3: Heroku (Tutto in uno)

1. Vai su [heroku.com](https://heroku.com)
2. Crea una nuova app
3. Connetti il repository
4. Configura le variabili d'ambiente
5. Deploy automatico

## Configurazione Post-Deployment

### 1. Aggiorna URL del Backend
Dopo aver deployato il backend, aggiorna l'URL nel frontend:

```javascript
// In client/src/App.js o dove necessario
const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
```

### 2. Variabili d'Ambiente
Crea un file `.env` nel frontend:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 3. CORS Configuration
Il backend è già configurato per CORS, ma assicurati che l'URL del frontend sia incluso.

## Test del Deployment

1. **Frontend**: Verifica che tutte le pagine si carichino
2. **Backend**: Testa le API con Postman o curl
3. **Database**: Verifica che i dati persistano
4. **Giochi**: Testa tutti i giochi online

## Troubleshooting

### Problemi Comuni:
1. **CORS errors**: Verifica la configurazione CORS nel backend
2. **Build errors**: Controlla le dipendenze e Node.js version
3. **Database errors**: Verifica la connessione al database
4. **API 404**: Controlla i percorsi delle API

### Logs:
- **Vercel**: Dashboard → Functions → Logs
- **Railway**: Dashboard → Deployments → Logs
- **Netlify**: Dashboard → Functions → Logs

## Sicurezza

### Checklist:
- [ ] HTTPS abilitato
- [ ] CORS configurato correttamente
- [ ] Variabili sensibili in .env
- [ ] Rate limiting implementato
- [ ] Validazione input lato server

## Performance

### Ottimizzazioni:
- [ ] Compressione gzip
- [ ] Cache headers
- [ ] CDN per assets statici
- [ ] Lazy loading per componenti React

## Monitoraggio

### Metriche da monitorare:
- Tempo di risposta API
- Errori 4xx/5xx
- Utilizzo memoria/CPU
- Uptime del servizio

## Backup

### Strategia di backup:
- Database: Backup automatico su Railway/Render
- Codice: Repository Git
- Assets: CDN o storage cloud

---

## Quick Start

1. **Deploy Backend**:
   ```bash
   cd server
   # Push su GitHub
   # Deploy su Railway
   ```

2. **Deploy Frontend**:
   ```bash
   cd client
   # Aggiorna API_URL
   # Push su GitHub
   # Deploy su Vercel
   ```

3. **Test**:
   - Visita l'URL del frontend
   - Testa tutti i giochi
   - Verifica che il saldo persista

🎉 **Il tuo casino online è ora live!** 