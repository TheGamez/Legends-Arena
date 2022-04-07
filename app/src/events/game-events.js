/* MODULES */

// import * as THREE_CONFIG from '../config/three-config.js';
import * as GAME_RENDERER from '../config/game-renderer.js';
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

const roomGameStateEvent = ({ roomPlayers }) => {
  GAME_RENDERER.initializeGameRenderer(roomPlayers);
}

export {
  createRoomEvent,
  joinRoomEvent,
  leaveRoomEvent,
  roomStatusEvent,
  getOpenRoomsEvent,
  setOpenRoomsEvent,
  roomGameStateEvent,
};