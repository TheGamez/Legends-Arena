/* MODULES */

import * as AUTH_EVENTS from './events/auth-events.js';
import * as GAME_EVENTS from './events/game-events.js';
import * as RENDER_EVENTS from './events/render-events.js';
import GLOBAL_STATE from './global.js';

/* STYLES */

import '../public/global.css';

/* SOCKET EVENTS */

GLOBAL_STATE.socket.on('roomGameState', GAME_EVENTS.roomGameStateEvent);
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
GLOBAL_STATE.socket.on('renderGameScreen', RENDER_EVENTS.renderGameScreenEvent);

/* APP */

(async function() {
  await AUTH_EVENTS.authenticateUserEvent();
})();
