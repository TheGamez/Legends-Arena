/* MODULES */

import * as AUTH_EVENTS from './events/auth-events.js';
import * as GAME_EVENTS from './events/game-events.js';
import GLOBAL_STATE from './global.js';

/* STYLES */

import '../public/global.css';

/* SOCKET EVENTS */


// GLOBAL_STATE.socket.on('gameState', GAME_EVENTS.setGameStateEvent);
// GLOBAL_STATE.socket.on('gameOver', GAME_EVENTS.gameOverEvent);



GLOBAL_STATE.socket.on('publicMatches', GAME_EVENTS.setPublicMatchesEvent);
GLOBAL_STATE.socket.on('privateMatches', GAME_EVENTS.setPrivateMatchesEvent);
GLOBAL_STATE.socket.on('roomCode', GAME_EVENTS.setRoomCodeEvent);
GLOBAL_STATE.socket.on('player', GAME_EVENTS.setPlayerEvent);
GLOBAL_STATE.socket.on('roomEmpty', GAME_EVENTS.roomEmptyEvent);
GLOBAL_STATE.socket.on('roomFull', GAME_EVENTS.roomFullEvent);


const publicRoomCodeButton = document.querySelector('#public-room-code-button');
const privateRoomCodeButton = document.querySelector('#private-room-code-button');

publicRoomCodeButton.addEventListener('click', GAME_EVENTS.joinPublicMatchEvent);
privateRoomCodeButton.addEventListener('click', GAME_EVENTS.joinPrivateMatchEvent);

/* MAIN */

(async function() {
  await AUTH_EVENTS.authenticateUserEvent();
})();