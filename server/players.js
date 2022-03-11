// Format for players:
// {
//  id: String,
//  name: String,
//  room: String,
//  dice: Number
// }

// List of current connected players
const players = []

const addPlayer = (id, name, room) => {
    // Checking if there is a player with the same name in the same room
    const existingPlayer = getPlayers(room).find(player => player.name.trim().toLowerCase() === name.trim().toLowerCase());

    if (existingPlayer) return { error: 'Username already exists' }
    if (!name && !room) return { error: 'Username and room are required' }
    if (!name) return { error: 'Username is required' }
    if (!room) return { error: 'Room is required' }

    // Creating new player
    const newPlayer = { id: id, name: name, room: room, dice: 5 }
    players.push(newPlayer);

    return { newPlayer }
}

const getPlayer = (id) => {
    return players.find(player => player.id === id);
}

const removePlayer = (id) => {
    const index = players.findIndex((player) => player.id === id);
    if (index !== -1) return players.splice(index, 1)[0];
}

const getPlayers = (room) => players.filter(player => player.room === room);

module.exports = { addPlayer, getPlayer, removePlayer, getPlayers }