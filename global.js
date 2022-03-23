
/* GLOBAL STATE */

// const gameRooms = {}; // keeps track of all the rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }
// const liveGames = {}; // keeps track of all the games being played, ex: { roomCode: gameState, roomCode: gameState, ... }

const FRAME_RATE = 60;
const MAX_PLAYERS = 4;

/* 
  _gameRooms = {
    roomCode: {
      isRoomPrivate: true,
      sockets: {
        socketId: 
      },
    },
    roomCode: {
      isRoomPrivate: false,
      sockets: {
        socketId: 
      },
    },
    ...
  }
*/
const _gameRooms = {};

/* 
  _gameSockets = {
    socketId: {
      roomCode: 123-456-789-0000,
      roomPlayer: guest_123abc,
    },
    socketId: {
      roomCode: 123-456-789-0000,
      roomPlayer: guest_456def,
    },
    socketId: {
      roomCode: abc-123-def-1000,
      roomPlayer: johndoe123,
    },
    ...
  }
*/
const _gameSockets = {};

module.exports = {
  FRAME_RATE,
  MAX_PLAYERS,
  _gameRooms,
  _gameSockets,
};