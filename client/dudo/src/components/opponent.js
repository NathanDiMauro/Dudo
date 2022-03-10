import React, { useState, useEffect } from 'react';
import dice1 from '../images/dice1.svg'
import dice2 from '../images/dice2.svg'
import dice3 from '../images/dice3.svg'
import dice4 from '../images/dice4.svg'
import dice5 from '../images/dice5.svg'
import dice6 from '../images/dice6.svg'
import cup from '../images/cup.png'
import '../styles/oponent.css'

const Opponent = (props) => {
    const [hand, setHand] = useState([cup]);
    const [dice, setDice] = useState([]);
    const allDice = [dice1, dice2, dice3, dice4, dice5, dice6];

    useEffect(() => {
        // const diceToImage = (die) => {
        //     switch (die) {
        //         case 1:
        //             return dice1;
        //         case 2:
        //             return dice2;
        //         case 3:
        //             return dice3;
        //         case 4:
        //             return dice4;
        //         case 5:
        //             return dice5;
        //         case 6:
        //             return dice6;
        //         default:
        //             return cup;
        //     }
        // }
        if (props.dice) {
            setHand(props.dice.map((die) => allDice[die-1]));
        } else {
            setHand([cup]);
        }
    }, [props.dice])

    return (
        <div id="oponent">
            <h2>{props.name} <small>({props.diceCount})</small></h2>
            {hand.map((die, key) => <img src={die} key={key} />)}
            {/* <button onClick={showDice}>Show</button>
            <button onClick={hideDice}>Hide</button> */}
        </div>
    );
}
export default Opponent;