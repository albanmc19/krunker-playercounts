const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/playercount', async (req, res) => {
  try {
    const response = await fetch('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
    if (!response.ok) {
      console.error('Erreur lors de la requête vers Krunker.io:', response.status, response.statusText);
      return res.status(500).json({ error: 'Erreur lors de la récupération du nombre de joueurs (fetch failed)' });
    }
    const data = await response.json();
    if (!data.totalPlayerCount) {
      console.error('Réponse inattendue de Krunker.io:', data);
      return res.status(500).json({ error: 'Réponse inattendue de Krunker.io' });
    }
    res.json({ playerCount: data.totalPlayerCount });
  } catch (e) {
    console.error('Erreur attrapée dans le catch:', e);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de joueurs (catch)' });
  }
});

app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
