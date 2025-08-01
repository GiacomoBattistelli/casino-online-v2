// Game States
export const GAME_STATES = {
  LANGUAGE_SELECT: 'LANGUAGE_SELECT',
  MENU: 'MENU',
  INTRO: 'INTRO',
  LEVELS: 'LEVELS',
  BOSS_BATTLE: 'BOSS_BATTLE',
  BOSS_VICTORY: 'BOSS_VICTORY',
  DIALOG: 'DIALOG',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  PAUSE: 'PAUSE',
  CHOICE_MENU: 'CHOICE_MENU'
};

// Boss Data - 6 Boss Ultra Difficili con Fasi
export const BOSSES = [
  {
    id: 1,
    name: 'Il Tentatore',
    type: 'tempter',
    health: 300,
    maxHealth: 300,
    color: '#9C27B0',
    size: 70,
    speed: 2,
    attackRate: 0.03,
    specialAbility: 'Temptation Wave',
    design: 'shadow_creature',
    patterns: ['basic', 'spread', 'temptation'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Tentazione', speed: 2, attackRate: 0.03, patterns: ['basic'] },
      { healthThreshold: 0.3, name: 'Fase 2: Desiderio', speed: 2.5, attackRate: 0.04, patterns: ['basic', 'spread'] },
      { healthThreshold: 0, name: 'Fase 3: Ossessione', speed: 3, attackRate: 0.05, patterns: ['basic', 'spread', 'temptation'] }
    ],
    dialogue: "Solo una piccola scommessa... non può far male... Guarda quanto hai già vinto...",
    battleDialogs: [
      "Solo una piccola scommessa...",
      "Non può far male...",
      "Tutti lo fanno...",
      "È solo divertimento...",
      "Prova solo una volta...",
      "Guarda quanto hai già vinto...",
      "Immagina cosa potresti vincere ancora...",
      "Non fermarti ora...",
      "La fortuna è dalla tua parte...",
      "Un'altra scommessa e vinci tutto..."
    ],
    description: "Un'entità oscura che si nutre delle tue debolezze. Le sue parole sono veleno puro, progettate per insinuarsi nella tua mente e trasformare ogni dubbio in ossessione. Ha distrutto migliaia di anime prima di te, e ora è la tua volta. La sua presenza ti paralizza, mentre le sue promesse di ricchezza e successo risuonano nella tua testa come un canto di sirena. Sei pronto a resistere alla sua tentazione infinita?"
  },
  {
    id: 2,
    name: 'Il Manipolatore',
    type: 'manipulator',
    health: 500,
    maxHealth: 500,
    color: '#8E24AA',
    size: 80,
    speed: 2.5,
    attackRate: 0.04,
    specialAbility: 'Emotional Manipulation',
    design: 'shadow_creature',
    patterns: ['basic', 'spread', 'homing', 'manipulation'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Ricatto', speed: 2.5, attackRate: 0.04, patterns: ['basic'] },
      { healthThreshold: 0.3, name: 'Fase 2: Controllo', speed: 3, attackRate: 0.05, patterns: ['basic', 'spread'] },
      { healthThreshold: 0, name: 'Fase 3: Dominio', speed: 3.5, attackRate: 0.06, patterns: ['basic', 'spread', 'manipulation'] }
    ],
    dialogue: "Hai davvero il coraggio di abbandonare tutto? I tuoi amici ti giudicheranno... I tuoi genitori saranno delusi...",
    battleDialogs: [
      "Hai abbandonato i tuoi amici per questo?",
      "I tuoi genitori sarebbero delusi di te...",
      "Sei solo un fallimento, lo sai?",
      "Tutti ti hanno abbandonato, rimani con me...",
      "Senza di me, non hai più nulla...",
      "Chi ti aiuterà ora?",
      "Sei troppo debole per resistere...",
      "Ti conosco meglio di te stesso...",
      "Non puoi scappare dalla verità...",
      "Sono l'unico che ti capisce..."
    ],
    description: "Un maestro dell'oscurità psicologica che conosce ogni tua paura e debolezza. Le sue parole sono lame affilate che tagliano direttamente al cuore, facendo leva sui tuoi sensi di colpa e insicurezze. Ha trascinato nell'abisso intere famiglie, distruggendo legami e amicizie con la precisione di un chirurgo. La sua aura ti opprime, mentre le sue parole ti fanno dubitare di tutto ciò che sei. Puoi resistere al suo dominio mentale?"
  },
  {
    id: 3,
    name: 'Il Provocatore',
    type: 'provocateur',
    health: 800,
    maxHealth: 800,
    color: '#F57C00',
    size: 90,
    speed: 3,
    attackRate: 0.05,
    specialAbility: 'Pride Explosion',
    design: 'fire_demon',
    patterns: ['basic', 'spread', 'homing', 'explosion'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Sfida', speed: 3, attackRate: 0.05, patterns: ['basic'] },
      { healthThreshold: 0.3, name: 'Fase 2: Rabbia', speed: 3.5, attackRate: 0.06, patterns: ['basic', 'spread'] },
      { healthThreshold: 0, name: 'Fase 3: Furia', speed: 4, attackRate: 0.07, patterns: ['basic', 'spread', 'explosion'] }
    ],
    dialogue: "Sei troppo debole per resistere! Un vero uomo non si tira indietro! Hai paura di perdere?",
    battleDialogs: [
      "Sei troppo debole per combattere!",
      "Un vero uomo non si tira indietro!",
      "Hai paura di perdere?",
      "Dimostra di essere forte!",
      "Sei solo un codardo!",
      "Non hai il coraggio di continuare!",
      "Un fallimento come te non può vincere!",
      "Arrenditi, sei troppo debole!",
      "Dimostra di essere degno!",
      "Sei nato per perdere!"
    ],
    description: "Un demone di fuoco che si nutre della tua rabbia e orgoglio. Le sue fiamme bruciano non solo il corpo, ma anche l'anima, trasformando ogni sfida in un test di virilità. Ha ridotto in cenere migliaia di guerrieri che credevano di essere invincibili, e ora è la tua volta. La sua presenza infiamma il tuo orgoglio, mentre le sue provocazioni ti spingono a combattere oltre i tuoi limiti. Puoi controllare la tua rabbia abbastanza da sconfiggerlo?"
  },
  {
    id: 4,
    name: 'L\'Illusore',
    type: 'illusionist',
    health: 1200,
    maxHealth: 1200,
    color: '#7B1FA2',
    size: 100,
    speed: 3.5,
    attackRate: 0.06,
    specialAbility: 'Reality Distortion',
    design: 'crystal_entity',
    patterns: ['basic', 'spread', 'homing', 'illusion'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Illusione', speed: 3.5, attackRate: 0.06, patterns: ['basic'] },
      { healthThreshold: 0.3, name: 'Fase 2: Distorsione', speed: 4, attackRate: 0.07, patterns: ['basic', 'spread'] },
      { healthThreshold: 0, name: 'Fase 3: Caos', speed: 4.5, attackRate: 0.08, patterns: ['basic', 'spread', 'illusion'] }
    ],
    dialogue: "Guarda quanti soldi puoi vincere! La felicità è a portata di mano... Un'altra scommessa e vinci tutto!",
    battleDialogs: [
      "Guarda quanti soldi puoi vincere!",
      "La felicità è a portata di mano...",
      "Un'altra scommessa e vinci tutto!",
      "Non fermarti ora, sei quasi arrivato!",
      "La ricchezza ti aspetta!",
      "Immagina la vita che potresti avere...",
      "Tutto questo può essere tuo...",
      "Non lasciarti sfuggire l'opportunità...",
      "La fortuna ti sta chiamando...",
      "Il successo è dietro l'angolo..."
    ],
    description: "Un'entità cristallina che distorce la realtà stessa, creando illusioni così perfette da confondere anche i più saggi. Le sue promesse di ricchezza e successo sono così realistiche che ti fanno dimenticare la verità. Ha ingannato migliaia di anime con le sue false promesse, trasformando i loro sogni in incubi. La sua presenza ti confonde, mentre le sue illusioni ti fanno credere che la felicità sia sempre a portata di mano. Puoi distinguere la realtà dalle sue menzogne?"
  },
  {
    id: 5,
    name: 'Il Predatore',
    type: 'predator',
    health: 1800,
    maxHealth: 1800,
    color: '#E91E63',
    size: 110,
    speed: 4,
    attackRate: 0.07,
    specialAbility: 'Soul Drain',
    design: 'void_monster',
    patterns: ['basic', 'spread', 'homing', 'drain'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Caccia', speed: 4, attackRate: 0.07, patterns: ['basic'] },
      { healthThreshold: 0.3, name: 'Fase 2: Divoramento', speed: 4.5, attackRate: 0.08, patterns: ['basic', 'spread'] },
      { healthThreshold: 0, name: 'Fase 3: Annientamento', speed: 5, attackRate: 0.09, patterns: ['basic', 'spread', 'drain'] }
    ],
    dialogue: "Ti ho osservato per tutto questo tempo. Ora sei completamente mio... Ti divorerò dall'interno...",
    battleDialogs: [
      "Ti ho osservato per tutto questo tempo...",
      "Ora sei completamente mio...",
      "Non c'è più via di fuga...",
      "Ti divorerò dall'interno...",
      "La tua anima è mia...",
      "Ti conosco meglio di te stesso...",
      "Non puoi nasconderti da me...",
      "Ti ho mangiato a poco a poco...",
      "Ora sei solo mia preda...",
      "Ti divorerò completamente..."
    ],
    description: "Un mostro del vuoto che si è nutrito della tua essenza per mesi, forse anni. La sua presenza ti opprime come un peso infinito, mentre le sue parole ti ricordano che ormai sei completamente suo. Ha divorato intere esistenze, lasciando solo gusci vuoti di chi un tempo erano persone. La sua aura ti succhia l'energia vitale, mentre le sue parole ti fanno sentire come se fossi già morto. Puoi liberarti dal suo controllo prima che sia troppo tardi?"
  },
  {
    id: 6,
    name: 'La Dipendenza',
    type: 'final_boss',
    health: 3500,
    maxHealth: 3500,
    color: '#D32F2F',
    size: 120,
    speed: 5,
    attackRate: 0.1,
    specialAbility: 'Soul Corruption',
    design: 'void_monster',
    patterns: ['basic', 'spread', 'homing', 'corruption', 'ultimate'],
    phases: [
      { healthThreshold: 0.7, name: 'Fase 1: Corruzione', speed: 5, attackRate: 0.08, patterns: ['basic', 'spread', 'homing'] },
      { healthThreshold: 0.3, name: 'Fase 2: Dominazione', speed: 6, attackRate: 0.12, patterns: ['basic', 'spread', 'homing', 'corruption'] },
      { healthThreshold: 0, name: 'Fase 3: Apocalisse', speed: 7, attackRate: 0.15, patterns: ['basic', 'spread', 'homing', 'corruption', 'ultimate'] }
    ],
    dialogue: "Senza di me, chi sei? Non hai più nulla... Sono parte di te, non puoi scappare! Ti ho dato tutto, ora sei mio!",
    battleDialogs: [
      "Senza di me, chi sei?",
      "Non hai più nulla...",
      "Sono parte di te, non puoi scappare!",
      "Ti ho dato tutto, ora sei mio!",
      "La libertà è solo un'illusione...",
      "Ti ho creato, ti ho distrutto...",
      "Non esisti senza di me...",
      "Ti ho dato senso alla vita...",
      "Ora sei completamente mio...",
      "Non c'è via di fuga..."
    ],
    description: "La personificazione stessa della dipendenza, un'entità che ha trascinato milioni di anime nell'abisso. La sua presenza ti opprime come un peso infinito, mentre le sue parole ti ricordano che ormai sei completamente suo. Ha distrutto intere esistenze, lasciando solo gusci vuoti di chi un tempo erano persone libere. La sua aura ti succhia l'energia vitale, mentre le sue parole ti fanno sentire come se fossi già morto. Questa è la battaglia finale - puoi liberarti dal suo controllo prima che sia troppo tardi?"
  }
];

// Translations
export const TRANSLATIONS = {
  it: {
    title: 'LA STORIA DELLA VITA',
    subtitle: 'Un viaggio emotivo attraverso la dipendenza, la lotta e la redenzione. Affronta i tuoi demoni e trova la libertà.',
    startNew: '🚀 Inizia Nuova Storia',
    continueStory: '📖 Continua Storia',
    backToMenu: '🏠 Torna al Menu',
    pause: 'PAUSA',
    resume: 'Riprendi',
    settings: 'Impostazioni',
    musicVolume: 'Volume Musica',
    backToMainMenu: 'Menu Principale',
    gameOver: 'GAME OVER',
    gameOverText: 'La dipendenza ha vinto questa volta. Ma non è mai troppo tardi per ricominciare...',
    restart: '🔄 Ricomincia',
    victory: '🎉 VITTORIA!',
    victoryText: 'Hai sconfitto la dipendenza e trovato la libertà! La tua storia di redenzione è completa.',
    attack: '⚔️ Attacca',
    useWillpower: '💪 Usa Volontà (30)',
    bossHealth: 'Vita Boss',
    playerHealth: 'Vita',
    playerWillpower: 'Volontà',
    chapters: {
      intro: {
        title: 'Il Richiamo',
        text: 'Sei un giovane che ha appena scoperto il mondo del gioco d\'azzardo. All\'inizio sembrava innocente, solo un po\' di divertimento. Ma qualcosa dentro di te sa che questo potrebbe essere l\'inizio di qualcosa di più grande...',
        choices: [
          { text: 'Iniziare il viaggio', next: 'chapter1' },
          { text: 'Tornare indietro', next: 'menu' }
        ]
      },
      chapter1: {
        title: 'La Prima Tentazione',
        text: 'Un amico ti invita a fare una piccola scommessa. \'Solo una volta\', dice. \'Non può far male, è solo per divertimento. Tutti lo fanno...\' Ti guarda con quegli occhi che sembrano promettere qualcosa di più.',
        choices: [
          { text: 'Rifiutare educatamente', effect: 'willpower', willpower: 15, health: 5, next: 'chapter2' },
          { text: 'Accettare con cautela', effect: 'weakness', willpower: -5, health: -5, next: 'chapter2' }
        ]
      },
      chapter2: {
        title: 'La Sorpresa',
        text: 'Hai vinto! I soldi arrivano facilmente, più di quanto ti aspettassi. Il tuo amico ti invita a giocare ancora. \'Hai fortuna!\' dice. \'Non fermarti ora, potresti vincere ancora di più...\' I soldi bruciano nelle tue tasche.',
        choices: [
          { text: 'Rifiutare, è stato solo caso', effect: 'willpower', willpower: 20, health: 5, next: 'chapter3' },
          { text: 'Continuare, la fortuna è dalla tua', effect: 'weakness', willpower: -10, health: -10, next: 'chapter3' }
        ]
      },
      chapter3: {
        title: 'Il Primo Boss - Il Tentatore',
        text: 'Una voce sussurra nella tua mente, dolce e persuasiva: "Solo una piccola scommessa... non può far male... Guarda quanto hai già vinto. Immagina cosa potresti vincere ancora..." La tentazione è forte, ma devi affrontarla!',
        choices: [
          { text: 'Combattere la tentazione', effect: 'boss_battle', bossId: 1, next: 'chapter4' },
          { text: 'Cedere alla tentazione', effect: 'weakness', willpower: -20, health: -25, next: 'chapter4' }
        ]
      },
      chapter4: {
        title: 'La Dipendenza Inizia',
        text: 'Hai perso tutto. I soldi che avevi vinto, e anche di più. Ma non importa, puoi sempre recuperare. I tuoi amici ti dicono di smettere, che è solo l\'inizio, ma tu sai che puoi vincere... Devi solo provare ancora una volta.',
        choices: [
          { text: 'Ascoltare i consigli', effect: 'willpower', willpower: 25, health: 0, next: 'chapter5' },
          { text: 'Ignorare, continuare a giocare', effect: 'weakness', willpower: -15, health: -20, next: 'chapter5' }
        ]
      },
      chapter5: {
        title: 'La Mini-Sfida - Resistenza',
        text: 'La notte è lunga e la tentazione è forte. Ogni notifica del telefono ti fa pensare al gioco. Devi resistere, concentrarti e mantenere la tua volontà forte. È solo una fase, passerà...',
        choices: [
          { text: 'Resistere con tutte le forze', effect: 'willpower', willpower: 30, health: 0, next: 'chapter6' },
          { text: 'Cedere alla debolezza', effect: 'weakness', willpower: -25, health: -30, next: 'chapter6' }
        ]
      },
      chapter6: {
        title: 'Il Prestito',
        text: 'Hai bisogno di soldi per continuare. Un uomo ti offre un prestito con un sorriso che non ti convince. \'Ti fido\', dice. \'Restituiscimi quando vinci. È solo un piccolo aiuto tra amici...\'',
        choices: [
          { text: 'Rifiutare, è troppo rischioso', effect: 'willpower', willpower: 35, health: 0, next: 'chapter7' },
          { text: 'Accettare, è l\'unica soluzione', effect: 'weakness', willpower: -20, health: -25, next: 'chapter7' }
        ]
      },
      chapter7: {
        title: 'Il Secondo Boss - Il Manipolatore',
        text: 'Un\'ombra oscura ti avvolge, piena di voci che conoscono i tuoi punti deboli. "Hai davvero il coraggio di abbandonare tutto? I tuoi amici ti giudicheranno... I tuoi genitori saranno delusi... Sei solo un fallimento..."',
        choices: [
          { text: 'Affrontare il manipolatore', effect: 'boss_battle', bossId: 2, next: 'chapter8' },
          { text: 'Fuggire dalla verità', effect: 'weakness', willpower: -30, health: -35, next: 'chapter8' }
        ]
      },
      chapter8: {
        title: 'La Spiral Discendente',
        text: 'Hai perso anche il prestito. Ora devi soldi a molte persone e le loro voci ti perseguitano. Ti senti intrappolato, ma continui a sperare che la prossima volta sarà quella giusta. La pressione aumenta...',
        choices: [
          { text: 'Chiedere aiuto ai familiari', effect: 'willpower', willpower: 40, health: 0, next: 'chapter9' },
          { text: 'Nascondere tutto, continuare', effect: 'weakness', willpower: -25, health: -30, next: 'chapter9' }
        ]
      },
      chapter9: {
        title: 'La Mini-Sfida - Onestà',
        text: 'Devi essere onesto con te stesso. Guardati allo specchio e ammetti che hai un problema, o continua a negare? La verità è dolorosa, ma è l\'unico modo per andare avanti...',
        choices: [
          { text: 'Essere onesto con se stessi', effect: 'willpower', willpower: 45, health: 0, next: 'chapter10' },
          { text: 'Continuare a negare', effect: 'weakness', willpower: -35, health: -40, next: 'chapter10' }
        ]
      },
      chapter10: {
        title: 'Le Persone Sbagliate',
        text: 'Incontri persone che promettono di aiutarti. Ti offrono \'opportunità\' per recuperare tutto, parlano di sistemi infallibili e strategie vincenti. Sembrano sinceri, ma qualcosa non quadra...',
        choices: [
          { text: 'Riconoscerle come truffatori', effect: 'willpower', willpower: 50, health: 0, next: 'chapter11' },
          { text: 'Fidarsi, hanno esperienza', effect: 'weakness', willpower: -30, health: -35, next: 'chapter11' }
        ]
      },
      chapter11: {
        title: 'Il Terzo Boss - Il Provocatore',
        text: 'Un demone di fuoco appare, le sue fiamme bruciano la tua autostima: "Sei troppo debole per resistere! Un vero uomo non si tira indietro! Hai paura di perdere? Dimostra di essere forte!"',
        choices: [
          { text: 'Combattere il provocatore', effect: 'boss_battle', bossId: 3, next: 'chapter12' },
          { text: 'Cedere alla provocazione', effect: 'weakness', willpower: -40, health: -45, next: 'chapter12' }
        ]
      },
      chapter12: {
        title: 'Il Tocco del Fondo',
        text: 'Hai perso tutto: soldi, amici, famiglia, dignità. Sei solo e disperato, seduto nel buio della tua stanza. Ma qualcosa dentro di te inizia a sussurrare... Una voce che non hai mai sentito prima...',
        choices: [
          { text: 'Ascoltare quella voce interiore', effect: 'willpower', willpower: 55, health: 0, next: 'chapter13' },
          { text: 'Annegare il dolore nel gioco', effect: 'weakness', willpower: -35, health: -40, next: 'chapter13' }
        ]
      },
      chapter13: {
        title: 'La Mini-Sfida - Speranza',
        text: 'Nel buio più profondo, quando tutto sembra perduto, devi trovare la speranza. È la cosa più difficile che hai mai fatto, ma credi ancora in te stesso? Credi che possa esistere una via d\'uscita?',
        choices: [
          { text: 'Trovare la speranza dentro', effect: 'willpower', willpower: 60, health: 0, next: 'chapter14' },
          { text: 'Perdere ogni speranza', effect: 'weakness', willpower: -45, health: -50, next: 'chapter14' }
        ]
      },
      chapter14: {
        title: 'Il Quarto Boss - L\'Illusore',
        text: 'Un\'entità di cristallo ti circonda, riflettendo immagini di ricchezza e felicità: "Guarda quanti soldi puoi vincere! La felicità è a portata di mano... Un\'altra scommessa e vinci tutto! Non fermarti ora..."',
        choices: [
          { text: 'Distruggere le illusioni', effect: 'boss_battle', bossId: 4, next: 'chapter15' },
          { text: 'Cadere nelle illusioni', effect: 'weakness', willpower: -50, health: -55, next: 'chapter15' }
        ]
      },
      chapter15: {
        title: 'Il Risveglio',
        text: 'Finalmente vedi la verità attraverso le illusioni. Il gioco non ti darà mai la felicità che cerchi. È ora di cambiare, di combattere contro quello che ti ha intrappolato. È ora di liberarsi...',
        choices: [
          { text: 'Accettare la verità e combattere', effect: 'willpower', willpower: 65, health: 0, next: 'chapter16' },
          { text: 'Negare ancora, è troppo tardi', effect: 'weakness', willpower: -40, health: -45, next: 'chapter16' }
        ]
      },
      chapter16: {
        title: 'La Mini-Sfida - Coraggio',
        text: 'Devi trovare il coraggio di cambiare. È la sfida più difficile che hai mai affrontato. Significa ammettere i tuoi errori, chiedere aiuto, ricominciare da zero. Hai il coraggio di farlo?',
        choices: [
          { text: 'Trovare il coraggio', effect: 'willpower', willpower: 70, health: 0, next: 'chapter17' },
          { text: 'Rimanere nella paura', effect: 'weakness', willpower: -55, health: -60, next: 'chapter17' }
        ]
      },
      chapter17: {
        title: 'Il Quinto Boss - Il Predatore',
        text: 'Un mostro del vuoto ti avvolge, le sue ombre ti succhiano l\'energia vitale: "Ti ho osservato per tutto questo tempo. Ora sei completamente mio... Ti divorerò dall\'interno fino a che non rimarrà più nulla..."',
        choices: [
          { text: 'Combattere il predatore', effect: 'boss_battle', bossId: 5, next: 'chapter18' },
          { text: 'Essere divorato dal vuoto', effect: 'weakness', willpower: -60, health: -65, next: 'chapter18' }
        ]
      },
      chapter18: {
        title: 'La Preparazione Finale',
        text: 'Ora devi prepararti per la battaglia finale. La tua dipendenza ti sta aspettando, più forte che mai. Ma ora hai qualcosa che non avevi prima: la consapevolezza e la determinazione di combattere...',
        choices: [
          { text: 'Prepararsi per la battaglia', effect: 'willpower', willpower: 75, health: 0, next: 'chapter19' },
          { text: 'Temere la battaglia', effect: 'weakness', willpower: -45, health: -50, next: 'chapter19' }
        ]
      },
      chapter19: {
        title: 'La Mini-Sfida - Determinazione',
        text: 'L\'ultima sfida prima del boss finale. Devi essere determinato a vincere, a non arrenderti mai. La dipendenza è forte, ma tu sei più forte. Devi crederci con tutto te stesso...',
        choices: [
          { text: 'Essere determinato', effect: 'willpower', willpower: 80, health: 0, next: 'chapter20' },
          { text: 'Perdere la determinazione', effect: 'weakness', willpower: -50, health: -55, next: 'chapter20' }
        ]
      },
      chapter20: {
        title: 'Il Sesto Boss - La Dipendenza',
        text: 'La battaglia finale è arrivata. La tua dipendenza ti guarda negli occhi, è diventata parte di te: "Senza di me, chi sei? Non hai più nulla... Sono parte di te, non puoi scappare! Ti ho dato tutto, ora sei mio!"',
        choices: [
          { text: 'Combattere la dipendenza', effect: 'boss_battle', bossId: 6, next: 'chapter21' },
          { text: 'Arrendersi alla dipendenza', effect: 'defeat', next: 'game_over' }
        ]
      },
      chapter21: {
        title: 'La Vittoria',
        text: 'Hai sconfitto la dipendenza! Il mostro che ti ha tormentato per così tanto tempo è finalmente sconfitto. Ora devi ricostruire la tua vita, un passo alla volta. È difficile, ma ne vale la pena...',
        choices: [
          { text: 'Iniziare la ricostruzione', effect: 'willpower', willpower: 90, health: 0, next: 'chapter22' },
          { text: 'Celebrare la vittoria', effect: 'willpower', willpower: 85, health: 0, next: 'chapter22' }
        ]
      },
      chapter22: {
        title: 'La Nuova Vita',
        text: 'Inizi a ricostruire la tua vita. È difficile, ogni giorno è una sfida, ma ogni giorno è anche un passo avanti. Ricostruisci i rapporti, trovi un lavoro, impari a vivere di nuovo...',
        choices: [
          { text: 'Continuare il percorso', effect: 'willpower', willpower: 95, health: 0, next: 'chapter23' },
          { text: 'Aiutare gli altri', effect: 'willpower', willpower: 100, health: 0, next: 'chapter23' }
        ]
      },
      chapter23: {
        title: 'La Redenzione',
        text: 'Hai trovato la redenzione. Ora puoi aiutare altri che stanno lottando come hai fatto tu. La tua esperienza può essere una luce per chi è ancora nel buio. Sei diventato più forte di quanto pensassi...',
        choices: [
          { text: 'Diventare un esempio', effect: 'willpower', willpower: 100, health: 0, next: 'chapter24' },
          { text: 'Condividere la tua storia', effect: 'willpower', willpower: 100, health: 0, next: 'chapter24' }
        ]
      },
      chapter24: {
        title: 'Il Risveglio',
        text: 'Tutto diventa bianco... Sensazioni confuse... Voci lontane che diventano sempre più chiare... "L\'operazione è andata bene"... "Il tumore è stato rimosso completamente"... "Il paziente si sta riprendendo..."',
        choices: [
          { text: 'Aprire gli occhi', effect: 'plot_twist', next: 'plot_twist' },
          { text: 'Rimanere nel buio', effect: 'plot_twist', next: 'plot_twist' }
        ]
      },
      plot_twist: {
        title: 'La Verità',
        text: 'I tuoi occhi si aprono lentamente. Sei in una stanza d\'ospedale, circondato da macchine che fanno bip. Il medico ti sorride: "L\'operazione è stata un successo. Il tumore al cervello è stato completamente rimosso. I momenti critici dell\'operazione erano quelli che hai vissuto nel gioco - ogni boss rappresentava una fase critica dell\'intervento. Hai combattuto e vinto la tua battaglia più importante."',
        choices: [
          { text: 'Comprendere la verità', effect: 'true_victory', next: 'true_victory' },
          { text: 'Ringraziare per la vita', effect: 'true_victory', next: 'true_victory' }
        ]
      },
      true_victory: {
        title: 'La Nuova Vita',
        text: 'Ora sei veramente libero. Non solo dalla dipendenza, ma dalla malattia che minacciava la tua vita. Ogni scelta che hai fatto nel gioco ha rappresentato la tua volontà di vivere, la tua determinazione a non arrendersi. Sei un sopravvissuto, un guerriero che ha combattuto la battaglia più importante di tutte.',
        choices: [
          { text: 'Iniziare la nuova vita', effect: 'final_victory', next: 'final_victory' },
          { text: 'Ringraziare per la seconda possibilità', effect: 'final_victory', next: 'final_victory' }
        ]
      },
      final_victory: {
        title: 'La Libertà Vera',
        text: 'Sei finalmente libero. Non solo dalla dipendenza, ma dalla malattia che minacciava la tua vita. Ogni boss che hai sconfitto rappresentava una fase critica dell\'operazione. Hai combattuto e vinto la tua battaglia più importante. Ora puoi vivere la tua vita al massimo, apprezzando ogni momento, ogni respiro, ogni possibilità.',
        choices: [
          { text: 'Vivere la libertà', effect: 'victory', next: 'victory' },
          { text: 'Ringraziare per la seconda possibilità', effect: 'victory', next: 'victory' }
        ]
      }
    },
    bosses: {
      manipulator: {
        name: "Il Manipolatore",
        dialogue: "Hai davvero il coraggio di abbandonare tutto? I tuoi amici ti giudicheranno...",
        attacks: ["Sensi di Colpa", "Ricatti Emotivi", "Promesse Vuote"],
        battleDialogs: [
          "Hai abbandonato i tuoi amici per questo?",
          "I tuoi genitori sarebbero delusi di te...",
          "Sei solo un fallimento, lo sai?",
          "Tutti ti hanno abbandonato, rimani con me...",
          "Senza di me, non hai più nulla..."
        ]
      },
      provocateur: {
        name: "Il Provocatore",
        dialogue: "Sei troppo debole per resistere! Un vero uomo non si tira indietro!",
        attacks: ["Sfide all'Orgoglio", "Insulti", "Pressione Sociale"],
        battleDialogs: [
          "Sei troppo debole per combattere!",
          "Un vero uomo non si tira indietro!",
          "Hai paura di perdere?",
          "Dimostra di essere forte!",
          "Sei solo un codardo!"
        ]
      },
      illusionist: {
        name: "L'Illusore",
        dialogue: "Guarda quanti soldi puoi vincere! La felicità è a portata di mano...",
        attacks: ["Promesse di Ricchezza", "Ilusioni di Felicità", "Tentazioni"],
        battleDialogs: [
          "Guarda quanti soldi puoi vincere!",
          "La felicità è a portata di mano...",
          "Un'altra scommessa e vinci tutto!",
          "Non fermarti ora, sei quasi arrivato!",
          "La ricchezza ti aspetta!"
        ]
      },
      final_boss: {
        name: "La Dipendenza",
        dialogue: "Senza di me, chi sei? Non hai più nulla...",
        attacks: ["Tentazione Finale", "Disperazione", "Vuoto Interiore"],
        battleDialogs: [
          "Senza di me, chi sei?",
          "Non hai più nulla...",
          "Sono parte di te, non puoi scappare!",
          "Ti ho dato tutto, ora sei mio!",
          "La libertà è solo un'illusione..."
        ]
      }
    }
  },
  en: {
    title: 'THE STORY OF LIFE',
    subtitle: 'An emotional journey through addiction, struggle and redemption. Face your demons and find freedom.',
    startNew: '🚀 Start New Story',
    continueStory: '📖 Continue Story',
    backToMenu: '🏠 Back to Menu',
    pause: 'PAUSE',
    resume: 'Resume',
    settings: 'Settings',
    musicVolume: 'Music Volume',
    backToMainMenu: 'Main Menu',
    gameOver: 'GAME OVER',
    gameOverText: 'Addiction has won this time. But it\'s never too late to start over...',
    restart: '🔄 Restart',
    victory: '🎉 VICTORY!',
    victoryText: 'You have defeated addiction and found freedom! Your redemption story is complete.',
    attack: '⚔️ Attack',
    useWillpower: '💪 Use Willpower (30)',
    bossHealth: 'Boss Health',
    playerHealth: 'Health',
    playerWillpower: 'Willpower',
    chapters: {
      intro: {
        title: 'The Call',
        text: 'You are a young person who has just discovered the world of gambling. At first it seemed innocent, just a bit of fun...',
        choices: [
          { text: 'Start the journey', next: 'level1' },
          { text: 'Go back', next: 'menu' }
        ]
      },
      level1: {
        title: 'The First Bet',
        text: 'A friend invites you to make a bet. \'Just once\', he says. \'It can\'t hurt...\'',
        choices: [
          { text: 'Refuse', effect: 'willpower', willpower: 20, health: 0 },
          { text: 'Accept', effect: 'weakness', willpower: -10, health: -20 }
        ]
      },
      level2: {
        title: 'The Addiction',
        text: 'You have started to lose control. Money is going away, but you keep playing hoping to recover...',
        choices: [
          { text: 'Ask for help', effect: 'willpower', willpower: 25, health: 0 },
          { text: 'Continue alone', effect: 'weakness', willpower: -15, health: -25 }
        ]
      },
      level3: {
        title: 'Toxic People',
        text: 'You meet people who only want to take advantage of you. They promise riches but only want your money...',
        choices: [
          { text: 'Recognize them', effect: 'willpower', willpower: 30, health: 0 },
          { text: 'Trust again', effect: 'weakness', willpower: -20, health: -30 }
        ]
      },
      level4: {
        title: 'The Awakening',
        text: 'Finally you begin to understand. Gambling will never give you the happiness you seek. It\'s time to change...',
        choices: [
          { text: 'Accept the truth', effect: 'willpower', willpower: 35, health: 0 },
          { text: 'Deny again', effect: 'weakness', willpower: -25, health: -35 }
        ]
      },
      level5: {
        title: 'Freedom',
        text: 'You have reached the decisive moment. You must face your addiction and choose freedom...',
        choices: [
          { text: 'Fight for freedom', effect: 'final_battle', next: 'boss_battle' },
          { text: 'Give up', effect: 'defeat', next: 'game_over' }
        ]
      }
    },
    bosses: {
      manipulator: {
        name: "The Manipulator",
        dialogue: "Do you really have the courage to abandon everything? Your friends will judge you...",
        attacks: ["Guilt Trips", "Emotional Blackmail", "Empty Promises"],
        battleDialogs: [
          "Have you abandoned your friends for this?",
          "Your parents would be disappointed in you...",
          "You're just a failure, you know?",
          "Everyone has abandoned you, stay with me...",
          "Without me, you have nothing left..."
        ]
      },
      provocateur: {
        name: "The Provocateur",
        dialogue: "You're too weak to resist! A real man doesn't back down!",
        attacks: ["Pride Challenges", "Insults", "Social Pressure"],
        battleDialogs: [
          "You're too weak to fight!",
          "A real man doesn't back down!",
          "Are you afraid to lose?",
          "Prove you're strong!",
          "You're just a coward!"
        ]
      },
      illusionist: {
        name: "The Illusionist",
        dialogue: "Look how much money you can win! Happiness is within reach...",
        attacks: ["Wealth Promises", "Happiness Illusions", "Temptations"],
        battleDialogs: [
          "Look how much money you can win!",
          "Happiness is within reach...",
          "One more bet and you win everything!",
          "Don't stop now, you're almost there!",
          "Wealth awaits you!"
        ]
      },
      final_boss: {
        name: "The Addiction",
        dialogue: "Without me, who are you? You have nothing left...",
        attacks: ["Final Temptation", "Despair", "Inner Void"],
        battleDialogs: [
          "Without me, who are you?",
          "You have nothing left...",
          "I'm part of you, you can't escape!",
          "I gave you everything, now you're mine!",
          "Freedom is just an illusion..."
        ]
      }
    }
  },
  es: {
    title: 'LA HISTORIA DE LA VIDA',
    subtitle: 'Un viaje emocional a través de la adicción, la lucha y la redención. Enfrenta tus demonios y encuentra la libertad.',
    startNew: '🚀 Iniciar Nueva Historia',
    continueStory: '📖 Continuar Historia',
    backToMenu: '🏠 Volver al Menú',
    pause: 'PAUSA',
    resume: 'Reanudar',
    settings: 'Configuración',
    musicVolume: 'Volumen de Música',
    backToMainMenu: 'Menú Principal',
    gameOver: 'GAME OVER',
    gameOverText: 'La adicción ha ganado esta vez. Pero nunca es demasiado tarde para empezar de nuevo...',
    restart: '🔄 Reiniciar',
    victory: '🎉 ¡VICTORIA!',
    victoryText: '¡Has derrotado la adicción y encontrado la libertad! Tu historia de redención está completa.',
    attack: '⚔️ Atacar',
    useWillpower: '💪 Usar Voluntad (30)',
    bossHealth: 'Vida del Jefe',
    playerHealth: 'Vida',
    playerWillpower: 'Voluntad',
    chapters: {
      intro: {
        title: 'La Llamada',
        text: 'Eres un joven que acaba de descubrir el mundo del juego. Al principio parecía inocente, solo un poco de diversión...',
        choices: [
          { text: 'Iniciar el viaje', next: 'level1' },
          { text: 'Volver atrás', next: 'menu' }
        ]
      },
      level1: {
        title: 'La Primera Apuesta',
        text: 'Un amigo te invita a hacer una apuesta. \'Solo una vez\', dice. \'No puede hacer daño...\'',
        choices: [
          { text: 'Rechazar', effect: 'willpower', willpower: 20, health: 0 },
          { text: 'Aceptar', effect: 'weakness', willpower: -10, health: -20 }
        ]
      },
      level2: {
        title: 'La Adicción',
        text: 'Has empezado a perder el control. El dinero se va, pero sigues jugando esperando recuperar...',
        choices: [
          { text: 'Pedir ayuda', effect: 'willpower', willpower: 25, health: 0 },
          { text: 'Continuar solo', effect: 'weakness', willpower: -15, health: -25 }
        ]
      },
      level3: {
        title: 'Personas Tóxicas',
        text: 'Conoces personas que solo quieren aprovecharse de ti. Prometen riquezas pero solo quieren tu dinero...',
        choices: [
          { text: 'Reconocerlas', effect: 'willpower', willpower: 30, health: 0 },
          { text: 'Confiar de nuevo', effect: 'weakness', willpower: -20, health: -30 }
        ]
      },
      level4: {
        title: 'El Despertar',
        text: 'Finalmente empiezas a entender. El juego nunca te dará la felicidad que buscas. Es hora de cambiar...',
        choices: [
          { text: 'Aceptar la verdad', effect: 'willpower', willpower: 35, health: 0 },
          { text: 'Negar de nuevo', effect: 'weakness', willpower: -25, health: -35 }
        ]
      },
      level5: {
        title: 'La Libertad',
        text: 'Has llegado al momento decisivo. Debes enfrentar tu adicción y elegir la libertad...',
        choices: [
          { text: 'Luchar por la libertad', effect: 'final_battle', next: 'boss_battle' },
          { text: 'Rendirse', effect: 'defeat', next: 'game_over' }
        ]
      }
    },
    bosses: {
      manipulator: {
        name: "El Manipulador",
        dialogue: "¿Realmente tienes el coraje de abandonar todo? Tus amigos te juzgarán...",
        attacks: ["Culpas", "Chantaje Emocional", "Promesas Vacías"],
        battleDialogs: [
          "¿Has abandonado a tus amigos por esto?",
          "Tus padres estarían decepcionados de ti...",
          "Solo eres un fracaso, ¿lo sabes?",
          "Todos te han abandonado, quédate conmigo...",
          "Sin mí, no te queda nada..."
        ]
      },
      provocateur: {
        name: "El Provocador",
        dialogue: "¡Eres demasiado débil para resistir! ¡Un verdadero hombre no se echa atrás!",
        attacks: ["Desafíos de Orgullo", "Insultos", "Presión Social"],
        battleDialogs: [
          "¡Eres demasiado débil para luchar!",
          "¡Un verdadero hombre no se echa atrás!",
          "¿Tienes miedo de perder?",
          "¡Demuestra que eres fuerte!",
          "¡Solo eres un cobarde!"
        ]
      },
      illusionist: {
        name: "El Ilusionista",
        dialogue: "¡Mira cuánto dinero puedes ganar! La felicidad está al alcance de la mano...",
        attacks: ["Promesas de Riqueza", "Ilusiones de Felicidad", "Tentaciones"],
        battleDialogs: [
          "¡Mira cuánto dinero puedes ganar!",
          "La felicidad está al alcance de la mano...",
          "¡Una apuesta más y ganas todo!",
          "¡No te detengas ahora, ya casi llegas!",
          "¡La riqueza te espera!"
        ]
      },
      final_boss: {
        name: "La Adicción",
        dialogue: "Sin mí, ¿quién eres? No te queda nada...",
        attacks: ["Tentación Final", "Desesperación", "Vacío Interior"],
        battleDialogs: [
          "Sin mí, ¿quién eres?",
          "No te queda nada...",
          "Soy parte de ti, no puedes escapar!",
          "Te di todo, ahora eres mío!",
          "La libertad es solo una ilusión..."
        ]
      }
    }
  }
}; 