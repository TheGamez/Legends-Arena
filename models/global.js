
/* GLOBAL STATE */

const gameRooms = {}; // keeps track of all the rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }

const liveGames = {}; // keeps track of all the games being played, ex: { roomCode: gameState, roomCode: gameState, ... }

// keeps track of all the public matches | ex: { socketId: roomCode, socketId: roomCode, ... }
const publicMatches = {};
// keeps track of all the private matches | ex: { socketId: roomCode, socketId: roomCode, ... }
const privateMatches = {};

// keeps track of all the public rooms and the number of players in each | ex: { roomCode: numberOfPlayers }
const publicRooms = {};

const FRAME_RATE = 60;
const MAX_PLAYERS = 4;

module.exports = {
  gameRooms,
  liveGames,
  publicRooms,
  publicMatches,
  privateMatches,
  FRAME_RATE,
  MAX_PLAYERS,
};