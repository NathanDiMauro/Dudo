import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from './socketContext';


const SocketExample = () => {
    const socket = useContext(SocketContext);

    const [name, setName] = useState('Player');
    const [players, setPlayers] = useState([]);
    const [roomCode, setRoomCode] = useState('Room');
    const [messages, setMessages] = useState([])
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        // Adding an event listener to the socket to listen for new players
        // It will continually listen to the players event being emitted from the backend
        // And whenever a new player is added or remove, it will update the players array
        socket.on('players', players => {
            setPlayers(players);
        })

        // These are just examples, you probably do not want all the socket stuff in the same useEffect

        socket.on('message', msg => {
            setMessages(messages => [...messages, msg])
        })

        socket.on('notification', notification => {
            console.log(notification)
            setNotifications(notifications => [...notifications, notification]);
        })
    }, [socket])

    const handleClick = () => {
        console.log('trying to join')
        // Login to the socket
        socket.emit('join', { name, roomCode }, error => {
            if (error) {
                console.log(error);
            } else {
                console.log(name, roomCode, socket)
            }
        })
    }

    const sendMessage = () => {
        socket.emit('sendMessage', 'Message');
    }

    console.log(players)


    return (
        <div>
            <button onClick={handleClick}>Join</button>
            <button onClick={sendMessage}>sendMessage</button>
            <div>
                {players.map((player, key) => <p key={key}>{player.name} has {player.dice} dice left</p>)}
            </div>
            <div>
                {messages.map((message, key) => <p key={key}>{message.player}: {message.text}</p>)}
            </div>
        </div>
    );
}

export default SocketExample;