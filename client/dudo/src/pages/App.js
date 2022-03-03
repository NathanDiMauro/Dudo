import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import Oponent from '../components/oponent';
import { SocketContext } from '../components/socketContext'; 

function App() {
  
  const socket = useContext(SocketContext);
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Adding an event listener to the socket to listen for new players
    // It will continually listen to the players event being emitted from the backend
    // And whenever a new player is added or remove, it will update the players array
    socket.on('players', players => {
        console.log("Players: ", players)
        setPlayers(players);
    })
}, [socket])
  
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
    if (!show)
      return <button onClick={leaveGame}>Leave Game</button>
  }

  const showRoom = () => {
    if (!show)
      return <h1>Room Code: {room}</h1>
  }

  return (
    <div id="game">
      <HostGame name={name} setName={setName} room={room} setRoom={setRoom} 
                players={players} setPlayers={setPlayers} show={show} setShow={setShow}
                socket={socket}/>

      <JoinGame name={name} setName={setName} room={room} setRoom={setRoom} 
                players={players} setPlayers={setPlayers} show={show} setShow={setShow}
                socket={socket}/>
      {showRoom()}
      <Player name={name} show={show}/>
      <div id='players'>
        {outPutOp()}
        {/* <Oponent name="Oponent 1"/> */}
        {showLeave()}
      </div>
    </div>
  );
}

export default App;
