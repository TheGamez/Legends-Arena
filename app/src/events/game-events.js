/* MODULES */

// import * as THREE_CONFIG from '../config/three-config.js';
import GLOBAL_STATE from '../global.js';

/* FUNCTIONS */

const createRoomEvent = (event, isRoomPrivate) => {
  event.preventDefault();

  GLOBAL_STATE.socket.emit('createRoom', { isRoomPrivate, user: GLOBAL_STATE.user });
}

const joinRoomEvent = (event, roomCode) => {
  event.preventDefault();

  let _roomCode = roomCode;

  if (!_roomCode) {
    const roomCodeInputElement = document.querySelector('#room-code-input');
    _roomCode = roomCodeInputElement.value;
  }

  GLOBAL_STATE.socket.emit('joinRoom', { roomCode: _roomCode, user: GLOBAL_STATE.user });
}

const leaveRoomEvent = (event, roomCode, roomPlayer) => {
  event.preventDefault();

  GLOBAL_STATE.socket.emit('leaveRoom', { roomCode, roomPlayer });
}

const roomStatusEvent = (message) => {
  const joinMatchMessageElement = document.querySelector('#join-match-message');
  joinMatchMessageElement.innerText = message;
}

const getOpenRoomsEvent = () => {
  GLOBAL_STATE.socket.emit('getOpenRooms');
}

const setOpenRoomsEvent = (openRooms) => {
  const openRoomsElement = document.querySelector('#join-public-match-form-container-2');

  if (openRoomsElement) {
    openRoomsElement.innerHTML = '';

    const matches = Object.entries(openRooms);
  
    if (matches.length === 0) openRoomsElement.innerHTML = `<div class="text-center">No matches found.</div>`;
  
    matches.forEach(match => {
      const roomCode = match[0];
      const playerCount = Object.values(match[1].sockets).length;
  
      const divElement = document.createElement('div');
      divElement.className = 'join-public-match-wrapper';
  
      const pElement1 = document.createElement('p');
      pElement1.innerText = 'Free For All';
  
      const pElement2 = document.createElement('p');
      pElement2.innerText = `Players [${playerCount} / ${GLOBAL_STATE.MAX_PLAYERS}]`;
  
      const buttonElement = document.createElement('button');
      buttonElement.type = 'button';
      buttonElement.innerText = 'Join';
      buttonElement.addEventListener('click', (event) => joinRoomEvent(event, roomCode));
  
      divElement.append(
        pElement1,
        pElement2,
        buttonElement,
      );
  
      openRoomsElement.append(divElement);
    });
  }
}

/* THIS CODE WILL BE REFACTORED AND USED IN ITERATION 3 */

// const resetGameEvent = (message) => {
//   const roomCodeInputElement = document.querySelector('#room-code-input');
//   const roomCodeElement = document.querySelector('#room-code');

//   GLOBAL_STATE.player = null;
//   roomCodeInputElement.value = '';
//   roomCodeElement.innerText = '';
//   alert(message);
// }

// const gameOverEvent = (winner) => {
//   if (!GLOBAL_STATE.isGameActive) return;

//   if (winner === GLOBAL_STATE.player) {
//     alert('You Win!');
//   } else {
//     alert('You Lose.');
//   }

//   GLOBAL_STATE.isGameActive = false;
// }

// const setGameStateEvent = (gameState) => {
//   if (!GLOBAL_STATE.isGameActive) return;

//   const _gameState = JSON.parse(gameState);

//   requestAnimationFrame(() => THREE_CONFIG.animateGame(_gameState));
// }

export {
  createRoomEvent,
  joinRoomEvent,
  leaveRoomEvent,
  roomStatusEvent,
  getOpenRoomsEvent,
  setOpenRoomsEvent,
};