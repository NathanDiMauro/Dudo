import '../styles/App.css';
import React from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import { SocketProvider } from '../components/socketContext';

function App() {
  return (
    <SocketProvider id="game">
        <HostGame />
        <JoinGame />
        
    </SocketProvider>
  );
}

export default App;
