import React, {useState, useEffect} from 'react';
import dice1 from '../images/dice1.svg'
import dice2 from '../images/dice2.svg'
import dice3 from '../images/dice3.svg'
import dice4 from '../images/dice4.svg'
import dice5 from '../images/dice5.svg'
import dice6 from '../images/dice6.svg'
import cup from '../images/cup.png'
import '../styles/oponent.css'

const Oponent = (props) => {
    const [hand, setHand] = useState([cup]);
    const [dice, setDice] = useState([dice1, dice2, dice3, dice4, dice5, dice6]);
    const allDice = [dice1, dice2, dice3, dice4, dice5, dice6];

    useEffect(() => {
        const diceBuilder = []

        for (let i=0; i<props.diceNum; i++)
            diceBuilder.push(allDice[Math.floor(Math.random() * 6)]);

        setDice(diceBuilder)
    }, [props.diceNum])

    const showDice = () => {
        setHand(dice)
    }

    const hideDice = () => {
        setHand([cup])
    }

    return (
        <div id="oponent">
            <h2>{props.name}</h2>
            {hand.map((die, key) => <img src={die} key={key} />)}
            {/* <button onClick={showDice}>Show</button>
            <button onClick={hideDice}>Hide</button> */}
        </div>
    );
}
export default Oponent;