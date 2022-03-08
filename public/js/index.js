/* MODULES */

import * as AUTH_EVENTS from './events/auth-events.js';
import * as GAME_EVENTS from './events/game-events.js';
import GLOBAL_STATE from './global.js';

/* ELEMENTS */

const getHTMLButton1 = document.querySelector('#get-html-1');
const getHTMLButton2 = document.querySelector('#get-html-2');
const getHTMLButton3 = document.querySelector('#get-html-3');
const getHTMLButton4 = document.querySelector('#get-html-4');
const getHTMLButton5 = document.querySelector('#get-html-5');

const rootScreenElement = document.querySelector('#root-screen');

/* FUNCTIONS */

/* 
  How do each of these functions work?
    1. we clear anything from the page we don't want to show
    2. we grab the new html content we want to show
    3. we insert the new html into the DOM
    4. we attach the required event listeners needed for the page to function

    Note: the order of these operations matters
*/

const renderCreateAccountScreen = async () => {
  // Clear HTML
  rootScreenElement.innerHTML = '';

  // Fetch HTML
  const response = await fetch('./html/create-account-screen.html');
  const html = await response.text();

  // Instert HTML into DOM
  rootScreenElement.innerHTML = html;

  // Add event listeners
  const createAccountButton = document.querySelector('#create-account-button');

  createAccountButton.addEventListener('click', AUTH_EVENTS.createAccountEvent);
}

const renderSignInScreen = async () => {
  // Clear HTML
  rootScreenElement.innerHTML = '';

  // Fetch HTML
  const response = await fetch('./html/sign-in-screen.html');
  const html = await response.text();

  // Insert HTML into DOM
  rootScreenElement.innerHTML = html;

  // Add event listeners
  const signInButton = document.querySelector('#sign-in-button');

  signInButton.addEventListener('click', AUTH_EVENTS.signInEvent);
}

const renderResetPasswordScreen = async () => {
  // Clear HTML
  rootScreenElement.innerHTML = '';

  // Fetch HTML
  const response = await fetch('./html/reset-password-screen.html');
  const html = await response.text();

  // Insert HTML into DOM
  rootScreenElement.innerHTML = html;

  // Add event listeners
  const resetPasswordButton = document.querySelector('#reset-password-button');

  resetPasswordButton.addEventListener('click', AUTH_EVENTS.resetPasswordEvent);
}

const renderSignOutScreen = async () => {
  // clear screen
  rootScreenElement.innerHTML = '';

  // fetch html file
  const response = await fetch('./html/sign-out-screen.html');
  const html = await response.text();

  // insert html to DOM
  rootScreenElement.innerHTML = html;

  // set up event listeners
  const signOutButton = document.querySelector('#sign-out-button');

  signOutButton.addEventListener('click', AUTH_EVENTS.signOutEvent);
}

const renderGameMenuScreen = async () => {
  // Clear HTML
  rootScreenElement.innerHTML = '';

  // Fetch HTML
  const response = await fetch('./html/game-menu-screen.html');
  const html = await response.text();

  // Insert HTML into DOM
  rootScreenElement.innerHTML = html;

  // Add event listeners
  const newGameButton = document.querySelector('#new-game-button');
  const joinGameButton = document.querySelector('#join-game-button');

  newGameButton.addEventListener('click', GAME_EVENTS.newGameEvent);
  joinGameButton.addEventListener('click', GAME_EVENTS.joinGameEvent);
}

/* EVENTS */

getHTMLButton1.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderCreateAccountScreen();
});

getHTMLButton2.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderSignInScreen();
});

getHTMLButton3.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderResetPasswordScreen();
});

getHTMLButton4.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderSignOutScreen();
});

getHTMLButton5.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderGameMenuScreen();
});

/* SOCKET EVENTS */

GLOBAL_STATE.socket.on('gameCode', GAME_EVENTS.setRoomCodeEvent);
GLOBAL_STATE.socket.on('init', GAME_EVENTS.setPlayerEvent);
GLOBAL_STATE.socket.on('gameState', GAME_EVENTS.setGameStateEvent);
GLOBAL_STATE.socket.on('gameOver', GAME_EVENTS.gameOverEvent);
GLOBAL_STATE.socket.on('unknownGame', GAME_EVENTS.resetGameEvent);
GLOBAL_STATE.socket.on('tooManyPlayers', GAME_EVENTS.resetGameEvent);