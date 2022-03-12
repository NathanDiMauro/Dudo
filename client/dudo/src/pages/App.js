import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import PreGame from '../components/preGame/preGame';
import EndGame from "../components/endGame"
import { SocketContext } from '../context/socketContext';
import Game from '../components/game';
import dice1 from '../images/dice1.svg'
import dice2 from '../images/dice2.svg'
import dice3 from '../images/dice3.svg'
import dice4 from '../images/dice4.svg'
import dice5 from '../images/dice5.svg'
import dice6 from '../images/dice6.svg'


export const ALL_DICE = [dice1, dice2, dice3, dice4, dice5, dice6];


function App() {

  const { room, name } = useContext(SocketContext);
  const [show, setShow] = useState(true);

  return (
    <div id="game">
      {/* <EndGame setShow={setShow} /> */}
      {!room && !name ?
        <PreGame />
        :
        <Game />
      }
    </div>
  );
}

export default App;
