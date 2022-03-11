import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import EndGame from "../components/endGame"
import { SocketContext } from '../components/socketContext';
import Notification from '../components/notification';
import Opponents from '../components/opponents';

function App() {

  const socket = useContext(SocketContext);
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);
  const [show, setShow] = useState(true);
  const [player, setPlayer] = useState([]);
  const [oponentsComponents, setOponentsComponents] = useState([]);
  const [startRound, setStartRound] = useState(false);

  const leaveGame = () => {
    setName(null);
    setRoom(null);
    setOponentsComponents([]);
    setShow(true);

    socket.emit('_disconnect')
  }

  const showLeave = () => {
    if (!show)
      return <button onClick={leaveGame}>Leave Game</button>
  }

  const showRoom = () => {
    if (!show)
      return <h1>Room Code: {room}</h1>
  }

  const startGame = () => {
    socket.emit('startGame', { new_game: !startRound });
    setStartRound(false)
  }

  const showStart = () => {
    if (!show) {
      let text = 'Start Round'
      if (!startRound) text = 'Start Game'
      return <button onClick={startGame}>{text}</button>
    }
  }

  return (
    <div id="game">
      <EndGame socket={socket} setShow={setShow}/>
      <HostGame name={name} setName={setName} room={room} setRoom={setRoom}
        show={show} setShow={setShow} socket={socket} />

      <JoinGame name={name} setName={setName} room={room} setRoom={setRoom}
        show={show} setShow={setShow} socket={socket} />
      {showRoom()}
      <Player name={name} show={show} diceNum={player.diceCount} socket={socket}
        id={socket.id} />
      {!show && <Opponents name={name} />}

      <Notification show={show} socket={socket} setStartRound={setStartRound} />
      {showStart()}
      {showLeave()}
    </div>
  );
}

export default App;
