import React, {useState, useEffect} from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/player.css'

const Player = (props) => {
    const [dice, setDice] = useState([dice1, dice2, dice3, dice4, dice5, dice6]);
    const allDice = [dice1, dice2, dice3, dice4, dice5, dice6];

    useEffect(() => {
        const diceBuilder = []

        for (let i=0; i<props.diceNum; i++)
            diceBuilder.push(allDice[Math.floor(Math.random() * 6)]);

        setDice(diceBuilder)
      }, [props.diceNum])

    if (props.show == true){
        return false;
    }

    return (
        <div id="player">
            <h2>{props.name}:</h2>
            {dice.map((die, key) => <img src={die} key={key} />)}
        </div>
    );
}
export default Player;