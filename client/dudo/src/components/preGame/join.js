import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/socketContext';
import '../../styles/join.css'

const JoinGame = () => {
    const { socket, setRoom, setName } = useContext(SocketContext);

    const [inputName, setInputName] = useState(undefined);
    const [inputRoom, setInputRoom] = useState(undefined);

    const joinGame = () => {
        if (inputName && inputRoom) {
            console.log('trying to join', inputName, "to room", inputRoom);
            console.log("room:", inputRoom)
            socket.emit('join', { name: inputName, roomCode: parseInt(inputRoom) }, error => {
                if (error) {
                    console.log(error);
                    alert(error);
                    // props.setName(null);
                    // props.setRoom(null);
                    // props.setShow(true);
                } else {
                    setName(inputName);
                    setRoom(inputRoom)
                }
            })
        }
    }

    return (
        <div id="join">
            <h2>Join Game</h2>
            <div id="jInput">
                <h4>Name:</h4>
                <input type="text" id="joinNameInput" onChange={(e) => setInputName(e.target.value)} />
                <h4>Room code:</h4>
                <input type="text" id="joinRoomInput" onChange={(e) => setInputRoom(e.target.value)} />
                <button onClick={joinGame}>Join</button>
                <br />
            </div>
        </div>
    );
}

export default JoinGame;