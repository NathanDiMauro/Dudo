import { useContext } from "react";
import { SocketContext } from "../context/socketContext";
import Player from "./player";
import Opponents from "./opponents/opponents";
import Notification from "./notification";

const Game = () => {
    const { room, socket, setName, setRoom } = useContext(SocketContext);

    const leaveGame = () => {
        setName(undefined);
        setRoom(undefined);
        socket.emit('_disconnect')
    }

    const startGame = () => {
        // TODO: Have to change to newGame variable
        // Maybe change it on the backend
        socket.emit('startGame', { newGame: false });
    }

    return (
        <div>
            <h1>Room Code: {room}</h1>
            <Player />
            <Opponents />

            <Notification />
            <button onClick={startGame}>Start Round</button>
            <button onClick={leaveGame}>Leave Game</button>
        </div>
    )
}

export default Game;