/* MODULES */

// import * as THREE_CONFIG from '../config/three-config.js';
import GLOBAL_STATE from '../global.js';

/* FUNCTIONS */

const createPublicMatchEvent = (event) => {
  event.preventDefault();

  GLOBAL_STATE.socket.emit('createPublicMatch');

  // THREE_CONFIG.initializeGame();
  // document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const createPrivateMatchEvent = (event) => {
  event.preventDefault();

  GLOBAL_STATE.socket.emit('createPrivateMatch');

  // THREE_CONFIG.initializeGame();
  // document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const joinPublicMatchEvent = (event, roomCode) => {
  event.preventDefault();

  let _roomCode = roomCode;

  if (!_roomCode) {
    const roomCodeInputElement = document.querySelector('#public-room-code-input');
    _roomCode = roomCodeInputElement.value;
  }

  GLOBAL_STATE.socket.emit('joinPublicMatch', _roomCode);

  // THREE_CONFIG.initializeGame();
  // document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const joinPrivateMatchEvent = (event) => {
  event.preventDefault();

  const roomCodeInputElement = document.querySelector('#private-room-code-input');
  const roomCode = roomCodeInputElement.value;

  GLOBAL_STATE.socket.emit('joinPrivateMatch', roomCode);

  // THREE_CONFIG.initializeGame();
  // document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const setPublicMatchesEvent = (publicMatches) => {
  console.log('publicMatches:', publicMatches);
}

const setPrivateMatchesEvent = (privateMatches) => {
  console.log('privateMatches:', privateMatches);
}

const setRoomCodeEvent = (roomCode) => {
  console.log('roomCode:', roomCode);
  const roomCodeElement = document.querySelector('#room-code');
  roomCodeElement.innerText = roomCode;
}

const setPlayerEvent = (number) => {
  console.log('player:', number);
  // GLOBAL_STATE.player = number;
}

const roomEmptyEvent = (message) => {
  // const roomCodeInputElement = document.querySelector('#room-code-input');
  // const roomCodeElement = document.querySelector('#room-code');

  // GLOBAL_STATE.player = null;
  // roomCodeInputElement.value = '';
  // roomCodeElement.innerText = '';
  alert(message);
}

const roomFullEvent = (message) => {
  // const roomCodeInputElement = document.querySelector('#room-code-input');
  // const roomCodeElement = document.querySelector('#room-code');

  // GLOBAL_STATE.player = null;
  // roomCodeInputElement.value = '';
  // roomCodeElement.innerText = '';
  alert(message);
}

const roomNotFoundEvent = (message) => {
  const joinMatchMessageElement = document.querySelector('#join-match-message');
  joinMatchMessageElement.innerText = message;
}

const getAvailablePublicMatchesEvent = () => {
  GLOBAL_STATE.socket.emit('getAvailablePublicMatches');
}

const setAvailablePublicMatchesEvent = (availablePublicMatches) => {
  const availablePublicMatchesElement = document.querySelector('#available-public-matches');
  
  const matches = Object.entries(availablePublicMatches);

  matches.forEach(match => {
    const roomCode = match[0];
    const playerCount = match[1].playerCount;
    const maxPlayerCount = match[1].maxPlayerCount;

    const divElement = document.createElement('div');
    divElement.className = 'join-available-public-match-container';

    const pElement1 = document.createElement('p');
    pElement1.innerText = 'Free For All';
    pElement1.className = 'game-font';

    const pElement2 = document.createElement('p');
    pElement2.innerText = `Players [${playerCount} / ${maxPlayerCount}]`;
    pElement2.className = 'game-font';

    const buttonElement = document.createElement('button');
    buttonElement.innerText = 'Join';
    buttonElement.type = 'button';
    buttonElement.id = 'join-available-public-match';
    buttonElement.className = 'join-available-public-match game-font';
    buttonElement.addEventListener('click', (event) => joinPublicMatchEvent(event, roomCode));

    divElement.append(
      pElement1,
      pElement2,
      buttonElement,
    );

    availablePublicMatchesElement.append(divElement);
  });
}

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
  // resetGameEvent,
  // gameOverEvent,
  // setGameStateEvent,
  createPublicMatchEvent,
  createPrivateMatchEvent,
  joinPublicMatchEvent,
  joinPrivateMatchEvent,
  setPublicMatchesEvent,
  setPrivateMatchesEvent,
  setRoomCodeEvent,
  setPlayerEvent,
  roomEmptyEvent,
  roomFullEvent,
  roomNotFoundEvent,
  getAvailablePublicMatchesEvent,
  setAvailablePublicMatchesEvent,
};