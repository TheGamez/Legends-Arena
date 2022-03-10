import * as RENDER_EVENTS from './events/render-events.js';
import * as GAME_EVENTS from './events/game-events.js';
import GLOBAL_STATE from './global.js';

/* SOCKET EVENTS */

GLOBAL_STATE.socket.on('gameCode', GAME_EVENTS.setRoomCodeEvent);
GLOBAL_STATE.socket.on('init', GAME_EVENTS.setPlayerEvent);
GLOBAL_STATE.socket.on('gameState', GAME_EVENTS.setGameStateEvent);
GLOBAL_STATE.socket.on('gameOver', GAME_EVENTS.gameOverEvent);
GLOBAL_STATE.socket.on('unknownGame', GAME_EVENTS.resetGameEvent);
GLOBAL_STATE.socket.on('tooManyPlayers', GAME_EVENTS.resetGameEvent);

await RENDER_EVENTS.renderGameMenuScreenEvent();