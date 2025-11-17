# Explication du reducer `projectReducer`

Le reducer gère l'état `projects` — un tableau d'objets projet. Chaque projet contient :

- `id` : identifiant unique (Date.now())
- `title`, `description`, `status` ("todo"/"doing"/"done"), `deadline`
- `createdAt` : chaîne ISO
- `pomodoro` : état du timer (voir plus bas)

Actions supportées :

- `ADD_PROJECT` : payload { title, description, status, deadline }
  - Crée un nouvel objet projet avec l'état `pomodoro` initialisé (25min / 5min).

- `UPDATE_PROJECT` : payload { id, updates }
  - Met à jour les champs fournis pour le projet identifié par `id`.

- `DELETE_PROJECT` : payload = id
  - Supprime le projet.

- `SET_PROJECTS` : payload = projects[]
  - Remplace la liste (utilisé lors du chargement depuis localStorage).

- `TOGGLE_STATUS` : payload = id
  - Fait varier le statut dans l'ordre `todo` -> `doing` -> `done` -> `todo`.

- `START_TIMER` / `PAUSE_TIMER` / `RESET_TIMER` : payload = id
  - Permettent de démarrer, arrêter ou réinitialiser le timer du projet.

- `TICK_TIMER` : payload = id
  - Diminue `pomodoro.remaining` d'une seconde. Si `remaining` atteint 0, bascule le mode `work` ↔ `break` et réinitialise `remaining` sur la durée correspondante. Lorsqu'un break se termine, on incrémente `cyclesCompleted`.

Remarques :

- La logique du timer est volontairement dans le reducer (mutations via actions) pour garder l'état centralisé et facilement persistable.
- Les durées par défaut sont définies en secondes : `workDuration = 25*60`, `breakDuration = 5*60`.
