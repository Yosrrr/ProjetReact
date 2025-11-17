export const initialState = {
todos: [],
filter : 'all' // 'all', 'active', 'completed'

};

export function todoReducer (state, action) {
switch (action.type) {
case 'ADD_TODO' :
return {
    ...state,
    todos:[
        {
            id: Date.now(),
            text: action.payload,
            completed: false,
            createdAt: new Date().toISOString()
        },
        ...state.todos
    ]
};
case 'TOGGLE_TODO' :
return {
    ...state,
    todos: state.todos.map(todo =>
        todo.id === action.payload
            ? { ...todo, completed: !todo.completed}
            : todo
    )
};

case 'DELETE_TODO' :
return {
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.payload)
};
case 'SET_FILTER' :
return {
    ...state,
    filter: action.payload
};

case 'LOAD_TODOS' :
return {
    ...state,
    todos: action.payload
};

default :
return state;

}
}