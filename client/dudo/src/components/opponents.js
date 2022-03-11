import '../styles/App.css';
import { useContext, useEffect, useState } from 'react';
import Opponent from './opponent';
import { SocketContext } from './socketContext';


const Opponents = (props) => {
    const socket = useContext(SocketContext);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const handleEndOfRound = (data) => {
            console.log(data);
            setPlayers(data.dice.filter((player) => player.playerName !== props.name ));
        }

        const handleNewPlayers = (players) => {
            setPlayers(players.filter((player) => player.playerName !== props.name ));
        }

        socket.on('endOfRound', handleEndOfRound);
        socket.on('players', handleNewPlayers)

    }, [socket, props.name])


    return (
        <div id='players'>
            {players.map((player, key) => <Opponent key={key} name={player.playerName} diceCount={player?.diceCount} dice={player?.dice} />)}
        </div>
    )
}

export default Opponents;