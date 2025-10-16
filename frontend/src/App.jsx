/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/test_controller')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  const fetchRandomNumber = () => {
    fetch('http://localhost:3000/num_controller')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setNumber(data.number))
      .catch(err => console.error(err));
  };

  const fetchImage = () => {
    fetch('http://localhost:3000/image_controller')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const img = document.createElement('img');
        img.src = data.image_url
        document.body.appendChild(img);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>React + Rails API Test</h1>
      <p>{message}</p>

      <button onClick={fetchRandomNumber}>
        Get Random Number
      </button>
      {number !== null && <p>Random Number: {number}</p>}

      <button onClick={fetchImage}>
        Fetch and Display Image
      </button>
    </div>
  );
}


export default App;