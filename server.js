const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour gérer les erreurs CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// (Optionnel) Système de compteur de visites basé sur un fichier local
const VISIT_FILE = path.join(__dirname, 'visits.txt');

function getVisits() {
  try {
    if (fs.existsSync(VISIT_FILE)) {
      return parseInt(fs.readFileSync(VISIT_FILE, 'utf8'), 10) || 0;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

function incrementVisits() {
  const visits = getVisits() + 1;
  fs.writeFileSync(VISIT_FILE, visits.toString());
  return visits;
}

// Route pour obtenir le nombre de joueurs
app.get('/playercount', async (req, res) => {
    
    try {
        const response = await axios.get('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
        console.log(response.data.totalPlayerCount);
        const playerCount = response.data.totalPlayerCount || 0;
        console.log('Nombre de joueurs récupéré:', playerCount); // Log pour le débogage
        res.json({ playerCount });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

// Route pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Nouvelle route pour compter les visites uniques par IP
app.get('/visits', (req, res) => {
  const visits = incrementVisits();
  res.json({ visits });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue!');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
