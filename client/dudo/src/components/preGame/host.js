import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/socketContext';
import '../../styles/join.css'

const HostGame = () => {
    const [inputName, setInputName] = useState(undefined);

    const { socket, setName, setRoom } = useContext(SocketContext);

    const hostGame = () => {
        const roomCode = Math.floor(Math.random() * 9999);
        if (inputName && roomCode) {
            console.log('trying to create room', roomCode)

            console.log('trying to join', inputName, "to room", roomCode)

            socket.emit('createRoom', { name: inputName, roomCode: roomCode }, error => {
                if (error) {
                    console.log(error);
                    alert(error);
                    // props.setName(null);
                    // props.setRoom(null);
                    // props.setShow(true);
                } else {
                    setName(inputName);
                    setRoom(roomCode);
                }
            })
        }
    }

    return (
        <div id="join">
            <h2>Host Game</h2>
            <div id="jInput">
                <h4><label for='nameInput'>Name:</label></h4>
                <input type="text" id="nameInput" autoComplete="off" onChange={(e) => setInputName(e.target.value)} />
                <button onClick={hostGame}>Host</button>
                <br />
            </div>
        </div>
    );
}

export default HostGame;