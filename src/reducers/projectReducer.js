export const initialState = {
  projects: []
};

export function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT': {
      const { title, description, status, deadline } = action.payload;
      const proj = {
        id: Date.now(),
        title,
        description,
        status,
        deadline,
        createdAt: new Date().toISOString(),
        // Pomodoro defaults: 25min work / 5min break
        pomodoro: {
          isRunning: false,
          mode: 'work', 
          remaining: 25 * 60,
          workDuration: 25 * 60,
          breakDuration: 5 * 60,
          cyclesCompleted: 0
        }
      };
      return { ...state, projects: [proj, ...state.projects] };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p)
      };
    }

    case 'DELETE_PROJECT': {
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    }

    case 'SET_PROJECTS': {
      return { ...state, projects: action.payload };
    }

    case 'TOGGLE_STATUS': {
      // cycle: todo -> doing -> done -> todo
      return {
        ...state,
        projects: state.projects.map(p => {
          if (p.id !== action.payload) return p;
          const next = p.status === 'todo' ? 'doing' : p.status === 'doing' ? 'done' : 'todo';
          return { ...p, status: next };
        })
      };
    }

    case 'START_TIMER': {
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload ? { ...p, pomodoro: { ...p.pomodoro, isRunning: true } } : p)
      };
    }

    case 'PAUSE_TIMER': {
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload ? { ...p, pomodoro: { ...p.pomodoro, isRunning: false } } : p)
      };
    }

    case 'RESET_TIMER': {
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload ? { ...p, pomodoro: { ...p.pomodoro, isRunning: false, mode: 'work', remaining: p.pomodoro.workDuration, cyclesCompleted: 0 } } : p)
      };
    }

    case 'TICK_TIMER': {
      // payload: project id
      return {
        ...state,
        projects: state.projects.map(p => {
          if (p.id !== action.payload) return p;
          const pom = { ...p.pomodoro };
          if (!pom.isRunning) return p;
          const nextRemaining = Math.max(0, pom.remaining - 1);
          if (nextRemaining > 0) {
            return { ...p, pomodoro: { ...pom, remaining: nextRemaining } };
          }

          // reached zero -> switch mode
          if (pom.mode === 'work') {
            // finish work cycle -> start break
            return {
              ...p,
              pomodoro: {
                ...pom,
                mode: 'break',
                remaining: pom.breakDuration
              }
            };
          }

          // finished break -> start work and count cycle
          return {
            ...p,
            pomodoro: {
              ...pom,
              mode: 'work',
              remaining: pom.workDuration,
              cyclesCompleted: (pom.cyclesCompleted || 0) + 1
            }
          };
        })
      };
    }

    default:
      return state;
  }
}

export default projectReducer;
