/* MODULES */

import * as AUTH_EVENTS from './events/auth-events.js';
import * as GAME_EVENTS from './events/game-events.js';
import * as RENDER_EVENTS from './events/render-events.js';
import GLOBAL_STATE from './global.js';

/* STYLES */

import '../public/global.css';

/* SOCKET EVENTS */

// GLOBAL_STATE.socket.on('gameState', GAME_EVENTS.setGameStateEvent);
// GLOBAL_STATE.socket.on('gameOver', GAME_EVENTS.gameOverEvent);

GLOBAL_STATE.socket.on('roomEmpty', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('roomFull', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('roomNotFound', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('setOpenRooms', GAME_EVENTS.setOpenRoomsEvent);
GLOBAL_STATE.socket.on('renderGameLobby', RENDER_EVENTS.renderGameLobbyScreenEvent);

/* APP */

(async function() {
  await AUTH_EVENTS.authenticateUserEvent();
})();