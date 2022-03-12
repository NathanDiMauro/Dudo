import React, { useState, useEffect } from 'react';
import cup from '../images/cup.png';
import '../styles/oponent.css';
import { ALL_DICE } from '../pages/App';

const Opponent = (props) => {
    const [hand, setHand] = useState([cup]);

    useEffect(() => {
        if (props.dice) {
            setHand(props.dice.map((die) => ALL_DICE[die - 1]));
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