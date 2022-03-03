const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const http = createServer();
const io = new Server(http, { options: { cors: { origin: ['http://localhost:3000'], methods: ['GET', 'POST'] } } })


const PORT = process.env.PORT || 5000
const { addPlayer, getPlayer, getPlayers, removePlayer, getRoom, createRoom } = require('./state');

const _addPlayer = (socket, name, roomCode, callback) => {
    const { newPlayer, error } = addPlayer(socket.id, name, roomCode);

    console.log('Player is joining', newPlayer, error, roomCode);

    // If there is an error, return it
    if (error) return callback(error);
    // Adding the new player to the room
    socket.join(roomCode);

    // Notifying the entire room that a new player joined -- socket.io does not notify the sender
    socket.in(roomCode).emit('notification', { title: 'Someone just joined', description: `${newPlayer.playerName} just entered the room` });
    // Sending an updated list of players to the room -- io.in notifies everyone along with the sender
    io.in(roomCode).emit('players', getPlayers(roomCode));
    callback();
}


io.on('connection', (socket) => {
    console.log('Player connected')

    socket.on('createRoom', ({ name, roomCode }, callback) => {
        const { error } = createRoom(roomCode);
        if (error) return callback(error);

        return _addPlayer(socket, name, roomCode, callback);
    })

    socket.on('join', ({ name, roomCode }, callback) => {
        return _addPlayer(socket, name, roomCode, callback);
        // // return _addPlayer(socket, name, roomCode, callback);
        // const { newPlayer, error } = addPlayer(socket.id, name, roomCode);

        // console.log('Player is joining', newPlayer, error);

        // // If there is an error, return it
        // if (error) return callback(error);
        // // Adding the new player to the room
        // socket.join(newPlayer.roomCode);
        // // Notifying the entire room that a new player joined -- socket.io does not notify the sender
        // socket.in(roomCode).emit('notification', { title: 'Someone just joined', description: `${newPlayer.playerName} just entered the room` });
        // // Sending an updated list of players to the room -- io.in notifies everyone along with the sender
        // io.in(roomCode).emit('players', getPlayers(roomCode));
        // callback();
    })

    // What the bid flow could look like
    socket.on('bid', new_bid => {
        const room = getRoom(socket.id);
        if (room) {
            const player = room.getPlayer(socket.id);
            if (player) {
                const { bid, error, endOfRound } = room.bid(new_bid);
                if (bid) {
                    io.in(room.roomCode).emit('newBid', { bid });
                } else if (endOfRound) {
                    io.in(room.roomCode).emit('endOfRound', { endOfRound });
                } else if (error) {
                    socket.emit(socket.id).emit('bidError', { error });
                } else {
                    socket.emit(socket.id).emit('error', { error: 'An unexpected error occurred ' });
                }
            } else {
                socket.emit('error', { error: 'Invalid Player id' })
            }
        }
    })



    socket.on('sendMessage', message => {
        const room = getRoom(socket.id);
        if (room) {
            const player = room.getPlayer(socket.id)
            console.log(player, room.roomCode)
            // Placeholder for now
            io.in(room.roomCode).emit('message', { player: player.playerName, text: message });
        } else {
            socket.emit('error', { error: 'Invalid Player id' });
        }
    })

    socket.on('disconnect', message => {
        console.log('player is disconnecting')
        const player = removePlayer(socket.id);
        if (player) {
            io.in(player.room).emit('notification', { title: 'Someone just left', description: `${player.playerName} just left the room` });
            io.in(player.room).emit('players', getPlayers(player.room));
        }
    })
})

app.get('/', (req, res) => {
    req.setEncoding('Server is running');
})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})