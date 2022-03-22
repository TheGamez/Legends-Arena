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

  const html = `
    <div id="game-menu-screen">
      <div class="game-menu-screen-header">
        <h1 class="game-font">Legends Arena</h1>

        <div id="log-in-sign-up-space">
          <div id="game-menu-screen-unauthenticated-options">
            <button type="button" id="log-in-button" class="game-font">Log In</button>
            <button type="button" id="sign-up-button" class="game-font">Sign Up</button>
          </div>
          
          <div id="game-menu-screen-authenticated-options">
            <button type="button" id="sign-out-button" class="game-font">Sign Out</button>
          </div>
        </div>
      </div>
      
      <div class="game-menu-screen-body">
        <div id="simple-stats" class="game-font">
          Statistics
          djdjjjjjjjjjjjjjjjjj
        </div>

        <div id="local-online-buttons-space">
          <button type="button" id="play-online-button" class="game-font">Play Online</button>
          <button type="button" id="play-local-button" class="game-font">Play Local</button>
        </div>
      </div>
    </div>
  `;

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

  const html = `
    <div id="sign-in-screen" class="box">
      <div class="log-in-popup">

        <div id="close-log-in" class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <br />
        <br />

        <h1 class="game-font">Log In</h1>
        
        <br />
        <br />

        <p id="sign-in-message"></p>
        
        <br />
        <br />
        
        <form id="sign-in-form">
          <div>
            <input
              id="sign-in-email"
              type="email"
              placeholder="Email"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div>
            <input
              id="sign-in-password"
              type="password"
              placeholder="Password"
              autocomplete="off"
            />
          </div>

          <br />
          <br />
          
          <button id="sign-in-button" type="button">Confirm</button>
        </form>
    
        <br />
        <br />

        <div class="sign-in-help-container">
          <button type="button" id="sign-in-help-1">Can't log in?</button>
          <button type="button" id="sign-in-help-2">Create account</button>
        </div>
      </div>
    </div>
  `;

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

  const html = `
    <div id="create-account-screen">
      <div class="sign-up-popup">

        <div id="close-sign-up" class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <br />
        <br />

        <h1 class="game-font">Sign Up</h1>

        <br />
        <br />

        <p id="create-account-message"></p>
        
        <br />
        <br />

        <form id="create-account-form">
          <div>
            <input
              id="create-account-email"
              type="email"
              placeholder="Email"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div>
            <input
              id="create-account-username"
              type="text"
              placeholder="Username"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div id="password">
            <input
              id="create-account-password"
              type="password"
              placeholder="Password"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div id="password">
            <input
              id="create-account-confirm-password"
              type="password"
              placeholder="Confirm Password"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <button id="create-account-button" type="button">Confirm</button>
        </form>

        <br />
        <br />

        <div class="sign-up-help-container">
          <button type="button" id="sign-up-help">Already have an account?</button>
        </div>
      </div>
    </div>
  `;
  

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

  const html = `
    <div id="reset-password-screen" class="box">
      <div class="reset-password-popup">
      
        <div id="close-reset-password" class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <br />
        <br />

        <h1 class="game-font">Reset Password</h1>
        
        <br />
        <br />

        <p id="reset-password-message"></p>
        
        <br />
        <br />

        <form id="reset-password-form">
          <div>
            <input
              id="reset-password-email"
              type="email"
              placeholder="Email"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div id="new-password">
            <input
              id="reset-password-new-password"
              type="password"
              placeholder="New Password"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <div id="new-password">
            <input
              id="reset-password-confirm-new-password"
              type="password"
              placeholder="Confirm New Password"
              autocomplete="off"
            />
          </div>

          <br />
          <br />

          <button id="reset-password-button" type="button">Confirm</button>
        </form>
      </div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const resetPasswordButton = document.querySelector('#reset-password-button');
  resetPasswordButton.addEventListener('click', AUTH_EVENTS.resetPasswordEvent);

  const closeResetPasswordButtonElement = document.querySelector('#close-reset-password');
  closeResetPasswordButtonElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });
}

const rendergameStatisticsEvent = async () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div id="game-statistics">
      <h1>Statistics</h1>
      <br>
      <p>current level: </p>
      <br>
      <p>total losses:  </p>
      <p>total wins:  </p>
    </div>
  `;

  rootScreenElement.innerHTML = html;

}

export {
  renderGameMenuScreenEvent,
  renderLoginScreenEvent,
  renderSignUpScreenEvent,
  renderResetPasswordScreenEvent,
  rendergameStatisticsEvent,
};