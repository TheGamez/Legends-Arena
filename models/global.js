
/* GLOBAL STATE */

const gameRooms = {}; // keeps track of all the rooms available, ex: { socketId: roomCode, socketId: roomCode, ... }
const liveGames = {}; // keeps track of all the games being played, ex: { roomCode: gameState, roomCode: gameState, ... }

const FRAME_RATE = 60;
const MAX_PLAYERS = 4;

const _gameRooms = {};
const _gameSockets = {};

module.exports = {
  gameRooms,
  liveGames,
  FRAME_RATE,
  MAX_PLAYERS,
  _gameRooms,
  _gameSockets,
};