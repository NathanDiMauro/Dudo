import React, { useState, useEffect, useContext } from 'react';
import dice1 from '../images/dice1.svg'
import dice2 from '../images/dice2.svg'
import dice3 from '../images/dice3.svg'
import dice4 from '../images/dice4.svg'
import dice5 from '../images/dice5.svg'
import dice6 from '../images/dice6.svg'
import { isNumberKey } from '../utils';
import '../styles/playerActions.css'
import ReactTooltip from 'react-tooltip';
import { SocketContext } from '../context/socketContext';


const PlayerActions = () => {
    const { socket, name, playersTurn } = useContext(SocketContext);

    const [chosenDice, setChosenDice] = useState(dice1);
    const [action, setAction] = useState(null);
    const [amount, setAmount] = useState(null);
    const [dice, setDice] = useState(null);
    const [bidError, setBidError] = useState(null);
    const [canBid, setCanBid] = useState(false);

    useEffect(() => {
        setCanBid(() => playersTurn === name);
    }, [playersTurn, name])


    function bid() {
        let bid = undefined;
        switch (action) {
            case 'raise':
            case 'aces':
                if (!amount || !dice) {
                    setBidError('Must select amount and dice when raising');
                } else {
                    if (dice === 1) {
                        bid = { playerId: socket.id, action: 'aces', amount: parseInt(amount), dice: parseInt(dice) };
                    } else {
                        bid = { playerId: socket.id, action: action, amount: parseInt(amount), dice: parseInt(dice) };
                    }
                }
                break;
            case 'spot':
            case 'call':
                bid = { playerId: socket.id, action: action, amount: null, dice: null };
                break;
            default:
                setBidError('Must select an action');
        }
        console.log(bid);
        if (bid) {
            socket.emit('bid', { newBid: bid }, error => {
                if (error) {
                    setBidError(error);
                } else {
                    setBidError(undefined);
                    setCanBid(false);
                    setAction(null);
                    setAmount(null);
                    setDice(null);
                }
            })
        }
    }


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
            {canBid &&
                <div>
                    <h3>Its your turn to bid!</h3>
                    {bidError &&
                        <div id="bidErrors">
                            <h4>{bidError}</h4>
                        </div>}
                    <input id='amountInput' type='number' min='1' max='99' autoComplete='off' onKeyPress={isNumberKey} onChange={(e) => setAmount(e.target.value)} />

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
                        <input type='radio' id='raise' name='action' value='raise' onClick={() => setAction('raise')} />
                        <label htmlFor='raise'>Raise</label>
                        <input type='radio' id='call' name='action' value='call' onClick={() => setAction('call')} />
                        <label htmlFor='call'>Call</label>
                        <input type='radio' id='spot' name='action' value='spot' onClick={() => setAction('spot')} />
                        <label htmlFor='spot'>Spot</label>
                    </div>
                    <button id='sendBidBtn' onClick={() => bid()}>Send Bid</button>
                </div>
            }
        </div>
    );
}
export default PlayerActions;
