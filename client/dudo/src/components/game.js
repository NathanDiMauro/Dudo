import Player from "./player";
import Opponents from "./opponents/opponents";
import Notification from "./notification";
import { PlayerFooter } from "./playerFooter";
import '../styles/game.css';

const Game = () => (
        <div className="gameContainer">
            <div id="gameContainerLeft">
                <Player />
                <Opponents />
                <PlayerFooter />
            </div>
            <div id="gameContainerRight">
                <Notification />
            </div>
        </div>
)

export default Game;