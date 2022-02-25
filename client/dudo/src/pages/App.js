import '../styles/App.css';
import React from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import Oponent from '../components/oponent';
import { SocketProvider } from '../components/socketContext';

function App() {
  return (
    <SocketProvider id="game">
        <HostGame />
        <JoinGame />
        <Player name="Player"/>
        <div id='players'>
          <Oponent name="Oponent 1"/>
          <Oponent name="Oponent 2"/>
          <Oponent name="Oponent 3"/>
          <Oponent name="Oponent 4"/>
          <Oponent name="Oponent 5"/>
          <Oponent name="Oponent 6"/>
        </div>
    </SocketProvider>
  );
}

export default App;
