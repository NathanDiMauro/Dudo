import React, {useContext, useEffect, useState} from "react";
import { SocketContext } from "../context/socketContext";
import column1 from "../images/column1.svg"
import column2 from "../images/column2.svg"
import column3 from "../images/column3.svg"
import "../styles/endGame.css"

const EndGame = (props) => {

    const { socket } = useContext(SocketContext);

    const [winners, setWinners] = useState([])
    const [endGame, setEndGame] = useState(false);

    useEffect(() => {
        socket.on('endOfGame', (dice) => {
            dice.dice.sort(function(p1, p2){return p2.dice.length - p1.dice.length})

            let winnersBuilder = []

            if (dice.dice[1]) {
                winnersBuilder.push(
                <div key={1}>
                    <h2 id="secondPlace">#2 {dice.dice[1].playerName}</h2>
                    <img id="col2" src={column2} />
                </div>)
            }

            if (dice.dice[0]) {
                winnersBuilder.push(
                <div key={0}>
                    <h2 id="firstPlace">#1 {dice.dice[0].playerName}</h2>
                    <img id="col1" src={column1} />
                </div>)
                
            }
            if (dice.dice[2]) {
                winnersBuilder.push(
                <div key={2}>
                    <h2 id="thirdPlace">#3 {dice.dice[2].playerName}</h2>
                    <img id="col3" src={column3} />
                </div>)
            }

            console.log(winnersBuilder)
            setWinners(winnersBuilder)
            props.setShow(true)
            setEndGame(true)
        })
    }, [socket])

    if(!endGame) return null

    return (
        <div id="endGame">
            <h1>Game Over</h1>
            <div id="winnerPodium">
                {winners}
            </div>
            <h1>Play Again?</h1>
        </div>
    )
}


export default EndGame;