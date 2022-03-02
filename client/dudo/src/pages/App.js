import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import Oponent from '../components/oponent';
import { SocketProvider } from '../components/socketContext';

function App() {
  
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [show, setShow] = useState(true);

  const outPutName = () => {
    if (name)
      return 
  }

  const outPutOp = () => {
    for (const player in players){
      console.log("Player:",player)
    }
  }

  const leaveGame = () => {
    setName(null);
    setRoom(null);
    setPlayers([]);
    setShow(true);
  }

  const showLeave = () => {
    if (name)
      return <button onClick={leaveGame}>Leave Game</button>
  }

  return (
    <SocketProvider id="game">
        <HostGame name={name} setName={setName} room={room} setRoom={setRoom} 
                  players={players} setPlayers={setPlayers} show={show} setShow={setShow}/>

        <JoinGame name={name} setName={setName} room={room} setRoom={setRoom} 
                  players={players} setPlayers={setPlayers} show={show} setShow={setShow}/>
                  
        <Player name={name} show={show}/>
        <div id='players'>
          {outPutOp()}
          {/* <Oponent name="Oponent 1"/> */}
          {showLeave()}
        </div>
    </SocketProvider>
  );
}

export default App;
