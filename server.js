const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { createClient } = require('redis');
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();
const VISIT_FILE = path.join(__dirname, 'visits.json');
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

// Fonction pour lire les IP déjà vues
function getVisitsData() {
  try {
    if (fs.existsSync(VISIT_FILE)) {
      return JSON.parse(fs.readFileSync(VISIT_FILE, 'utf8'));
    }
    return { count: 0, ips: [] };
  } catch (e) {
    return { count: 0, ips: [] };
  }
}

// Fonction pour ajouter une IP si elle n'existe pas
function addVisit(ip) {
  const data = getVisitsData();
  if (!data.ips.includes(ip)) {
    data.ips.push(ip);
    data.count++;
    fs.writeFileSync(VISIT_FILE, JSON.stringify(data));
  }
  return data.count;
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
app.get('/visits', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    const alreadyVisited = await redisClient.sIsMember('visitors', ip);
    if (!alreadyVisited) {
      await redisClient.sAdd('visitors', ip);
      await redisClient.incr('visitCount');
    }
    const count = await redisClient.get('visitCount');
    res.json({ visits: count || 1 });
  } catch (e) {
    console.error('Erreur Redis:', e);
    res.status(500).json({ error: 'Erreur Redis' });
  }
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
