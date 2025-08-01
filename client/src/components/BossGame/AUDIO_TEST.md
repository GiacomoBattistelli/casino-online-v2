# Test Audio del Gioco Boss

## Come Testare l'Audio

### 1. Avvia il Gioco
1. Vai su `http://localhost:3000`
2. Clicca su "Boss Game"
3. Aspetta che il menu principale si carichi

### 2. Abilita l'Audio
1. **Clicca il pulsante "🔇 Abilita Audio"** nel menu principale
2. Il pulsante dovrebbe cambiare in "🔊 Audio Attivo" (verde)
3. Dovresti sentire immediatamente un suono di test

### 3. Test Audio nel Menu
1. Se l'audio è abilitato, apparirà un pulsante "🔊 Test Audio"
2. **Clicca "🔊 Test Audio"** per sentire un beep di test
3. Se senti il beep, l'audio funziona!

### 4. Test Durante il Gioco
1. **Avvia una partita** (Start New Game o Continue)
2. **Premi P** per aprire il menu pausa
3. **Clicca "🔊 Test Audio"** nel menu pausa
4. Dovresti sentire la musica del menu

### 5. Controllo Volume
1. Nel menu pausa, **usa lo slider** per controllare il volume
2. **Leggi lo stato dell'audio** sotto lo slider:
   - ✅ Enabled = Audio abilitato
   - ✅ Yes = Musica in riproduzione
   - Track = Nome del brano corrente

## Risoluzione Problemi

### Non Sento Niente
1. **Verifica che il browser supporti l'audio**:
   - Chrome: ✅ Supportato
   - Firefox: ✅ Supportato  
   - Safari: ✅ Supportato
   - Edge: ✅ Supportato

2. **Controlla le impostazioni del browser**:
   - Assicurati che l'audio non sia bloccato
   - Verifica che il volume del sistema sia acceso
   - Controlla che non ci siano estensioni che bloccano l'audio

3. **Prova questi passaggi**:
   - Ricarica la pagina (F5)
   - Clicca ovunque nella pagina
   - Prova a premere un tasto
   - Clicca il pulsante "🔇 Abilita Audio"

### Audio Si Interrompe
1. **Il browser potrebbe aver sospeso l'audio**
2. **Clicca di nuovo** per riattivarlo
3. **Usa il pulsante "🔊 Test Audio"** per verificare

### Volume Troppo Basso
1. **Usa lo slider nel menu pausa**
2. **Controlla il volume del sistema**
3. **Verifica le impostazioni audio del browser**

## Debug Avanzato

### Console del Browser
1. **Apri gli strumenti di sviluppo** (F12)
2. **Vai alla console**
3. **Cerca messaggi come**:
   - "Audio enabled"
   - "Fallback audio started: menu"
   - "Music started: menu"

### Test Manuale
```javascript
// Nella console del browser, prova:
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
oscillator.type = 'sine';
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
oscillator.start();
oscillator.stop(audioContext.currentTime + 1);
```

## Tipi di Audio Disponibili

- **menu**: Musica rilassante (440Hz)
- **intro**: Musica brillante (523Hz)
- **tension**: Musica scura (330Hz)
- **battle**: Musica intensa (659Hz)
- **boss_battle**: Musica epica (784Hz)
- **victory**: Musica trionfale (880Hz)
- **defeat**: Musica solenne (220Hz)
- **emotional**: Musica emotiva (392Hz)
- **final_battle**: Musica drammatica (1047Hz)

## Note Tecniche

- **Fallback Audio**: Se i file audio non caricano, usa audio sintetico
- **Loop Automatico**: La musica si ripete automaticamente
- **Controllo Volume**: Volume da 0 a 100
- **Compatibilità**: Funziona su tutti i browser moderni 