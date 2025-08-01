# 🎮 Steam Build - The Story of Life

## 📦 Preparazione Build Steam

### 🛠️ Prerequisiti

1. **Steam SDK**: Scarica Steamworks SDK
2. **Account Steam Partner**: Registrati su Steam Partner
3. **Build Tools**: Node.js, npm, Electron (opzionale)

### 📋 Processo di Build

#### 1. Build Web (Attuale)
```bash
cd client
npm run build
```

#### 2. Build Electron (Opzionale)
```bash
# Installa Electron
npm install --save-dev electron electron-builder

# Crea build Electron
npm run electron:build
```

#### 3. Build Steam
```bash
# Crea cartella Steam
mkdir steam-build
cp -r client/build/* steam-build/
cp steam-app.vdf steam-build/
```

### 🎯 File Necessari per Steam

#### 1. steam_app.vdf
```vdf
"appbuild"
{
    "appid" "YOUR_APP_ID"
    "desc" "The Story of Life - Build 1.0"
    "buildoutput" "build"
    "contentroot" "steam-build"
    "setlive" "beta"
    "preview" "0"
    "local" ""
    "depots"
    {
        "YOUR_DEPOT_ID"
        {
            "filelisting"
            {
                "method" "all"
                "recursive" "1"
            }
        }
    }
}
```

#### 2. steam_appid.txt
```
YOUR_APP_ID
```

#### 3. steam_runtime.txt
```
steam_runtime_win64
```

### 📁 Struttura Build Steam

```
steam-build/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── audio/
│   ├── menu.wav
│   ├── battle.wav
│   └── ...
├── steam_appid.txt
└── steam_runtime.txt
```

### 🚀 Upload su Steam

#### 1. Steam Partner
1. Vai su [Steam Partner](https://partner.steamgames.com/)
2. Accedi con il tuo account
3. Crea una nuova app
4. Configura i dettagli base

#### 2. SteamCMD
```bash
# Installa SteamCMD
# Windows: steamcmd.exe
# Linux: ./steamcmd.sh

# Login
steamcmd +login YOUR_USERNAME

# Upload build
steamcmd +app_build YOUR_APP_ID steam_app.vdf +quit
```

#### 3. Steam Console
```bash
# Build e upload
steamcmd +login YOUR_USERNAME +app_build YOUR_APP_ID steam_app.vdf +quit
```

### 📊 Configurazione Steam

#### 1. App Details
- **Nome**: The Story of Life
- **Categoria**: Indie, Narrativo
- **Prezzo**: Gratuito
- **Lingue**: Italiano, Inglese, Spagnolo

#### 2. Store Page
- **Descrizione**: Copia da STEAM_RELEASE.md
- **Screenshots**: 6 immagini professionali
- **Video**: Trailer 1-2 minuti
- **Tag**: Visual Novel, RPG, Educational

#### 3. Build Configuration
- **Branch**: Default
- **Build**: 1.0.0
- **Depots**: Configura i file necessari

### 🎮 Testing Steam

#### 1. Test Locale
```bash
# Avvia Steam in modalità dev
steam.exe -applaunch YOUR_APP_ID -dev
```

#### 2. Test Beta
1. Upload build beta
2. Invita tester
3. Raccogli feedback
4. Risolvi problemi

#### 3. Test Pubblico
1. Rilascio beta pubblica
2. Monitora metriche
3. Raccogli recensioni
4. Prepara release finale

### 📈 Metriche Steam

#### 1. Steam Analytics
- **Download**: Numero di download
- **Playtime**: Tempo di gioco medio
- **Retention**: Tasso di completamento
- **Reviews**: Recensioni positive/negative

#### 2. Steam Community
- **Discussions**: Attività forum
- **Screenshots**: Screenshot condivisi
- **Workshop**: Contenuti creati (futuro)

### 🎯 Release Strategy

#### 1. Soft Launch
- [ ] Beta privata (amici/famiglia)
- [ ] Beta pubblica (Steam)
- [ ] Rilascio Early Access (opzionale)
- [ ] Release finale

#### 2. Marketing Steam
- [ ] Steam Community Hub
- [ ] Steam Curators
- [ ] Steam Events
- [ ] Steam Sales

#### 3. Post-Release
- [ ] Monitora metriche
- [ ] Raccogli feedback
- [ ] Pianifica aggiornamenti
- [ ] Espandi audience

### 💰 Monetizzazione Steam

#### 1. Modello Gratuito
- **Prezzo**: Gratuito
- **Donazioni**: Steam Wallet
- **DLC**: Contenuti aggiuntivi (futuro)

#### 2. Revenue Streams
- **Steam Donations**: 30% Steam + 70% Developer
- **Merchandising**: Steam Points
- **Partnership**: Educational institutions

### 🎉 Pronto per Steam!

Il tuo gioco è pronto per essere pubblicato su Steam! Segui questi passaggi:

1. **Prepara il build** seguendo le istruzioni
2. **Configura Steam Partner** con i dettagli
3. **Upload il build** usando SteamCMD
4. **Configura la store page** con screenshots e video
5. **Rilascia in beta** per testing
6. **Rilascia pubblicamente** quando pronto

**Buona fortuna con il tuo primo gioco su Steam! 🚀** 