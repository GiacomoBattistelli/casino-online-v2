#!/bin/bash

echo "🎰 Casino Online - Script di Deployment"
echo "======================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi colorati
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Controlla se Git è installato
if ! command -v git &> /dev/null; then
    print_error "Git non è installato. Installa Git prima di continuare."
    exit 1
fi

# Controlla se Node.js è installato
if ! command -v node &> /dev/null; then
    print_error "Node.js non è installato. Installa Node.js prima di continuare."
    exit 1
fi

print_status "Controllo versione Node.js..."
node_version=$(node --version)
print_status "Node.js versione: $node_version"

# Controlla se siamo in un repository Git
if [ ! -d ".git" ]; then
    print_warning "Directory non è un repository Git. Inizializzando..."
    git init
    git add .
    git commit -m "Initial commit - Casino Online"
fi

print_status "Controllo stato Git..."
git_status=$(git status --porcelain)
if [ ! -z "$git_status" ]; then
    print_warning "Ci sono modifiche non committate. Committando..."
    git add .
    git commit -m "Update before deployment"
fi

# Build del frontend
print_status "Building frontend..."
cd client
if ! npm run build &> /dev/null; then
    print_error "Errore nel build del frontend. Controlla gli errori sopra."
    exit 1
fi
print_status "Frontend build completato!"
cd ..

# Test del backend
print_status "Testando backend..."
cd server
if ! npm install &> /dev/null; then
    print_error "Errore nell'installazione delle dipendenze del backend."
    exit 1
fi
print_status "Backend test completato!"
cd ..

echo ""
echo "🎉 Preparazione completata!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Push su GitHub:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Deploy Frontend su Vercel:"
echo "   - Vai su https://vercel.com"
echo "   - Connetti il repository"
echo "   - Seleziona la cartella 'client'"
echo ""
echo "3. Deploy Backend su Railway:"
echo "   - Vai su https://railway.app"
echo "   - Connetti il repository"
echo "   - Seleziona la cartella 'server'"
echo ""
echo "4. Configurazione finale:"
echo "   - Aggiorna l'URL del backend nel frontend"
echo "   - Testa tutti i giochi online"
echo ""
echo "📖 Per dettagli completi, consulta DEPLOYMENT.md"
echo ""
print_status "Deployment script completato! 🚀" 