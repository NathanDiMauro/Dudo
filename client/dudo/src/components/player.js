import React, {useState, useEffect} from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/player.css'

const Player = (props) => {

    const [hand, setHand] = useState([dice1, dice2, dice3, dice4, dice5, dice6]);
    const [chosenDice, setChosenDice] = useState(null);

    const allDice = [dice1, dice2, dice3, dice4, dice5, dice6];
    
    const [playerID, setPlayerID] = useState(props.socket.playerID);
    const [action, setAction] = useState(null);
    const [amount, setAmmount] = useState(null);
    const [dice, setDice] = useState(null);

    useEffect(() => {
        const diceBuilder = []

        for (let i=0; i<props.diceNum; i++)
            diceBuilder.push(allDice[Math.floor(Math.random() * 6)]);

        setHand(diceBuilder)
    }, [props.diceNum])

    useEffect(() => {
        const bid_obj = { playerId: playerID, action: action, amount: amount, dice: dice }
        console.log(bid_obj);
        props.socket.emit('bid', {new_bid: bid_obj}, error => {
            alert(error);
        });
    },[action])

    function hideDiceSelected() {
        // Hide the diceSelected image
        var diceSelected = document.getElementById("diceSelected");
        diceSelected.style.display = "none";
    }

    function showDiceDropdown() {
        // Swap from a displayed selectedDice to a displayed diceDropdown
        var diceDropdown = document.getElementById("diceDropdown");
        diceDropdown.style.display = "inline-block";
        hideDiceSelected();
    }

    function selectDice(dice, diceNum) {
        var diceSelected = document.getElementById("diceSelected");
        diceSelected.style.display = "inline-block";
        setChosenDice(dice);
        setDice(diceNum);

        // Hide dropdown
        var diceDropdown = document.getElementById("diceDropdown");
        diceDropdown.style.display = "none";
    }

    function raise() {
        setAmmount(parseInt(document.getElementById("ammountInput").value));  //Get number of dice
        setAction('raise')
        
    }

    function call() {
        setAmmount(parseInt(document.getElementById("ammountInput").value));  //Get number of dice
        setAction('call')
    }

    function spot() {
        setAmmount(parseInt(document.getElementById("ammountInput").value));  //Get number of dice
        setAction('spot')
    }

    function bidAces() {
        setAmmount(parseInt(document.getElementById("ammountInput").value));  //Get number of dice
        setAction('aces')
    }

    if (props.show == true){
        return false;
    }

    if (props.show == true){
        return false;
    }

    return (
        <div id="player">
            <h2>{props.name}:</h2>
            {hand.map((die, key) => <img src={die} key={key} />)}

            <div id="playerAction">
                <input id='ammountInput'/>
                <div id='diceDropdown'>
                    <button id='dropdownSelect'>Select Dice</button>
                    <div id='dropdownContent'>
                        <a onClick={() => selectDice(dice1, 1)}><img src={dice1} alt='Dice one'/></a>
                        <a onClick={() => selectDice(dice2, 2)}><img src={dice2} alt='Dice two'/></a>
                        <a onClick={() => selectDice(dice3, 3)}><img src={dice3} alt='Dice three'/></a>
                        <a onClick={() => selectDice(dice4, 4)}><img src={dice4} alt='Dice four'/></a>
                        <a onClick={() => selectDice(dice5, 5)}><img src={dice5} alt='Dice five'/></a>
                        <a onClick={() => selectDice(dice6, 6)}><img src={dice6} alt='Dice six'/></a>
                    </div>
                </div>
                <img id='diceSelected' onClick={showDiceDropdown} alt='Dice selected' src={chosenDice}/>
                <button id='betButton' onClick={raise}>Raise</button>
                <button id='callButton' onClick={call}>Call</button>
                <button id='spotButton' onClick={spot}>Spot</button>
                <button id='bidAcesButton' onClick={bidAces}>Bid Aces</button>
            </div>
        </div>
    );
}
export default Player;