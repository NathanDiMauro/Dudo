import { useContext } from "react"
import { SocketContext } from "../context/socketContext"
import '../styles/playerHeader.css'

export const PlayerHeader = () => {
    const { room, name, socket, setName, setRoom } = useContext(SocketContext);

    const leaveGame = () => {
        setName(undefined);
        setRoom(undefined);
        socket.emit('_disconnect');
    }

    const startGame = () => {
        // TODO: Have to change to newGame variable
        // Maybe change it on the backend
        socket.emit('startGame', { newGame: false });
    }

    return (
        <div className="playerHeader">
            <button onClick={startGame}>Start Round</button>
            <h4>Room Code: {room}</h4>
            <h4>Your Name: {name}</h4>
            <button id="leaveGame" onClick={leaveGame}>Leave Game</button>
        </div>
    )
}