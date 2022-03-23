/* LIBRARIES */

const { v4: uuidv4 } = require('uuid');

/* MODELS */

const GLOBAL_STATE = require('../global');

/* FUNCTIONS */

const createRoomEvent = (socket, isRoomPrivate, user) => {
  const roomCode = uuidv4();

  const sockets = {};
  sockets[socket.id] = roomCode;

  GLOBAL_STATE._gameRooms[roomCode] = { isRoomPrivate, sockets };

  let roomPlayer = '';
  if (user) {
    roomPlayer = user.username;
  } else {
    roomPlayer = `guest_${socket.id}`;
  }
  
  GLOBAL_STATE._gameSockets[socket.id] = { roomCode, roomPlayer };

  socket.join(roomCode);
  socket.emit('renderGameLobbyScreen', { roomCode, roomPlayer });

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const joinRoomEvent = (io, socket, roomCode, user) => {
  const room = GLOBAL_STATE._gameRooms[roomCode];
  if (!room) return socket.emit('roomNotFound', 'Room not found.');

  const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;

  if (roomSocketsCount === 0) return socket.emit('roomEmpty', 'Room is empty.');
  if (roomSocketsCount === GLOBAL_STATE.MAX_PLAYERS) return socket.emit('roomFull', 'Room is full.');

  GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id] = roomCode;

  let roomPlayer = '';
  if (user) {
    roomPlayer = user.username;
  } else {
    roomPlayer = `guest_${socket.id}`;
  }

  GLOBAL_STATE._gameSockets[socket.id] = { roomCode, roomPlayer };

  socket.join(roomCode);
  socket.emit('renderGameLobbyScreen', { roomCode, roomPlayer });

  io.to(roomCode).emit('roomPlayer', `Player ${roomPlayer} joined the room.`);

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socket => GLOBAL_STATE._gameSockets[socket].roomPlayer);

  io.to(roomCode).emit('roomPlayers', `Players: ${roomPlayers}`);

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const leaveRoomEvent = (io, socket, roomCode, roomPlayer) => {
  socket.leave(roomCode);
  socket.emit('renderGameMenuScreen');

  delete GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id];
  GLOBAL_STATE._gameSockets[socket.id].roomCode = undefined;

  io.to(roomCode).emit('roomPlayer', `Player ${roomPlayer} left the room.`);

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socket => GLOBAL_STATE._gameSockets[socket].roomPlayer);

  io.to(roomCode).emit('roomPlayers', `Players: ${roomPlayers}`);

  const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;
  if (roomSocketsCount === 0) delete GLOBAL_STATE._gameRooms[roomCode];

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const getOpenRoomsEvent = (socket) => {
  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.emit('setOpenRooms', openRooms);
}

const disconnectionEvent = (socket) => {
  const roomCode = GLOBAL_STATE._gameSockets[socket.id] ? GLOBAL_STATE._gameSockets[socket.id].roomCode : undefined;
  if (roomCode) delete GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id];

  delete GLOBAL_STATE._gameSockets[socket.id];

  if (roomCode) {
    const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;
    if (roomSocketsCount === 0) delete GLOBAL_STATE._gameRooms[roomCode];
  }

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

/* THIS CODE WILL BE REFACTORED AND USED IN ITERATION 3 */

// const randomFood = (gameState) => {
//   const food = {
//     // x: Math.floor(Math.random() * GRID_SIZE),
//     // y: Math.floor(Math.random() * GRID_SIZE),
//     x: Math.floor(Math.random() * 5),
//     y: Math.floor(Math.random() * 5),
//   };

//   const playerOne = gameState.players[0];
//   const playerTwo = gameState.players[1];

//   // check for player and food collision
//   if (playerOne.pos.x === food.x && playerOne.pos.y === food.y) {
//     return randomFood(gameState);
//   }

//   if (playerTwo.pos.x === food.x && playerTwo.pos.y === food.y) {
//     return randomFood(gameState);
//   }

//   gameState.food = food;
// }

// const gameLoop = (gameState) => {
//   if (!gameState) return;

//   const playerOne = gameState.players[0];
//   const playerTwo = gameState.players[1];

//   // // check if out of bounds
//   // if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
//   //   return 2; // player 2 wins, player 1 loses
//   // }

//   // // check if out of bounds
//   // if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
//   //   return 1; // player 1 wins, player 2 loses
//   // }

//   // check for player and food collision
//   if (gameState.food.x === playerOne.pos.x && gameState.food.y === playerOne.pos.y) {
//     // player grows
//     playerOne.size.w += 0.2;
//     playerOne.size.h += 0.2;

//     // display new food after eating previous food
//     randomFood(gameState);
//   }

//   if (gameState.food.x === playerTwo.pos.x && gameState.food.y === playerTwo.pos.y) {
//     // player grows
//     playerTwo.size.w += 0.2;
//     playerTwo.size.h += 0.2;

//     // display new food after eating previous food
//     randomFood(gameState);
//   }

//   // check which player wins
//   if (playerOne.size.w >= 2) return 1; // player 1 wins
//   if (playerTwo.size.w >= 2) return 2; // player 1 wins, player 2 loses

//   return false; // no winner
// }

// const getUpdatedVelocity = (keyInputCode) => {
//   switch (keyInputCode) {
//     case 'ArrowUp': {
//       return { x: 0, y: 1 };
//     }
//     case 'ArrowDown': {
//       return { x: 0, y: -1 };
//     }
//     case 'ArrowLeft': {
//       return { x: -1, y: 0 };
//     }
//     case 'ArrowRight': {
//       return { x: 1, y: 0 };
//     }
//     default:
//       return { x: 0, y: 0 };
//   }
// }

// function startGameInterval(io, roomCode) {
//   const intervalId = setInterval(() => {
//     const winner = gameLoop(GLOBAL_STATE.liveGames[roomCode]);

//     if (!winner) {
//       emitGameState(io, roomCode, GLOBAL_STATE.liveGames[roomCode]);
//     } else {
//       emitGameOver(io, roomCode, winner);
//       GLOBAL_STATE.liveGames[roomCode] = null;
//       clearInterval(intervalId);
//     }
//   }, 1000 / GLOBAL_STATE.FRAME_RATE); // FPS
// }

// function emitGameState(io, roomCode, gameState) {
//   io.sockets.in(roomCode).emit('gameState', JSON.stringify(gameState));
// }

// function emitGameOver(io, roomCode, winner) {
//   io.sockets.in(roomCode).emit('gameOver', winner);
// }

// const keyDownEvent = (socket, keyInputCode) => {
//   const roomCode = GLOBAL_STATE.gameRooms[socket.id]; // change this so that it searches public and private matches, and then get rid of this variable
  
//   if (!roomCode) return;

//   const vel = getUpdatedVelocity(keyInputCode);

//   // update specific player movement
//   if (vel) {
//     GLOBAL_STATE.liveGames[roomCode].players[socket.number - 1].pos.x += vel.x;
//     GLOBAL_STATE.liveGames[roomCode].players[socket.number - 1].pos.y += vel.y;
//   }
// }

// const joinGameEvent = (socket, io, roomCode) => {
//   const room = io.sockets.adapter._gameRooms.get(roomCode);
//   const roomValue = room.values().next().value;

//   let numClients;
//   if (roomValue) {
//     const roomSize = room.size;
//     numClients = roomSize;
//   }

//   if (numClients === 0) { // no players
//     socket.emit('unknownGame', 'Room Empty.');
//     return;
//   } else if (numClients > 1) { // 2 players (max for this game) reached
//     socket.emit('tooManyPlayers', 'Room Full.');
//     return;
//   }

//   // exactly 1 player is waiting in the room
//   GLOBAL_STATE.gameRooms[socket.id] = roomCode;

//   socket.join(roomCode);
//   socket.number = 2; // player 2
//   socket.emit('init', 2);
  
//   // start game once max players have joined
//   startGameInterval(io, roomCode);
// }

// const newGameEvent = (socket) => {
//   let roomCode = uuidv4();
//   GLOBAL_STATE.gameRooms[socket.id] = roomCode;
//   socket.emit('gameCode', roomCode);

//   // initialize the game
//   const gameState = {
//     players: [
//       {
//         pos: { x: -1, y: -1 },
//         vel: { x: 0, y: 0 },
//         size: { w: 1, h: 1 },
//       },
//       {
//         pos: { x: 1, y: 1 },
//         vel: { x: 0, y: 0 },
//         size: { w: 1, h: 1 },
//       },
//     ],
//     food: {},
//   };
//   GLOBAL_STATE.liveGames[roomCode] = gameState;
//   randomFood(gameState);

//   socket.join(roomCode);
//   socket.number = 1; // player one
//   socket.emit('init', 1);
// }

module.exports = {
  disconnectionEvent,
  createRoomEvent,
  joinRoomEvent,
  leaveRoomEvent,
  getOpenRoomsEvent,
};