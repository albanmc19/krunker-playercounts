const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route pour obtenir le nombre de joueurs
app.get('/playercount', async (req, res) => {
    try {
        const response = await axios.get('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
        const playerCount = response.data.totalPlayerCount || 0;
        res.json({ playerCount });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
