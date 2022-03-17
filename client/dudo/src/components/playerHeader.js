import { useContext } from "react"
import { SocketContext } from "../context/socketContext"
import '../styles/playerHeader.css'

export const PlayerHeader = () => {
    const { room, name } = useContext(SocketContext);
    return (
        <div className="playerHeader">
            <h4>Room Code: {room}</h4>
            <h4>Your Name: {name}</h4>
        </div>
    )
}