# Explication des `useEffect` dans `ProjectManager`

Il y a trois `useEffect` principaux dans `ProjectManager.jsx` :

1) Chargement initial depuis `localStorage`:

```js
useEffect(() => {
  const saved = localStorage.getItem('projects');
  if (saved) {
    dispatch({ type: 'SET_PROJECTS', payload: JSON.parse(saved) });
  }
}, []);
```

- Objet : restaurer l'état précédemment sauvegardé au montage du composant.
- Déclenchement : une fois (dépendances = []).

2) Persistance des projets:

```js
useEffect(() => {
  localStorage.setItem('projects', JSON.stringify(state.projects));
}, [state.projects]);
```

- Objet : sauvegarder automatiquement tous les changements de la liste `projects` dans `localStorage`.
- Déclenchement : chaque fois que `state.projects` change.

3) Gestion des timers Pomodoro (un interval par projet en cours):

```js
useEffect(() => {
  // nettoyage des timers obsolètes
  // création d'intervalles pour les projets dont pomodoro.isRunning === true
  return () => { clear all intervals };
}, [state.projects]);
```

- Objet : pour chaque projet dont `pomodoro.isRunning` est vrai, on crée un `setInterval` qui dispatch `TICK_TIMER` chaque seconde.
- Ce `useEffect` s'occupe aussi de nettoyer les intervals des projets qui ont été stoppés ou supprimés, et nettoie tout à la désinsertion (unmount).
- Cela permet d'utiliser le reducer pour mettre à jour l'état au rythme d'une seconde sans dupliquer la logique locale dans chaque composant.

Remarque de sécurité : lors du travail avec plusieurs intervals, on stocke leurs IDs dans une `ref` (`timersRef`) pour pouvoir les nettoyer proprement.
