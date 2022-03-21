import { useContext } from 'react';
import Opponent from './opponent';
import { SocketContext } from '../../context/socketContext';
import '../../styles/opponent.css'


const Opponents = () => {
    // const { players } = useContext(SocketContext);
    const players = [{playerName: "Tim", diceCount: 5}, {playerName: "Tim", diceCount: 5}]

    return (
        <div className='opponents'>
            {players.map((player, key) => <Opponent key={key} name={player.playerName} diceCount={player?.diceCount} dice={player?.dice} />)}
        </div>
    )
}

export default Opponents;