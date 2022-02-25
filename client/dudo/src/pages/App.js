import '../styles/App.css';
import React from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player"
import { SocketProvider } from '../components/socketContext';

function App() {
  return (
    <SocketProvider id="game">
        <HostGame />
        <JoinGame />
        <Player name="Player" room/>
    </SocketProvider>
  );
}

export default App;
