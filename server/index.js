const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { addPlayer, getPlayer, getPlayers, removePlayer, getRoom, createRoom } = require('./state');

const app = express();
const http = createServer();
const io = new Server(http, { options: { cors: { origin: ['http://localhost:3000'], methods: ['GET', 'POST'] } } })
const PORT = process.env.PORT || 5000


/**  
 * Adding a new player to the room with roomCode
 * This should only be called from the join or createRoom socket event
 * @param {Socket}      socket      The socket of the user to not send the notification to
 * @param {String}      name        The name of the player joining the room
 * @param {String}      roomCode    The room code of the room to add the player to
 * @param {Callback}    callback    The callback function from the socket.on function. This is used to alert the client of any errors  
 */
const _addPlayer = (socket, name, roomCode, callback) => {
    const { newPlayer, error } = addPlayer(socket.id, name, roomCode);

    // If there is an error, return it to the client
    if (error) return callback(error);

    // Adding the new player to the room
    socket.join(roomCode);

    // Notifying the entire room, except the sender, that a new player joined
    _sendNotificationWithoutSender(
        { title: 'Someone just joined', description: `${newPlayer.playerName} just entered the room` },
        roomCode,
        socket);

    // Sending an updated list of players to the room
    _sendPlayers(roomCode);

    callback();
}


/**
 * Will notify all players that a round is starting, and provide each payer with their new hand
 * @param {String} room     The room object to start the round for
 */
const _startRound = (room) => {
    // Updating client with list of players
    _sendPlayers(room.roomCode)
    // Starting a new round
    room.players.forEach((player) => {
        // Letting each player know what dice they have
        io.to(player.id).emit('diceForRound', { dice: player.dice });
    })
}


/**  
 * Sending a notification to everyone except the sender
 * This will usually only be called when someone leaves or joins a room
 * @param {{title: String, description: String}}    notification    The notification Object to to sent
 * @param {String}                                  roomCode        The room code of the room to sent the notification to
 * @param {Socket}                                  socket          The socket of the user to not send the notification to
 */
const _sendNotificationWithoutSender = (notification, roomCode, socket) => {
    socket.in(roomCode).emit('notification', notification)
}


/**  
 * Sending a notification to everyone in the room
 * This will usually be called to alter the client about game events
 * EX: round starting, round ending...
 * @param {{title: String, description: String}}    notification    The notification Object to to sent
 * @param {String}                                  roomCode        The room code of the room to sent the notification to
 * @param {Socket}                                  socket          The socket of the user to not send the notification to
 */
const _sendNotification = (notification, roomCode) => {
    io.in(roomCode).emit('notification', notification);
}


/**
 * Sending a list of players to everyone in the room
 * @param {String} roomCode     The room code of the room to send the list of players to
 */
const _sendPlayers = (roomCode) => {
    io.in(roomCode).emit('players', getPlayers(roomCode));
}

/**
 * Listening for new connections  
 * In this on event, we set all other events for this socket.
 * @param {Socket} socket   The socket of the client connecting
 */
io.on('connection', (socket) => {

    /**
     * Listening for a client requesting to create a new room
     * @param {String}  name        The name of the player creating the room
     * @param {String}  roomCode    The roomCode to assign to the new room
     */
    socket.on('createRoom', ({ name, roomCode }, callback) => {
        const { error } = createRoom(roomCode);
        if (error) return callback(error);

        _addPlayer(socket, name, roomCode, callback);
    })

    /**
     * Listening for a client requesting to join a room
     * @param {String}  name        The name of the player trying to join the room
     * @param {String}  roomCode    The roomCode of the room that the player is trying to join
     */
    socket.on('join', ({ name, roomCode }, callback) => {
        _addPlayer(socket, name, roomCode, callback);
    })

    /**
     * Listening for clients requesting to start a new game
     * @param {Boolean} newGame     If true, then the client is requesting the start the game, if false, the client is requesting to start a new round
     */
    socket.on('startGame', ({ newGame }, callback) => {
        const room = getRoom(socket.id);
        if (room) {
            // Letting players know the game is starting
            let notif = { title: 'New Round is Starting', description: 'A new round is starting' }

            if (newGame) {
                if (room.betsInRound != null) {
                    callback({ error: 'Game has already been started' });
                } else {
                    notif = { title: 'Game is starting', description: 'The game is starting' };
                }
            }
            _sendNotification(notif, room.roomCode);
            room.newRound();
            _startRound(room);

        } else {
            callback({ error: 'Room does not exists with this player' });
        }
        callback();
    })

    /**
     * Listening for when a client is requesting to make a new bid
     * @param {{playerId: Number, action: String, amount: Number, dice: Number}}    new_bid     The new bid
     */
    socket.on('bid', new_bid => {
        const room = getRoom(socket.id);
        if (room) {
            const player = room.getPlayer(socket.id);
            if (player) {
                const { bid, error, endOfRound, startOfRound, endOfGame } = room.bid(new_bid);

                console.log(bid, error, endOfRound, startOfRound);
                if (startOfRound) {
                    _sendNotification({ title: 'New Round is starting', description: 'The round is starting' }, roomCode);
                    _startRound(room);
                }
                if (bid) {
                    io.in(room.roomCode).emit('newBid', { bid });
                } else if (endOfRound) {
                    io.in(room.roomCode).emit('endOfRound', { endOfRound });
                } else if (endOfGame) {
                    io.in(room.roomCode).emit('endOfGame', { endOfGame });
                } else if (error) {
                    callback(error);
                } else {
                    callback({ error: 'An unexpected error occurred ' });
                }
            } else {
                callback({ error: 'Invalid Player id' });
            }
        }
        callback();
    })


    // Not using this currently
    // socket.on('sendMessage', message => {
    //     const room = getRoom(socket.id);
    //     if (room) {
    //         const player = room.getPlayer(socket.id)
    //         console.log(player, room.roomCode)
    //         // Placeholder for now
    //         io.in(room.roomCode).emit('message', { player: player.playerName, text: message });
    //     } else {
    //         socket.emit('error', { error: 'Invalid Player id' });
    //     }
    // })

    /**
     * When a client is disconnecting, we remove them from a room and notify all other clients in the room
     * @param {String}  message     I do not know what were doing with this currently
     */
    socket.on('disconnect', () => {
        console.log('player is disconnecting');
        socket.disconnect();
        const { player, roomCode } = removePlayer(socket.id);
        if (player) {
            _sendNotification({ title: 'Someone just left', description: `${player.playerName} just left the room` }, roomCode)
            _sendPlayers()
        }
    })
})

app.get('/', (req, res) => {
    req.setEncoding('Server is running');
})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})