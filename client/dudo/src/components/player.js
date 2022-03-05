import React, { useState, useEffect } from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/player.css'
import PlayerActions from './playerActions';

const Player = (props) => {

    const [hand, setHand] = useState([]);

    useEffect(() => {
        if (props.playerHand) {
            const diceBuilder = []

            console.log("PHand", props.playerHand.dice)

            for (let i = 0; i < props.playerHand.dice.length; i++) {
                switch (props.playerHand.dice[i]) {
                    case 1: diceBuilder.push(dice1); break;
                    case 2: diceBuilder.push(dice2); break;
                    case 3: diceBuilder.push(dice3); break;
                    case 4: diceBuilder.push(dice4); break;
                    case 5: diceBuilder.push(dice5); break;
                    case 6: diceBuilder.push(dice6); break;
                }
            }
            setHand(diceBuilder)
        }
    }, [props.playerHand])


    if (props.show === true) {
        return null;
    }

    return (
        <div id="player">
            <h2>{props.name}:</h2>
            {hand.map((die, key) => <img src={die} key={key} alt="dice"/>)}

            <PlayerActions socket={props.socket} id={props.id}/>
        </div>
    );
}
export default Player;