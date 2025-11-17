import React, { useReducer, useState, useEffect, useRef } from 'react';
import { projectReducer, initialState } from './reducers/projectReducer';

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ProjectManager() {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('todo');

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const timersRef = useRef({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      dispatch({ type: 'SET_PROJECTS', payload: JSON.parse(saved) });
    }
  }, []);

  // Persist projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
  }, [state.projects]);

  // Timer effect: create an interval per running project
  useEffect(() => {
    // clear intervals for projects that stopped or were removed
    Object.keys(timersRef.current).forEach(id => {
      const proj = state.projects.find(p => String(p.id) === id);
      if (!proj || !proj.pomodoro || !proj.pomodoro.isRunning) {
        clearInterval(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });

    // create intervals for running projects
    state.projects.forEach(proj => {
      const key = String(proj.id);
      if (proj.pomodoro && proj.pomodoro.isRunning && !timersRef.current[key]) {
        timersRef.current[key] = setInterval(() => {
          dispatch({ type: 'TICK_TIMER', payload: proj.id });
        }, 1000);
      }
    });

    return () => {
      // cleanup on unmount
      Object.values(timersRef.current).forEach(clearInterval);
      timersRef.current = {};
    };
  }, [state.projects]);

  function addProject() {
    if (!title.trim()) return;
    dispatch({ type: 'ADD_PROJECT', payload: { title: title.trim(), description: description.trim(), status, deadline } });
    setTitle(''); setDescription(''); setDeadline(''); setStatus('todo');
  }

  function startTimer(id) { dispatch({ type: 'START_TIMER', payload: id }); }
  function pauseTimer(id) { dispatch({ type: 'PAUSE_TIMER', payload: id }); }
  function resetTimer(id) { dispatch({ type: 'RESET_TIMER', payload: id }); }

  function deleteProject(id) { if (confirm('Supprimer ce projet ?')) dispatch({ type: 'DELETE_PROJECT', payload: id }); }

  // Derived list: search, filter, sort
  const visible = state.projects
    .filter(p => {
      if (filter === 'all') return true;
      return p.status === filter;
    })
    .filter(p => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      const diff = new Date(a.deadline) - new Date(b.deadline);
      return sortAsc ? diff : -diff;
    });

  // Stats
  const counts = { todo: 0, doing: 0, done: 0 };
  state.projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
  const total = state.projects.length || 1;

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 20, backgroundColor: '#232323ff', minHeight: '100vh' ,backgroundPosition: 'center', backgroundSize: 'cover', backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-mosaic.png)' }}>
      <h1 style={{ textAlign: 'center', color: '#8b5cf6', fontWeight: 'bold', marginBottom: 30 }}> Gestionnaire de Projets</h1>

      {/* Formulaire */}
      <div style={{ backgroundColor: '#6c6a7fff', padding: 16, borderRadius: 8, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" style={{ flex: 2, padding: 10 }} />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 10 }}>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ padding: 10 }} />
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={{ width: '100%', padding: 10, marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={addProject} style={{ padding: '10px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>Ajouter</button>
          <div style={{ marginLeft: 'auto' }}>
            <input placeholder="Recherche..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, marginRight: 8 }} />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 8, marginRight: 8 }}>
              <option value="all">Toutes</option>
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button onClick={() => setSortAsc(s => !s)} style={{ padding: 8 }}>{sortAsc ? 'Trier ↑' : 'Trier ↓'}</button>
          </div>
        </div>
      </div>

      {/* Stats visual */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {['todo', 'doing', 'done'].map(k => (
          <div key={k} style={{ flex: 1, background: '#817474ff', padding: 10, borderRadius: 8 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{k.toUpperCase()}</div>
            <div style={{ height: 12, background: '#7b6d6dff', borderRadius: 6 }}>
              <div style={{ height: '100%', width: `${(counts[k] / total) * 100}%`, background: k === 'todo' ? '#3498db' : k === 'doing' ? '#f1c40f' : '#2ecc71', borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 8, textAlign: 'right' }}>{counts[k]} projet(s)</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div>
        {visible.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#b0b0b0' }}>Aucun projet à afficher</p>
        ) : visible.map(p => (
          <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, marginBottom: 10, border: '1px solid #4a4a6a', borderRadius: 8, background: '#2d2d44' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#e0e0e0' }}>{p.title}</div>
                  <div style={{ color: '#b0b0b0' }}>{p.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>{p.status}</div>
                  <div style={{ fontSize: 12, color: '#a0a0a0' }}>{p.deadline ? `Deadline: ${p.deadline}` : 'Sans deadline'}</div>
                </div>
              </div>

              {/* Pomodoro display */}
              <div style={{ marginTop: 12, padding: 12, backgroundColor: '#3d566fff', borderRadius: 8, border: '1px solid #506479ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      fontFamily: 'monospace', 
                      fontSize: 28, 
                      fontWeight: 'bold',
                      color: p.pomodoro.isRunning ? (p.pomodoro.mode === 'work' ? '#e74c3c' : '#27ae60') : '#a8a7b1ff'
                    }}>
                      {formatTime(p.pomodoro.remaining)}
                    </div>
                    <div style={{ 
                      padding: '4px 12px', 
                      borderRadius: 4, 
                      backgroundColor: p.pomodoro.mode === 'work' ? '#e74c3c' : '#27ae60',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {p.pomodoro.mode === 'work' ? '🔥 TRAVAIL' : '☕ PAUSE'}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#6c757d' }}>
                    Cycles: {p.pomodoro.cyclesCompleted || 0}
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div style={{ height: 6, backgroundColor: '#556e88ff', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(p.pomodoro.remaining / (p.pomodoro.mode === 'work' ? p.pomodoro.workDuration : p.pomodoro.breakDuration)) * 100}%`,
                    backgroundColor: p.pomodoro.mode === 'work' ? '#e74c3c' : '#27ae60',
                    transition: 'width 1s linear'
                  }} />
                </div>

                {/* Boutons de contrôle */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {!p.pomodoro.isRunning ? (
                    <button onClick={() => startTimer(p.id)} style={{ 
                      flex: 1,
                      padding: '8px 12px', 
                      background: '#27ae60', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 6,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                      ▶️ Démarrer
                    </button>
                  ) : (
                    <button onClick={() => pauseTimer(p.id)} style={{ 
                      flex: 1,
                      padding: '8px 12px', 
                      background: '#f39c12', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 6,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                      ⏸️ Pause
                    </button>
                  )}
                  <button onClick={() => resetTimer(p.id)} style={{ 
                    padding: '8px 12px', 
                    background: '#499ba1ff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}>
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: p.id })} style={{ padding: 8, background: '#3498db', color: 'white', border: 'none', borderRadius: 6 }}>Changer statut</button>
              <button onClick={() => deleteProject(p.id)} style={{ padding: 8, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6 }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
