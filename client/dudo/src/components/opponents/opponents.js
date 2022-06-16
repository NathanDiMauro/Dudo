import { useContext, useEffect } from 'react';
import Opponent from './opponent';
import { SocketContext } from '../../context/socketContext';
import '../../styles/opponent.css'


const Opponents = () => {
    const { players } = useContext(SocketContext);

    // Arrange opponents in circle - see commit history for how to implement
    // useEffect(() => {
    //         const el = document.querySelector('.opponentsCircle ul');
    //         Array.from(el.children).forEach((li, idx) => {
    //             const rotation = idx * 360 / players.length;
    //             li.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) translateY(8rem) rotate(-${rotation}deg)`
    //         })
    // }, [players])

    return (
        <div className='opponents'>
            {players.map((player, key) => <Opponent key={key} name={player.playerName} diceCount={player?.diceCount} dice={player?.dice} disconnected={player.disconnected} />)}
        </div>
    )
}

export default Opponents;