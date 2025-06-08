const express = require('express');
const axios = require('axios');
const path = require('path');
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

// Route pour obtenir le nombre de joueurs
app.get('/playercount', async (req, res) => {
    
    try {
        const response = await axios.get('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
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
