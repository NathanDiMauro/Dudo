import { useContext, useEffect } from 'react';
import Opponent from './opponent';
import { SocketContext } from '../../context/socketContext';
import '../../styles/opponent.css'


const Opponents = () => {
    // const { players } = useContext(SocketContext);
    // const players = [{playerName: "Tim", diceCount: 5}, {playerName: "Tim", diceCount: 5}]
    // const players = [{ playerName: "Tim", dice: [2, 2], diceCount: 5 }, { playerName: "Tim", dice: [2, 2, 2, 2, 2], diceCount: 5 }, { playerName: "Tim", dice: [2, 2, 2, 2, 2], diceCount: 5 }]
    const players = [{ playerName: "1", diceCount: 5 }, { playerName: "2", diceCount: 5 }, { playerName: "3",  diceCount: 5 }, { playerName: "4",  diceCount: 5 }]

    useEffect(() => {
            const el = document.querySelector('.opponents ul');
            Array.from(el.children).forEach((li, idx) => {
                const rotation = idx * 360 / players.length;
                li.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) translateY(8rem) rotate(-${rotation}deg)`
            })
    }, [players])

    return (
        <div className='opponents'>
            <ul>
                {players.map((player, key) => <li key={key}><Opponent name={player.playerName} diceCount={player?.diceCount} dice={player?.dice} /></li>)}
            </ul>
        </div>
    )
}

export default Opponents;