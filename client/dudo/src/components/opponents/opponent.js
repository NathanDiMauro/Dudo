import React, { useContext } from 'react';
import cup from '../../images/cup.png';
import { ALL_DICE } from '../../pages/App';
import { SocketContext } from '../../context/socketContext';
import disconnectedIcon from '../../images/disconnected.png';

const Opponent = (props) => {
    const { playersTurn } = useContext(SocketContext);

    return (
        <div className="opponentContainer">
            {props.dice &&
                <div className="opponentDiceContainer">
                    {props.dice.map((die, key) => <img className="dieCue" src={ALL_DICE[die - 1]} key={key} alt={`${props.name}'s cup`} />)}
                </div>
            }
            <div className={`${playersTurn === props.name ? 'turn' : ''} opponent`}>
                <h3>{props.name} {props.disconnected && <img className="disconnectedIcon" src={disconnectedIcon} alt='disconnected icon' />} <br />{props.diceCount}</h3>
                <div className="opponentCup">
                    <img src={cup} alt="Cup" />
                </div>
            </div>
        </div>
    );
}

export default Opponent;