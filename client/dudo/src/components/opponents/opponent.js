import React, { useState, useEffect, useContext } from 'react';
import cup from '../../images/cup.png';
import '../../styles/opponent.css'
import { ALL_DICE } from '../../pages/App';
import { SocketContext } from '../../context/socketContext';

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
        <div className={`${playersTurn === props.name ? 'turn' : ''} opponent`}>
            <div className="opponentName">
                <h2>{props.name}</h2>
                &nbsp;
                <p>({props.diceCount})</p>
            </div>
            {hand.map((die, key) => <img src={die} key={key} alt={`${props.name}'s cup`} />)}
        </div>
    );
}

export default Opponent;