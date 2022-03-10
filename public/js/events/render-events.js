/* MODULES */

import * as AUTH_EVENTS from './auth-events.js';
import GLOBAL_STATE from '../global.js';

/* ELEMENTS */

const rootScreenElement = document.querySelector('#root-screen');
const playOnlineButtonElement = document.querySelector('#play-online-button');
const playLocalButtonElement = document.querySelector('#play-local-button');

/* FUNCTIONS */

const renderGameMenuScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const response = await fetch('./html/game-menu-screen.html');
  const html = await response.text();

  rootScreenElement.innerHTML = html;

  if (GLOBAL_STATE.isAuthenticated) {
    const gameMenuScreenAuthenticatedOptionsElement = document.querySelector('#game-menu-screen-authenticated-options');
    gameMenuScreenAuthenticatedOptionsElement.style.display = 'block';

    const signOutButtonElement = document.querySelector('#sign-out-button');
    signOutButtonElement.addEventListener('click', AUTH_EVENTS.signOutEvent);    
  } else {
    const gameMenuScreenUnauthenticatedOptionsElement = document.querySelector('#game-menu-screen-unauthenticated-options');
    gameMenuScreenUnauthenticatedOptionsElement.style.display = 'block'; 

    const logInButtonElement = document.querySelector('#log-in-button');
    logInButtonElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await renderLoginScreenEvent();
    });
    
    const signUpButtonElement = document.querySelector('#sign-up-button');
    signUpButtonElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await renderSignUpScreenEvent();
    });
  }

  /* future implementation */
  // const newGameButton = document.querySelector('#new-game-button');
  // newGameButton.addEventListener('click', GAME_EVENTS.newGameEvent);

  // const joinGameButton = document.querySelector('#join-game-button');
  // joinGameButton.addEventListener('click', GAME_EVENTS.joinGameEvent);
}

const renderLoginScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const response = await fetch('./html/sign-in-screen.html');
  const html = await response.text();

  rootScreenElement.innerHTML = html;

  const signInButtonElement = document.querySelector('#sign-in-button');
  signInButtonElement.addEventListener('click', AUTH_EVENTS.signInEvent);

  const closeLogInButtonElement = document.querySelector('#close-log-in');
  closeLogInButtonElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });

  const signInHelp1 = document.querySelector('#sign-in-help-1');
  signInHelp1.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderResetPasswordScreenEvent();
  });

  const signInHelp2 = document.querySelector('#sign-in-help-2');
  signInHelp2.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderSignUpScreenEvent();
  });
}

const renderSignUpScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const response = await fetch('./html/create-account-screen.html');
  const html = await response.text();

  rootScreenElement.innerHTML = html;

  const createAccountButtonElement = document.querySelector('#create-account-button');
  createAccountButtonElement.addEventListener('click', AUTH_EVENTS.createAccountEvent);

  const closeSignUpButtonElement = document.querySelector('#close-sign-up');
  closeSignUpButtonElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });

  const signUpHelp = document.querySelector('#sign-up-help');
  signUpHelp.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderLoginScreenEvent();
  });
}

const renderResetPasswordScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const response = await fetch('./html/reset-password-screen.html');
  const html = await response.text();

  rootScreenElement.innerHTML = html;

  const resetPasswordButton = document.querySelector('#reset-password-button');
  resetPasswordButton.addEventListener('click', AUTH_EVENTS.resetPasswordEvent);

  const closeResetPasswordButtonElement = document.querySelector('#close-reset-password');
  closeResetPasswordButtonElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });
}

export {
  renderGameMenuScreenEvent,
  renderLoginScreenEvent,
  renderSignUpScreenEvent,
  renderResetPasswordScreenEvent,
};