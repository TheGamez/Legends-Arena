
/* GLOBAL STATE */

const gameRooms = {}; // keeps track of all the rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }
const liveGames = {}; // keeps track of all the games being played, ex: { roomCode: gameState, roomCode: gameState, ... }

// keeps track of all the public rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }
const publicMatches = {};
// keeps track of all the private rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }
const privateMatches = {};

const FRAME_RATE = 60;
const MAX_PLAYERS = 4;

module.exports = {
  gameRooms,
  liveGames,
  publicMatches,
  privateMatches,
  FRAME_RATE,
  MAX_PLAYERS,
};