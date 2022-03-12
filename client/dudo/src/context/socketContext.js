import React, { createContext, useEffect, useState } from 'react';

// Initializing an instance of socket from socket.io-client
import io from 'socket.io-client';

const ENDPOINT = '127.0.0.1:5000';
// Calling io, passing ENDPOINT and some other configs -- transports is to avoid CORS issues
const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })

// Using react Context API
const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [name, setName] = useState(undefined);
    const [room, setRoom] = useState(undefined);
    const [players, setPlayers] = useState([]);
    const [notificationLog, setNotificationLog] = useState([]);
    const [canBid, setCanBid] = useState(false);

    socket.on('players', (players) => {
        setPlayers(players.filter(p => p.playerName !== name));
    })

    // The reason we need this useEffect is because for our socket.on('players') event, name could be undefined when the first players event sent out
    // So we just need to filter the players anytime name changes (which is only on join room)
    useEffect(() => {
        setPlayers(prev => prev.filter(player => player.playerName !== name));
    }, [name])


    useEffect(() => {
        socket.on('notification', notification => {
            setNotificationLog(prev => [...prev, notification]);
        })

        socket.on('turn', () => {
            setCanBid(true);
        })
    }, [])


    // Exposing to the entire app so the socket can be accessed from anywhere
    return (
        <SocketContext.Provider value={{
            socket,
            name, setName,
            room, setRoom,
            players,
            notificationLog,
            canBid, setCanBid
        }} >
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }