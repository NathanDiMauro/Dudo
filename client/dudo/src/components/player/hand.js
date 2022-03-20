import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../context/socketContext";
import { ALL_DICE } from '../../pages/App';
import '../../styles/hand.css';



const Hand = () => {
    const { socket } = useContext(SocketContext);

    const hand = ALL_DICE;

    // const [hand, setHand] = useState(ALL_DICE);

    // useEffect(() => {
    //     socket.on('diceForRound', dice => {
    //         setHand(dice.dice.map((die) => ALL_DICE[die - 1]))
    //     });
    // }, [socket])

    return (
        <div className="handContainer">
            <div className="hand">
                {hand.length > 0 &&
                    <>{hand.map((die, key) => <div key={key}><img className="die" src={die} alt={`Dice ${key + 1}`} /><p>{key + 1}</p></div>)}</>
                }
            </div>

            <div className="handFooter">
                <h2>Your Hand</h2>
            </div>
        </div>
    )
}

export default Hand;