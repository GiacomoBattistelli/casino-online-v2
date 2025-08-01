# Sistema Audio del Gioco Boss

## Panoramica

Il sistema audio del gioco è stato completamente riscritto per risolvere i problemi di volume e compatibilità con i browser moderni.

## Caratteristiche

### 1. Gestione Audio Avanzata
- **AudioContext**: Utilizza l'API Web Audio per un controllo preciso del suono
- **Preload**: Tutti i file audio vengono precaricati per evitare ritardi
- **Fallback**: Sistema di fallback che genera audio sintetico se i file non sono disponibili

### 2. Tipi di Musica
- **Menu**: Musica rilassante per il menu principale
- **Intro**: Musica brillante per le introduzioni
- **Tension**: Musica più scura per momenti di tensione
- **Battle**: Musica intensa per i combattimenti
- **Boss Battle**: Musica epica per i boss
- **Victory**: Musica trionfale per le vittorie
- **Defeat**: Musica solenne per le sconfitte
- **Emotional**: Musica emotiva per momenti drammatici
- **Final Battle**: Musica drammatica per la battaglia finale

### 3. Sistema di Fallback
Se i file audio non sono disponibili, il sistema genera automaticamente:
- **Frequenze diverse** per ogni tipo di musica
- **Pattern musicali** con accordi e armonie
- **Loop automatici** per una musica continua
- **Controllo del volume** integrato

### 4. Compatibilità Browser
- **Autoplay Policy**: Gestisce le restrizioni dei browser moderni
- **User Interaction**: Abilita l'audio al primo click/touch
- **Error Handling**: Gestisce errori di caricamento audio
- **Cross-browser**: Funziona su Chrome, Firefox, Safari, Edge

## Come Funziona

### Inizializzazione
```javascript
const musicManager = new MusicManager();
```

### Riproduzione
```javascript
musicManager.play('menu'); // Riproduce la musica del menu
musicManager.play('battle'); // Riproduce la musica di battaglia
```

### Controllo Volume
```javascript
musicManager.setVolume(50); // Imposta il volume al 50%
```

### Abilitazione Audio
```javascript
musicManager.enableAudio(); // Abilita l'audio (necessario per autoplay)
```

## Risoluzione Problemi

### Musica Non Si Sente
1. **Clicca il pulsante "🔊 Abilita Audio"** nel menu principale
2. **Interagisci con il gioco** (click, tastiera, touch)
3. **Controlla il volume** nel menu pausa
4. **Verifica le impostazioni del browser** per l'audio

### Audio Non Carica
- Il sistema usa automaticamente il fallback audio sintetico
- I suoni generati sono musicali e appropriati per ogni situazione
- Non sono necessari file audio esterni

### Problemi di Performance
- L'audio è ottimizzato per non impattare le performance
- Usa l'hardware audio del dispositivo
- Gestisce automaticamente la memoria

## File Audio Personalizzati

Per aggiungere file audio personalizzati:
1. Crea file `.wav` o `.mp3` nella cartella `public/audio/`
2. Nomina i file: `menu.wav`, `battle.wav`, etc.
3. Il sistema li caricherà automaticamente
4. Se un file non esiste, usa il fallback sintetico

## Esempi di Uso

```javascript
// Nel componente del gioco
useEffect(() => {
  musicManager.play('menu');
}, []);

// Cambio musica durante il gioco
const startBattle = () => {
  musicManager.play('battle');
};

// Vittoria
const onVictory = () => {
  musicManager.play('victory');
};
```

## Note Tecniche

- **Frequenze**: Ogni tipo di musica usa frequenze specifiche per creare l'atmosfera
- **Waveforms**: Mix di sine e triangle waves per suoni più ricchi
- **Envelope**: Controllo preciso dell'ampiezza per suoni naturali
- **Loop**: Pattern musicali che si ripetono automaticamente 