import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext'; 
import '../styles/join.css'

const HostGame = () => {
    const socket = useContext(SocketContext);

    const [name, setName] = useState(null);
    const [room, setRoom] = useState(null);

    //when room or name changes add players to socket
    useEffect(() => {
        if (name && room){
            console.log('trying to create room', room)

            console.log('trying to join', name, "to room", room)
            socket.emit('join', { name, room }, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(name, room, socket)
                }
            })
        }
    }, [room, name])

    const addRoom = () => {
        setName(document.getElementById("nameInput").value);
        setRoom(document.getElementById("roomInput").value)
    }
    
    return (
        <div id="join">
            <h2>Host Game</h2>
            <div id="jInput">
                <h4>Name:</h4>
                <input type="text" id="nameInput"></input>
                <h4>Room code:</h4>
                <input type="text" id="roomInput"></input> 
                <button onClick={addRoom}>Host</button>
                <br />
            </div>
        </div>
    );
}

export default HostGame;