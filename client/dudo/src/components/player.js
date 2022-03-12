import React, { useState, useEffect, useContext } from 'react';
import '../styles/player.css'
import PlayerActions from './playerActions';
import LatestBid from '../components/latestBid';
import { SocketContext } from '../context/socketContext';
import { ALL_DICE } from '../pages/App';
const Player = () => {
    const { socket, name } = useContext(SocketContext);

    const [hand, setHand] = useState([]);

    useEffect(() => {
        socket.on('diceForRound', dice => {
            setHand(dice.dice.map((die) => ALL_DICE[die - 1]))
        });
    }, [socket])

    return (
        <div id="player">
            <h2>Your name: {name}</h2>
            <h2>Your Hand: {hand.map((die, key) => <img src={die} key={key} alt="dice" />)}</h2>

            <LatestBid />
            <PlayerActions />
        </div>
    );
}
export default Player;