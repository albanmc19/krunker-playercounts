# Compteur de joueurs Krunker en temps réel

Ce projet permet de suivre en temps réel le nombre de joueurs connectés sur Krunker.io avec un graphique interactif.

## Fonctionnalités

- Affichage en temps réel du nombre de joueurs
- Graphique interactif avec Chart.js
- Historique des données (30min, 1h, 1j, tout l'historique)
- Stockage local des données
- Mise à jour automatique toutes les 10 secondes

## Technologies utilisées

- Node.js
- Express
- Chart.js
- API Krunker.io

## Déploiement sur Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Connectez votre dépôt GitHub
3. Railway détectera automatiquement le `package.json` et déploiera l'application

## Installation locale

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

L'application sera accessible sur `http://localhost:3000`
