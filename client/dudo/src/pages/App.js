import '../styles/App.css';
import React from 'react';
import JoinGame from '../components/join';
import { SocketProvider } from '../components/socketContext';

function App() {
  return (
    <SocketProvider>
        <JoinGame />
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
