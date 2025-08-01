# Aggiunta Tracce Audio al Gioco Boss

## Come Aggiungere le Tue Tracce Audio

### 1. Formato File
- **Formato supportato**: `.wav`, `.mp3`, `.ogg`
- **Qualità consigliata**: 44.1kHz, 16-bit
- **Dimensione**: Ottimizza per il web (max 5MB per file)

### 2. Nomi File Richiesti
Aggiungi questi file nella cartella `client/public/audio/`:

```
client/public/audio/
├── menu.wav          # Musica del menu principale
├── intro.wav         # Musica per le introduzioni
├── tension.wav       # Musica per momenti di tensione
├── battle.wav        # Musica per i combattimenti normali
├── boss_battle.wav   # Musica per i boss
├── victory.wav       # Musica per le vittorie
├── defeat.wav        # Musica per le sconfitte
├── emotional.wav     # Musica per momenti emotivi
└── final_battle.wav  # Musica per la battaglia finale
```

### 3. Tipi di Musica per Ogni Situazione

#### 🎵 Menu (menu.wav)
- **Stile**: Rilassante, atmosferica
- **Durata**: 2-3 minuti (loop)
- **Uso**: Menu principale, schermate di pausa

#### 🎵 Intro (intro.wav)
- **Stile**: Brillante, motivante
- **Durata**: 1-2 minuti
- **Uso**: Introduzioni ai capitoli

#### 🎵 Tension (tension.wav)
- **Stile**: Scura, misteriosa
- **Durata**: 2-3 minuti (loop)
- **Uso**: Momenti di tensione, dialoghi drammatici

#### 🎵 Battle (battle.wav)
- **Stile**: Intensa, ritmica
- **Durata**: 2-3 minuti (loop)
- **Uso**: Combattimenti normali

#### 🎵 Boss Battle (boss_battle.wav)
- **Stile**: Epica, drammatica
- **Durata**: 3-4 minuti (loop)
- **Uso**: Battaglie contro i boss

#### 🎵 Victory (victory.wav)
- **Stile**: Trionfale, celebrativa
- **Durata**: 30-60 secondi
- **Uso**: Vittorie, completamento capitoli

#### 🎵 Defeat (defeat.wav)
- **Stile**: Solenne, malinconica
- **Durata**: 30-60 secondi
- **Uso**: Sconfitte, game over

#### 🎵 Emotional (emotional.wav)
- **Stile**: Emotiva, toccante
- **Durata**: 2-3 minuti (loop)
- **Uso**: Momenti drammatici, dialoghi emotivi

#### 🎵 Final Battle (final_battle.wav)
- **Stile**: Drammatica, intensa
- **Durata**: 3-4 minuti (loop)
- **Uso**: Battaglia finale

### 4. Come Aggiungere i File

1. **Prepara i tuoi file audio** con i nomi corretti
2. **Copia i file** nella cartella `client/public/audio/`
3. **Riavvia il server** di sviluppo
4. **Testa il gioco** per verificare che funzioni

### 5. Esempio di Struttura

```
client/public/audio/
├── menu.wav          # Musica rilassante per il menu
├── intro.wav         # Musica brillante per le intro
├── tension.wav       # Musica scura per la tensione
├── battle.wav        # Musica intensa per i combattimenti
├── boss_battle.wav   # Musica epica per i boss
├── victory.wav       # Musica trionfale per le vittorie
├── defeat.wav        # Musica solenne per le sconfitte
├── emotional.wav     # Musica emotiva per i momenti drammatici
└── final_battle.wav  # Musica drammatica per la battaglia finale
```

### 6. Test

Dopo aver aggiunto i file:

1. **Avvia il server**: `npm start`
2. **Vai su**: `http://localhost:3000`
3. **Clicca "Boss Game"**
4. **Clicca "🔇 Abilita Audio"**
5. **Avvia una partita** per sentire la musica

### 7. Note Tecniche

- **Loop automatico**: I file si ripetono automaticamente
- **Controllo volume**: Usa lo slider nel menu pausa
- **Preload**: I file vengono precaricati per evitare ritardi
- **Compatibilità**: Funziona su tutti i browser moderni

### 8. Risoluzione Problemi

Se la musica non si sente:

1. **Verifica i nomi file**: Devono essere esatti
2. **Controlla il formato**: Usa .wav, .mp3 o .ogg
3. **Verifica la cartella**: I file devono essere in `client/public/audio/`
4. **Controlla la console**: Per eventuali errori di caricamento

### 9. Ottimizzazione

Per migliori performance:

- **Comprimi i file**: Usa formati compressi (.mp3, .ogg)
- **Mantieni dimensioni ragionevoli**: Max 5MB per file
- **Usa loop naturali**: I file dovrebbero loopare senza interruzioni
- **Testa su diversi dispositivi**: Verifica che funzioni su mobile 