import React, { useState, useEffect, useContext } from 'react';
import cup from '../images/cup.png';
import '../styles/opponent.css';
import { ALL_DICE } from '../pages/App';
import { SocketContext } from '../context/socketContext';

const Opponent = (props) => {
    const { playersTurn } = useContext(SocketContext);

    const [hand, setHand] = useState([cup]);

    useEffect(() => {
        if (props.dice) {
            setHand(props.dice.map((die) => ALL_DICE[die - 1]));
        } else {
            setHand([cup]);
        }
    }, [props.dice])

    return (
        <div id="opponent">
            <h2 className={playersTurn === props.name && 'turn'}>{props.name} <small>({props.diceCount})</small></h2>
            {hand.map((die, key) => <img src={die} key={key} />)}
        </div>
    );
}

export default Opponent;