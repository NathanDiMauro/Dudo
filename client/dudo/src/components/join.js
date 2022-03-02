import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext';
import '../styles/join.css'

const JoinGame = (props) => {
    const [join, setJoin] = useState(false);

    //when room or name changes add players to socket
    useEffect(() => {
        if (props.name && props.room && join == true){
            console.log('trying to join', props.name, "to room", props.room);
            console.log("room:", props.room)
            props.socket.emit('join', { name: props.name, roomCode: props.room}, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(props.name, props.room, props.socket)
                }
            })
            setJoin(false);
        }
    }, [props.room, props.name])

    const addPlayer = () => {
        setJoin(true);
        props.setName(document.getElementById("joinNameInput").value);
        props.setRoom(parseInt(document.getElementById("joinRoomInput").value));
        props.setShow(false);
    }

    if (props.show == false){
        return false;
    }
    
    return (
        <div id="join">
            <h2>Join Game</h2>
            <div id="jInput">
                <h4>Name:</h4>
                <input type="text" id="joinNameInput"></input>
                <h4>Room code:</h4>
                <input type="text" id="joinRoomInput"></input> 
                <button onClick={addPlayer}>Join</button>
                <br />
            </div>
        </div>
    );
}

export default JoinGame;