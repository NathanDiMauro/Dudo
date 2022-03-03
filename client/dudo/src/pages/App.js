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
  const [show, setShow] = useState(true);
  const [player, setPlayer] = useState([]);
  const [oponents, setOponents] = useState([]);
  const [oponentsComponents, setOponentsComponents] = useState([]);

  useEffect(() => {
    // Adding an event listener to the socket to listen for new players
    // It will continually listen to the players event being emitted from the backend
    // And whenever a new player is added or remove, it will update the players array
    socket.on('test', message => {
      console.log(message);
      
    })
  }, [socket])

  useEffect(() => {
    // Adding an event listener to the socket to listen for new players
    // It will continually listen to the players event being emitted from the backend
    // And whenever a new player is added or remove, it will update the players array
    socket.on('players', players => {
      console.log("Recived Players", players);

      let oponentsBuilder=[];

      for (let i = 0; i<players.length; i++) {
        console.log(players[i].playerName != name);
        if (players[i].playerName != name)
          oponentsBuilder.push(players[i].playerName)
        else
          setPlayer(players[i].playerName)
      }

      setOponents(oponentsBuilder);

      const oponentComponentBuilder = oponentsBuilder.map((name) =>
        <Oponent name={name} key={name}/>
      );

      setOponentsComponents(oponentComponentBuilder)
    })
  }, [socket, name])
  
  const leaveGame = () => {
    setName(null);
    setRoom(null);
    setOponentsComponents([]);
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
                show={show} setShow={setShow} socket={socket}/>

      <JoinGame name={name} setName={setName} room={room} setRoom={setRoom} 
                show={show} setShow={setShow} socket={socket}/>
      {showRoom()}
      <Player name={name} show={show}/>
      <div id='players'>
        {oponentsComponents}
      </div>
      {showLeave()}
    </div>
  );
}

export default App;
