import { useContext, useState, useEffect } from "react"
import { SocketContext } from "../context/socketContext"
import '../styles/playerFooter.css'

const delay = 5;

export const PlayerFooter = () => {
    const { room, name, socket, setName, setRoom } = useContext(SocketContext);

    const [startGameError, setStartGameError] = useState(false);

    useEffect(() => {
        let timer = setTimeout(() => setStartGameError(false), delay * 1000)

        return () => { clearTimeout(timer); }
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
        <div className="playerFooter">
            <div className="playerFooterInfoContainer">
                <div className="info">
                    <h3>{room}</h3>
                    <p>Room</p>
                </div>
                <div className="info">
                    <h3>{name}</h3>
                    <p>Name</p>
                </div>
            </div>
            <div className="playerFooterButtons">
                <div className="startRound">
                    {startGameError ? <p className="error">Round in progress</p> : <button onClick={startGame}>Start Round</button>}
                </div>
                <button id="leaveGame" onClick={leaveGame}>Leave Game</button>
            </div>
        </div>
    )
}