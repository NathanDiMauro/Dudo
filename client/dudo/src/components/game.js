import { useContext } from "react";
import { SocketContext } from "../context/socketContext";
import Player from "./player";
import Opponents from "./opponents/opponents";
import Notification from "./notification";
import { PlayerHeader } from "./playerHeader";
import '../styles/game.css';

const Game = () => {
    const { socket, setName, setRoom } = useContext(SocketContext);

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
        <div>
            <PlayerHeader />
            <div className="gameContainer">
                <div id="gameContainerLeft">
                    <Player />
                    <Opponents />
                    <button onClick={startGame}>Start Round</button>
                    <button onClick={leaveGame}>Leave Game</button>
                </div>
                <div id="gameContainerRight">
                    <Notification />
                </div>
            </div>
        </div >
    )
}

export default Game;