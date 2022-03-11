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
            console.log(players)
        })

        socket.on('diceForRound', dice => {
            console.log(dice);
        })

        socket.on('newBid', bid => {
            console.log(bid);
        })

        socket.on('bidError', error => {
            console.log(error);
        })

        // These are just examples, you probably do not want all the socket stuff in the same useEffect

        socket.on('message', message => {
            console.log(message)
        })

        socket.on('notification', notification => {
            console.log(notification)
        })
    }, [socket])

    const handleClick = () => {
        console.log('trying to join')
        // Login to the socket
        socket.emit('createRoom', { name, roomCode }, error => {
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

    const startGame = () => {
        socket.emit('startGame')
    }

    const bid = () => {
        socket.emit('bid', { playerId: socket.id, action: 'raise', amount: 4, dice: 4 })
    }

    console.log(players)


    return (
        <div>
            <button onClick={handleClick}>Join</button>
            <button onClick={sendMessage}>sendMessage</button>
            <button onClick={startGame}>Start Game</button>
            <button onClick={bid}>Bid</button>
        </div>
    );
}

export default SocketExample;