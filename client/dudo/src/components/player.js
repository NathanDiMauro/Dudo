import React, { useState, useEffect } from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/player.css'
import PlayerActions from './playerActions';
import LatestBid from '../components/latestBid';

const Player = (props) => {

    const [hand, setHand] = useState([]);

    useEffect(() => {
        props.socket.on('diceForRound', dice => {
            dice=dice.dice;

            const diceBuilder = []

            console.log("Players Hand", dice)

            for (let i = 0; i < dice.length; i++) {
                switch (dice[i]) {
                    case 1: diceBuilder.push(dice1); break;
                    case 2: diceBuilder.push(dice2); break;
                    case 3: diceBuilder.push(dice3); break;
                    case 4: diceBuilder.push(dice4); break;
                    case 5: diceBuilder.push(dice5); break;
                    case 6: diceBuilder.push(dice6); break;
                }
            }

            setHand(diceBuilder)
        });
    }, [props.socket])

    if (props.show === true) {
        return null;
    }

    return (
        <div id="player">
            <h2>{props.name}:</h2>
            {hand.map((die, key) => <img src={die} key={key} alt="dice"/>)}
  
            <LatestBid show={props.show} socket={props.socket}/>
            <PlayerActions socket={props.socket} id={props.id}/>
        </div>
    );
}
export default Player;