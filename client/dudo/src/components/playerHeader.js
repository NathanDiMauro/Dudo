import { useContext, useState, useEffect } from "react"
import { SocketContext } from "../context/socketContext"
import '../styles/playerHeader.css'

const delay = 5;

export const PlayerHeader = () => {
    const { room, name, socket, setName, setRoom } = useContext(SocketContext);

    const [startGameError, setStartGameError] = useState(false);

    useEffect(() => {
        let timer = setTimeout(() => setStartGameError(false), delay * 1000)

        return () => {clearTimeout(timer);}
    }, [startGameError])

    const leaveGame = () => {
        setName(undefined);
        setRoom(undefined);
        socket.disconnect();
    }

    const startGame = () => {
        socket.emit('startGame', error => {
            if (error) setStartGameError(true)
        });
    }

    return (
        <div className="playerHeader">
            <div className="startRound">
                {startGameError ? <p className="error">Round in progress</p> : <button onClick={startGame}>Start Round</button>}
            </div>
            <h4>Room Code: {room}</h4>
            <h4>Your Name: {name}</h4>
            <button id="leaveGame" onClick={leaveGame}>Leave Game</button>
        </div>
    )
}