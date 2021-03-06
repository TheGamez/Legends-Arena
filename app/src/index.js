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

// GLOBAL_STATE.socket.on('roomPlayer', (message) => console.log(message));
// GLOBAL_STATE.socket.on('roomPlayers', (message) => console.log(message));

GLOBAL_STATE.socket.on('roomEmpty', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('roomFull', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('roomKicked', GAME_EVENTS.roomStatusEvent)
GLOBAL_STATE.socket.on('roomNotFound', GAME_EVENTS.roomStatusEvent);
GLOBAL_STATE.socket.on('setOpenRooms', GAME_EVENTS.setOpenRoomsEvent);
GLOBAL_STATE.socket.on('renderGameLobbyScreen', RENDER_EVENTS.renderGameLobbyScreenEvent);
GLOBAL_STATE.socket.on('renderGameMenuScreen', RENDER_EVENTS.renderGameMenuScreenEvent);
GLOBAL_STATE.socket.on('updateGameLobbyScreen', RENDER_EVENTS.updateGameLobbyScreenEvent);
GLOBAL_STATE.socket.on('updateYouTubeVideoScreen', RENDER_EVENTS.updateYouTubeVideoScreenEvent);
GLOBAL_STATE.socket.on('updateYouTubeSearchScreen', RENDER_EVENTS.updateYouTubeSearchScreenEvent);
GLOBAL_STATE.socket.on('updateCharacterSelectScreen', RENDER_EVENTS.updateCharacterSelectScreenEvent);

/* APP */

(async function() {
  await AUTH_EVENTS.authenticateUserEvent();
})();
