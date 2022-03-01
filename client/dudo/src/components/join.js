import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext';
import '../styles/join.css'

const JoinGame = (props) => {
    const socket = useContext(SocketContext);

    const [title, setTitle] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Adding an event listener to the socket to listen for new players
        // It will continually listen to the players event being emitted from the backend
        // And whenever a new player is added or remove, it will update the players array
        socket.on('players', players => {
            setPlayers(players);
        })
    }, [socket])

    //when room or name changes add players to socket
    useEffect(() => {
        if (props.name && props.room){
            console.log('trying to join', props.name, "to room", props.room);
            const name = props.name;
            const room = props.room;
            socket.emit('join', { name, room }, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(name, room, socket)
                }
            })
            setTitle(<h4>Room: {props.room}</h4>)
        }
    }, [props.room, props.name])

    const addPlayer = () => {
        props.setName(document.getElementById("joinNameInput").value);
        props.setRoom(document.getElementById("joinRoomInput").value)
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
            <div id="pLog">
                {title}
                {players.map((player, key) => <p key={key}>{player.name} has {player.dice} dice left</p>)}
            </div>
        </div>
    );
}

export default JoinGame;