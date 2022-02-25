import React, {useState, useEffect } from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import cup from '../dice/cup.png'
import '../styles/oponent.css'

const Oponent = (props) => {
    const [dice, setDice] = useState([dice1, dice2, dice3, dice4, dice5, dice6]);
    const [show, setShow] = useState([cup]);

    const showDice = () => {
        setShow(dice)
    }

    const hideDice = () => {
        setShow([cup])
    }

    return (
        <div id="oponent">
            <h2>{props.name}</h2>
            {show.map((die, key) => <img src={die} key={key} />)}
            <button onClick={showDice}>Show</button>
            <button onClick={hideDice}>Hide</button>
        </div>
    );
}
export default Oponent;