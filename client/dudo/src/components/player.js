import React, {useState, useEffect} from 'react';
import dice1 from '../dice/dice1.svg'
import dice2 from '../dice/dice2.svg'
import dice3 from '../dice/dice3.svg'
import dice4 from '../dice/dice4.svg'
import dice5 from '../dice/dice5.svg'
import dice6 from '../dice/dice6.svg'
import '../styles/player.css'

const Player = (props) => {
    const [dice, setDice] = useState([dice1, dice2, dice3, dice4, dice5, dice6]);
    const allDice = [dice1, dice2, dice3, dice4, dice5, dice6];

    useEffect(() => {
        const diceBuilder = []

        for (let i=0; i<props.diceNum; i++)
            diceBuilder.push(allDice[Math.floor(Math.random() * 6)]);

        setDice(diceBuilder)
      }, [props.diceNum])

    if (props.show == true){
        return false;
    }

    function hideDiceSelected() {
        // Hide the diceSelected image
        var diceSelected = document.getElementById("diceSelected");
        diceSelected.src = "";
        diceSelected.style.display = "none";
    }

    function showDiceDropdown() {
        // Swap from a displayed selectedDice to a displayed diceDropdown
        var diceDropdown = document.getElementById("diceDropdown");
        diceDropdown.style.display = "inline-block";
        hideDiceSelected();
    }

    function selectDice(dice, diceNum) {
        // Set the selectedDice img tag to the dice image selected by the player and display it
        var diceSelected = document.getElementById("diceSelected");
        diceSelected.src = dice;
        diceSelected.alt = "Dice Selected is number " + diceNum;
        diceSelected.style.display = "inline-block";
        
        // Hide dropdown
        var diceDropdown = document.getElementById("diceDropdown");
        diceDropdown.style.display = "none";
    }

    function bet() {
        // Read and process the given bet from the player
        var betNum = document.getElementById("betNumInput").value;  //Get number of dice
        var betDice = document.getElementById("diceSelected").alt.charAt(24);    //Get dice selected from alt of img tag
        var bid_obj = {playerId: props.socket.id, action: 'raise', amount: betNum, dice: betDice};
        console.log(bid_obj);
        props.socket.emit('bid', {newBid: bid_obj}, error => {});
        
    }

    function call() {
        // Call out the previous bet as incorrect

    }

    function spot() {
        // Call out the previous bet as correct

    }

    function bidAces() {
        // Player wants to bid aces

    }

    return (
        <div id="player">
            <h2>{props.name}:</h2>
            {dice.map((die, key) => <img src={die} key={key} />)}
            <span id='betText'>Bet:</span>
            <input id='betNumInput'/>
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
            <img id='diceSelected' onClick={() => showDiceDropdown()} alt='Dice selected'/>
            <button id='betButton' onClick={() => bet()}>Bet</button><br/>
            <div class='actionText'>OR<button id='callButton' onClick={() => call()} title='Call if you think the previous bet is false'>Call</button></div>
            <div class='actionText'>OR<button id='spotButton' onClick={() => spot()} title='Spot if you think the previous bet is true'>Spot</button></div>
            <div class='actionText'>OR<button id='bidAcesButton' onClick={() => bidAces()} title=''>Bid Aces</button></div>
        </div>
    );
}
export default Player;