const app = require('express')();
const http = require('http').createServer(app);
// Initializing a new socket.io instance and passing the http server to it
const io = require('socket.io')(http);
const cors = require('cors');

const PORT = process.env.PORT || 5000
const { addPlayer, getPlayer, deletePlayer, getPlayers, removePlayer } = require('./players');

app.use(cors);


io.on('connection', (socket) => {
    console.log('Player connected')

    socket.on('join', ({ name, room }, callback) => {
        // Creating a new player
        const { newPlayer, error } = addPlayer(socket.id, name, room);

        console.log('Player is joining', newPlayer, error);

        // If there is an error, return it
        if (error) return callback(error);
        // Adding the new player to the room
        socket.join(newPlayer.room);
        // Notifying the entire room that a new player joined -- socket.io does not notify the sender
        socket.in(room).emit('notification', { title: 'Someone just joined', description: `${newPlayer.name} just entered the room` });
        // Sending an updated list of players to the room -- io.in notifies everyone along with the sender
        io.in(room).emit('players', getPlayers(room));
        callback();
    })

    socket.on('sendMessage', message => {
        console.log('Got a message', message)
        const player = getPlayer(socket.id);
        if (player) {
            // Placeholder for now
            io.in(player.room).emit('message', { player: player.name, text: message });
        }
    })

    socket.on('disconnect', message => {
        console.log('player is disconnecting')
        const player = removePlayer(socket.id);
        if (player) {
            io.in(player.room).emit('notification', { title: 'Someone just left', description: `${player.name} just left the room` });
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