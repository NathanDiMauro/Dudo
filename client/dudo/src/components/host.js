import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext'; 
import '../styles/join.css'

const HostGame = (props) => {
    const socket = useContext(SocketContext);

    const [host, setHost] = useState(false);

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
        if (props.name && props.room && host == true){
            console.log('trying to create room', props.room)

            console.log('trying to join', props.name, "to room", props.room)

            socket.emit('createRoom', {name: props.name, roomCode: props.room}, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(props.name, props.room, socket)
                }
            })
            setHost(false);
        }
    }, [props.name])

    const addRoom = () => {
        setHost(true);
        props.setName(document.getElementById("nameInput").value);
        props.setRoom(Math.floor(Math.random() * 9999))
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