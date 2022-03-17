import React, { useState, useContext } from 'react';
import { isNumberKey } from '../utils';
import '../styles/playerActions.css'
import ReactTooltip from 'react-tooltip';
import { SocketContext } from '../context/socketContext';
import { ALL_DICE } from '../pages/App';


const PlayerActions = () => {
    const { socket, canBid, setCanBid } = useContext(SocketContext);

    const [action, setAction] = useState(null);
    const [amount, setAmount] = useState(null);
    const [dice, setDice] = useState(null);
    const [bidError, setBidError] = useState("It's your turn to bid!");

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
        if (bid) {
            socket.emit('bid', { newBid: bid }, error => {
                if (error) {
                    setBidError(error);
                } else {
                    setBidError("It's your turn to bid!");
                    setCanBid(false);
                    setAction(null);
                    setAmount(null);
                    setDice(null);
                }
            })
        }
    }

    return (
        <div>
            {canBid &&
                <div className="playerAction">
                    {bidError &&
                        <div id="bidErrors">
                            <h4>{bidError}</h4>
                        </div>
                    }
                    <div className="bid">
                        <div id='selectDice'>
                            <div id="diceAmount">
                                <small><label htmlFor='amountInput'>Amount</label></small>
                                <input
                                    id='amountInput'
                                    type='number'
                                    min='1'
                                    max='99'
                                    autoComplete='off'
                                    onKeyPress={isNumberKey}
                                    onChange={(e) => setAmount(e.target.value)} />

                            </div>
                            {ALL_DICE.map((die, key) =>
                                <img
                                    key={key}
                                    className='die'
                                    id={key + 1 === dice ? 'selectedDice' : undefined}
                                    src={die}
                                    alt={`Dice #${key + 1}`}
                                    onClick={() => setDice(key + 1)}
                                />)}
                        </div>
                        <ReactTooltip place="right" type="dark" effect="solid" />
                        <br />
                        <div id="bidButtons">
                            <input type='radio' id='raise' name='action' value='raise' onClick={() => setAction('raise')} />
                            <label htmlFor='raise'>Raise</label>
                            <input type='radio' id='call' name='action' value='call' onClick={() => setAction('call')} />
                            <label htmlFor='call'>Call</label>
                            <input type='radio' id='spot' name='action' value='spot' onClick={() => setAction('spot')} />
                            <label htmlFor='spot'>Spot</label>
                            <button id='sendBidBtn' onClick={() => bid()}>Send Bid</button>

                        </div>
                    </div>
                </div>
            }
        </div >
    );
}
export default PlayerActions;
