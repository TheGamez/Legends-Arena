/* MODULES */

import * as THREE_CONFIG from '../config/three-config.js';
import GLOBAL_STATE from '../global.js';

/* FUNCTIONS */

const newGameEvent = (event) => {
  event.preventDefault();

  GLOBAL_STATE.socket.emit('newGame');

  THREE_CONFIG.initializeGame();

  document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const joinGameEvent = (event) => {
  event.preventDefault();

  const roomCodeInputElement = document.querySelector('#room-code-input');
  const roomCode = roomCodeInputElement.value;

  GLOBAL_STATE.socket.emit('joinGame', roomCode);

  THREE_CONFIG.initializeGame();

  document.addEventListener('keydown', (event) => GLOBAL_STATE.socket.emit('keydown', event.code));
}

const resetGameEvent = (message) => {
  const roomCodeInputElement = document.querySelector('#room-code-input');
  const roomCodeElement = document.querySelector('#room-code');

  GLOBAL_STATE.player = null;
  roomCodeInputElement.value = '';
  roomCodeElement.innerText = '';
  alert(message);
}

const gameOverEvent = (winner) => {
  if (!GLOBAL_STATE.isGameActive) return;

  if (winner === GLOBAL_STATE.player) {
    alert('You Win!');
  } else {
    alert('You Lose.');
  }

  GLOBAL_STATE.isGameActive = false;
}

const setRoomCodeEvent = (roomCode) => {
  const roomCodeElement = document.querySelector('#room-code');

  roomCodeElement.innerText = roomCode;
}

const setPlayerEvent = (number) => {
  GLOBAL_STATE.player = number;
}

const setGameStateEvent = (gameState) => {
  if (!GLOBAL_STATE.isGameActive) return;

  const _gameState = JSON.parse(gameState);

  requestAnimationFrame(() => THREE_CONFIG.animateGame(_gameState));
}

export {
  newGameEvent,
  joinGameEvent,
  resetGameEvent,
  gameOverEvent,
  setRoomCodeEvent,
  setPlayerEvent,
  setGameStateEvent,
};