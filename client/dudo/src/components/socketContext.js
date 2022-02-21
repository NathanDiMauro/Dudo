import React, { createContext } from 'react';

// Initializing an instance of socket from socket.io-client
import io from 'socket.io-client';

// Using react Context API
const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const ENDPOINT = '127.0.0.1:5000';
    // Calling io, passing ENDPOINT and some other configs -- transports is to avoid CORS issues
    const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })

    // Exposing te entire app so the socket can be accessed from anywhere
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }