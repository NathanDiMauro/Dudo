import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import Oponent from '../components/oponent';
import { SocketProvider } from '../components/socketContext';
import SocketExample from '../components/socketExample';

function App() {
  
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);

  return (
    <SocketProvider id="game">
      <SocketExample />
        {/* <HostGame name={name} setName={setName} room={room} setRoom={setRoom}/>
        <JoinGame name={name} setName={setName} room={room} setRoom={setRoom}/>
        <Player name={name}/>
        <div id='players'>
          <Oponent name="Oponent 1"/>
          <Oponent name="Oponent 2"/>
        </div> */}
    </SocketProvider>
  );
}

export default App;
