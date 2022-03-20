import React, { useState, useContext } from 'react';
import { SocketContext } from '../../context/socketContext';
import { isNumberKey } from '../../utils';

const JoinGame = () => {
    const { socket, setRoom, setName } = useContext(SocketContext);

    const [inputName, setInputName] = useState(undefined);
    const [inputRoom, setInputRoom] = useState(undefined);

    const joinGame = () => {
        if (inputName && inputRoom) {
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
        <div className="join">
            <h2>Join Game</h2>
            <div className="joinInput">
                <h4><label htmlFor='joinNameInput'>Name:</label></h4>
                <input type="text" id="joinNameInput" autoComplete="off" onChange={(e) => setInputName(e.target.value)} />
                <h4><label htmlFor='joinRoomInput'>Room code:</label></h4>
                <input type="text" id="joinRoomInput" autoComplete="off" onChange={(e) => setInputRoom(e.target.value)} onKeyPress={isNumberKey} />
                <button onClick={joinGame}>Join</button>
            </div>
        </div>
    );
}

export default JoinGame;