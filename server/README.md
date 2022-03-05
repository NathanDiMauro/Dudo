# Start the Server
To start the server: `npm start`.   
The server will automatically refresh when changes are made, thanks to [nodemon](https://github.com/remy/nodemon).

### Tools
This project uses [socket.io](https://socket.io/). If you are unfamiliar with WebSocket, read more [here](https://en.wikipedia.org/wiki/WebSocket). It is highly recommend that you check out the [socket.io docs](https://socket.io/docs/v4/) if you have not already.

# Client Guide


### Bid format
This is the object that the client will send to the server when a player make a bid.  
Possible actions are `'raise'`, `'aces'`, `'call'`, `'spot'`.  
`{ playerId: string, action: string, amount: number, dice: number }`  
Example: `{ playerId: '3', action: 'raise', amount: 5, dice: 5 }`  

### Return bid format
This object what the server will send to all clients once a bid has been made. It is very similar to the [bid format](#bid-format), however, it includes the players name.  
`{ playerId: string, playerName: string, action: string, amount: number, dice: number }`  
Example: `{ playerId: '3', playerName: 'Tom', action: 'raise', amount: 5, dice: 5 }`  

## Client Emit Events

### Create a room
Creating a new room with `name` being the player name and `roomCode` being the room code.  
If there is an issue creating the room, then it returns the error in the `error` variable.  
Example: `socket.emit('createRoom', { name: 'joe', roomCode: 'roomCode' }, error => { ... }`

### Join a room
Join a room with `name` being the player name and `roomCode` being the room code.  
If there is an issue joining the room, then it returns the error in the `error` variable.  
Example: `socket.emit('join', { name: 'joe', roomCode: 'roomCode' }, error => { ... }`

### Send a bid
Send a new bid to the server.  
There are some important things to note when making a bid. If a bid is invalid, the server will return an error in the `error` variable. If the bid is valid, then the new bid will be sent to all clients through the [`newBid` event](#new-bids)  
When sending a bid with an action of `spot` or `call`, you can just pass `null` for both `amount` and `dice`. We do not care what those numbers are since we are comparing the call to the previous bet.  
Example: `socket.emit('bid', { new_bid: bid_obj }, error => { ... })`  
In the example above, bid_obj is an object that matches the format of bid object. Refer to the [bid format section above](#bid-format).  
Example new_bid: `{ playerId: '0', action: 'raise', amount: 4, dice: 4 }`  

## Client Listen Events
### Notification
`socket.on('notification', notification => { ... })`  
Anytime something happens where players will need to be notified, a notification event will be emitted to all clients. This could happen when a player joins/leaves or a new round starts.  
Example response: `{ title: 'Someone just joined', description: 'Tom just entered the room' }`

### Players
`socket.on('players', players => { ... })`  
Anytime a new player joins, the server will return an array of players.  
Example response:  `[{ playerName: 'joe', diceCount: 5 }, { playerName: 'dave', diceCount: 5 }]`.  

### New bids
`socket.on('newBid, bid => { ... })`  
Anytime a new bid is made, the new bid will be sent to all clients.  
The bid is formatted as an object. Refer to the [bid return format section above](#bid-return-format).  
Example response: `{ playerId: '0', playerName: 'Tom', action: 'raise', amount: 4, dice: 5 }`  

### End of round
`socket.on('endOfRound', endOfRound => { ... })`  
Anytime the round ends, the server will send an endOfRound object to all clients.  
Example response: `{ endOfRound: 'Joe called paul on their bet of 4 4s. Joe loses a dice' }`  

### End of game
`socket.on('endOfGame', endOfGame => { ... })`  
When only one player has dice left, the server will send an endOfGame object ot all clients.  
This event can only happen after a `call`.  
Example response: `{{ endOfGame: 'Joe has won the game.' }}`

### Errors
`socket.on('error', players => { ... })`  
Anytime any errors occur, the client will be notified.  
This is not really being used, so this event should not be a top priority