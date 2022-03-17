import React, { useState, useEffect, useContext } from 'react';
import '../styles/player.css'
import PlayerActions from './playerActions';
import LatestBid from '../components/latestBid';
import { SocketContext } from '../context/socketContext';
import { ALL_DICE } from '../pages/App';


const Player = () => {
    const { socket } = useContext(SocketContext);

    const [hand, setHand] = useState(ALL_DICE);

    useEffect(() => {
        socket.on('diceForRound', dice => {
            setHand(dice.dice.map((die) => ALL_DICE[die - 1]))
        });
    }, [socket])

    return (
        <div id="player">
            {hand.length > 0 &&
                <h3>Your Hand: {hand.map((die, key) => <img className="die" src={die} key={key} alt="dice" />)}</h3>
            }

            <LatestBid />
            <PlayerActions />
        </div>
    );
}
export default Player;