import { useState, useEffect } from 'react';

function ShoppingListApp() {
  // 🧺 États pour la liste
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputPrice, setInputPrice] = useState('');

  // ⏱ États pour le timer Pomodoro
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Charger la liste depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shopping-list');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder la liste dans localStorage
  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(items));
  }, [items]);

  // Timer Pomodoro avec nettoyage
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            alert('⏰ Temps de course écoulé !');
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    // Nettoyage du timer à la fin
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  // Ajouter un article
  const addItem = () => {
    if (inputValue.trim()) {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: inputValue,
          price: inputPrice ? parseFloat(inputPrice) : 0,
          bought: false
        }
      ]);
      setInputValue('');
      setInputPrice('');
    }
  };

  // Marquer un article comme acheté
  const toggleBought = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };

  // Supprimer un article
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Réinitialiser le timer
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  // Calculs dérivés
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const boughtCount = items.filter(item => item.bought).length;

  return (
    <div style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '20px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#34495e',  }}>🛍 Liste de Courses</h1>

      {/* Timer Pomodoro */}
      <div style={{
        backgroundColor: '#34495e',
        
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h3>Timer de Course</h3>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '20px 0',
          color: isActive ? '#e74c3c' : 'white'
        }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: '10px 20px',
              backgroundColor: isActive ? '#f39c12' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isActive ? 'Pause' : 'Démarrer'}
          </button>
          <button
            onClick={resetTimer}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Formulaire d’ajout */}
      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Nom de l’article..."
            style={{
              flex: 2,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px'
            }}
          />
          <input
            type="number"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Prix..."
            step="0.01"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px'
            }}
          />
          <button
            onClick={addItem}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des articles */}
      <div>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: item.bought ? '#d5f4e6' : 'white',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          >
            <input
              type="checkbox"
              checked={item.bought}
              onChange={() => toggleBought(item.id)}
              style={{
                marginRight: '15px',
                width: '20px',
                height: '20px'
              }}
            />
            <span style={{
              flex: 1,
              textDecoration: item.bought ? 'line-through' : 'none',
              color: item.bought ? '#95a5a6' : '#2c3e50',
              fontSize: '16px'
            }}>
              {item.name}
            </span>
            <span style={{
              fontWeight: 'bold',
              marginRight: '15px',
              color: '#27ae60'
            }}>
              {item.price.toFixed(2)} DT
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Statistiques */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#3498db',
        color: 'white',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>
          <strong>Total :</strong> {items.length} articles |
          <strong> Achetés :</strong> {boughtCount}
        </div>
        <div>
          <strong>Prix total :</strong> {totalPrice.toFixed(2)} DT
        </div>
      </div>
    </div>
  );
}

export default ShoppingListApp;