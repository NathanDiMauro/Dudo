import logo from './logo.svg';
import './App.css';
import React from 'react';
import SocketExample from './components/socketExample';
import { SocketProvider } from './socketContext';


function App() {
  return (
    <SocketProvider>
        <SocketExample />
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </SocketProvider>
  );
}

export default App;
