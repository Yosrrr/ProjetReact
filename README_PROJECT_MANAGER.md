# Gestionnaire de Projets (React)

Ce projet ajoute un composant `ProjectManager` à l'application existante. Il illustre l'utilisation conjointe de `useReducer`, `useEffect` et `useState` pour :

- Gérer une liste de projets (ajout, suppression, modification de statut)
- Persister les données dans `localStorage`
- Gérer un timer Pomodoro par projet (start/pause/reset)
- Filtrer, trier par deadline et rechercher dans titre/description
- Afficher des statistiques visuelles simples

Fichiers ajoutés :

- `src/reducers/projectReducer.js` : reducer central
- `src/ProjectManager.jsx` : composant principal
- `docs/REDUCER.md` : explication des cas du reducer
- `docs/USE_EFFECTS.md` : explication de chaque useEffect

Comment lancer l'application (Vite) :

1. Installer les dépendances si nécessaire :

```powershell
npm install
```

2. Lancer le serveur de développement :

```powershell
npm run dev
```

3. Ouvrir `http://localhost:5173` dans votre navigateur (port par défaut Vite).

Captures d'écran :

- Pour faire des captures sur Windows : utilisez l'Outil Capture d'écran (Win+Shift+S) ou PrintScreen, puis collez dans un éditeur.
- Capturer les UIs demandées :
  - Formulaire d'ajout
  - Filtrage par statut
  - Tri par deadline
  - Recherche dans titre/description
  - Timer Pomodoro en fonctionnement (démarrer/pause/reset)
  - Statistiques visuelles

Explications et vérifications :

- Voir `docs/REDUCER.md` pour le détail des actions prises en charge par le reducer.
- Voir `docs/USE_EFFECTS.md` pour expliquer la persistance et la logique de timer.

Souhaitez-vous que je :

- Ajoute des tests unitaires pour le reducer ?
- Ajoute un petit composant graphique (chart) pour des statistiques plus riches ?
