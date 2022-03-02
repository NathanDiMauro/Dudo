import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext'; 
import '../styles/join.css'

const HostGame = (props) => {
    const socket = useContext(SocketContext);

    useEffect(() => {
        // Adding an event listener to the socket to listen for new players
        // It will continually listen to the players event being emitted from the backend
        // And whenever a new player is added or remove, it will update the players array
        socket.on('players', players => {
            console.log(players)
            props.setPlayers(players);
        })
    }, [socket])

    //when room or name changes add players to socket
    useEffect(() => {
        if (props.name && props.room){
            console.log('trying to create room', props.room)

            console.log('trying to join', props.name, "to room", props.room)
            const name = props.name;
            const room = props.room
            socket.emit('createRoom', { name, room }, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(props.name, room, socket)
                }
            })
        }
    }, [props.name])

    const addRoom = () => {
        props.setName(document.getElementById("nameInput").value);
        let rnd = Math.floor(Math.random() * 9999);
        props.setRoom(rnd)
        props.setShow(false)
    }

    if (props.show == false){
        return false;
    }
    
    return (
        <div id="join">
            <h2>Host Game</h2>
            <div id="jInput">
                <h4>Name:</h4>
                <input type="text" id="nameInput"></input>
                <button onClick={addRoom}>Host</button>
                <br />
            </div>
        </div>
    );
}

export default HostGame;