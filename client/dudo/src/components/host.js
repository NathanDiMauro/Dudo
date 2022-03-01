import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext'; 
import '../styles/join.css'

const HostGame = (props) => {
    const socket = useContext(SocketContext);

    //when room or name changes add players to socket
    useEffect(() => {
        if (props.name && props.room){
            console.log('trying to create room', props.room)

            console.log('trying to join', props.name, "to room", props.room)
            const name = props.name;
            const room = props.room
            socket.emit('join', { name, room }, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(props.name, room, socket)
                }
            })
        }
    }, [props.room, props.name])

    const addRoom = () => {
        props.setName(document.getElementById("nameInput").value);
        props.setRoom(document.getElementById("roomInput").value)
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