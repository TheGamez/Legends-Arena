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

const joinPublicMatchEvent = (event) => {
  event.preventDefault();

  const roomCodeInputElement = document.querySelector('#public-room-code-input');
  const roomCode = roomCodeInputElement.value;

  GLOBAL_STATE.socket.emit('joinPublicMatchEvent', roomCode);

  // THREE_CONFIG.initializeGame();
  // document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const joinPrivateMatchEvent = (event) => {
  event.preventDefault();

  const roomCodeInputElement = document.querySelector('#private-room-code-input');
  const roomCode = roomCodeInputElement.value;

  GLOBAL_STATE.socket.emit('joinPrivateMatchEvent', roomCode);

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
};