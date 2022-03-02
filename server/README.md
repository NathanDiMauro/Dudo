To start the server: `npm start`

This project uses [socket.io](https://socket.io/).

### Bid format: 
This is the object that the client will send to the server when a player make a bid.  
`{ playerId: number, action: string, amount: number, dice: number }`  
Example: `{ playerId: 3, action: 'raise', amount: 5, dice: 5 }`
<!-- ### EndOfRound format: 
This is the object that will be sent to the client when a round is over.
`{ endOfRound: 'message' }`  
Example: `{ endOfRound: 'Joe called paul on their bet of 4 4s. Joe loses a dice' }` -->

# Client Emit Events

### Create a room
Creating a new room with `name` being the player name and `roomCode` being the room code.  
Example: `socket.emit('createRoom', {name: 'joe', roomCode: 'roomCode'}, error => { ... }`

### Join a room
Join a room with `name` being the player name and `roomCode` being the room code.  
Example: `socket.emit('join', {name: 'joe', roomCode: 'roomCode'}, error => { ... }`

### Send a bid
Send a new bid to the server.  
Example: `socket.emit('bid', {new_bid: bid_obj}, error => { ... })`  
In the example above, bid_obj is an object that matches the format of bid format object. Refer to the bid format section above.  
Example new_bid: `{ playerId: 0, action: 'raise', amount: 4, dice: 4 }`  
There are some important things to note when making a bid.  
When you send a bid to the server, the serve validates it. If the bid is invalid, it will emit an `bidError` event to the client who made the bid.  To catch this error, make sure the client is listening to the `bidError` event from the server.

# Client Listen Events
### New players
`socket.on('players', players => {...})`  
Anytime a new player joins, the server will return an array of players.  
Example response:  `[{playerName: 'joe', diceCount: 5}, {playerName: 'dave', diceCount: 5}]`.  

### New bids
`socket.on('newBid, bid => {...})`  
Anytime a new bid is made, the new bid will be sent to all clients.  
Example response: `{ playerId: 0, action: 'raise', amount: 4, dice: 5 }`  

### End of round
`socket.on('endOfRound', endOfRound => {...})`  
Anytime the round ends, the server will send an endOfRound object to all clients.  
Example response: `{ endOfRound: 'Joe called paul on their bet of 4 4s. Joe loses a dice' }`  

### Bid error
`socket.on('bidError', error => {...})`  
Anytime the client makes a bid, the server needs to validate that bid. If there is an error in the bid, the server will return an error message describing why the bid is not valid.  
Example response: `{error: 'Cannot bid the same amount or less of 1s'}`  

### Errors
`socket.on('error', players => {...})`  
Anytime any errors occur, the client will be notified.