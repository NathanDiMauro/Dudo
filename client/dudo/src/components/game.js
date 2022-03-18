import Player from "./player";
import Opponents from "./opponents/opponents";
import Notification from "./notification";
import { PlayerHeader } from "./playerHeader";
import '../styles/game.css';

const Game = () => {
    return (
        <div>
            <PlayerHeader />
            <div className="gameContainer">
                <div id="gameContainerLeft">
                    <Player />
                    <Opponents />
                </div>
                <div id="gameContainerRight">
                    <Notification />
                </div>
            </div>
        </div >
    )
}

export default Game;