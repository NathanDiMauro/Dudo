import '../../styles/App.css';
import { useContext } from 'react';
import Opponent from './opponent';
import { SocketContext } from '../../context/socketContext';


const Opponents = () => {
    const { players } = useContext(SocketContext);

    return (
        <div id='players'>
            {players.map((player, key) => <Opponent key={key} name={player.playerName} diceCount={player?.diceCount} dice={player?.dice} />)}
        </div>
    )
}

export default Opponents;