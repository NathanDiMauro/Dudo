import React, { useState, useEffect } from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/playerActions.css'
import ReactTooltip from 'react-tooltip';


const PlayerActions = (props) => {

    const [chosenDice, setChosenDice] = useState(dice1);

    const [action, setAction] = useState(null);
    const [amount, setAmount] = useState(null);
    const [dice, setDice] = useState(null);

    useEffect(() => {
        props.socket.on('bidError', error => {
            console.log(error);
        })
    }, [props.socket])

    useEffect(() => {
        if (action) {
            if (action === 'raise') {
                if (dice === 1) {
                    setAction('aces')
                }
                setAmount(parseInt(document.getElementById("amountInput").value));  //Get number of dice 
            }
            else {
                console.log('call or spot')
                setDice(1)
                setAmount(1)
            }
        }

    }, [action])

    useEffect(() => {
        if (amount) {
            const bid_obj = { playerId: props.id, action: action, amount: amount, dice: dice }
            console.log("Placing bid:", bid_obj);

            props.socket.emit('bid', { new_bid: bid_obj });
            setAction(null);
            setAmount(null);
            setDice(null);
        }
    }, [amount])


    function showDiceDropdown() {
        // Swap from a displayed selectedDice to a displayed diceDropdown
        document.getElementById("diceDropdown").style.display = "inline-block";
        document.getElementById("dropdownSelect").style.display = "none";
        document.getElementById("diceSelected").style.display = "none";
    }

    function selectDice(dice, diceNum) {
        document.getElementById("diceSelected").style.display = "inline-block";
        setChosenDice(dice);
        setDice(diceNum);

        // Hide dropdown
        document.getElementById("diceDropdown").style.display = "none";
    }

    function hideDiceDropDown(dice, diceNum) {
        document.getElementById("diceSelected").style.display = "inline-block";

        // Hide dropdown
        document.getElementById("diceDropdown").style.display = "none";
    }



    return (
        <div id="playerAction">
            <input id='amountInput' />

            <button id='dropdownSelect' onClick={showDiceDropdown}>Select Dice</button>
            <div id='diceDropdown' onMouseLeave={hideDiceDropDown}>
                <img src={dice1} alt='Dice one' onClick={() => selectDice(dice1, 1)} />
                <img src={dice2} alt='Dice two' onClick={() => selectDice(dice2, 2)} />
                <img src={dice3} alt='Dice three' onClick={() => selectDice(dice3, 3)} />
                <img src={dice4} alt='Dice four' onClick={() => selectDice(dice4, 4)} />
                <img src={dice5} alt='Dice five' onClick={() => selectDice(dice5, 5)} />
                <img src={dice6} alt='Dice six' onClick={() => selectDice(dice6, 6)} />
            </div>
            <ReactTooltip place="right" type="dark" effect="solid" />
            <img id='diceSelected' onMouseOver={showDiceDropdown} alt='Dice selected' src={chosenDice} data-tip="Change Dice" />
            <br />
            <div id="bidButtons">
                <button id='betButton' onClick={() => setAction('raise')}>Raise</button>
                <button id='callButton' onClick={() => setAction('call')}>Call</button>
                <button id='spotButton' onClick={() => setAction('spot')}>Spot</button>
            </div>
        </div>
    );
}
export default PlayerActions;
