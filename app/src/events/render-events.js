/* MODULES */

import * as GAME_EVENTS from './game-events.js';
import * as AUTH_EVENTS from './auth-events.js';
import GLOBAL_STATE from '../global.js';

/* ELEMENTS */

const rootScreenElement = document.querySelector('#root-screen');

/* FUNCTIONS */

const renderGameMenuScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div id="main-menu-container">
      <h1>Legends Arena</h1>

      <div id="main-menu-play-container">
        <button type="button" id="create-public-match">Create Public Match</button>
        <button type="button" id="join-public-match">Join Public Match</button>
        <button type="button" id="create-private-match">Create Private Match</button>
        <button type="button" id="join-private-match">Join Private Match</button>
      </div>

      <div class="divider"></div>

      <div id="main-menu-auth-container">
        <button type="button" id="log-in-button">Log In</button>
        <button type="button" id="sign-up-button">Sign Up</button>
        <button type="button" id="sign-out-button">Sign Out</button>
      </div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  if (GLOBAL_STATE.user) {
    const signOutButtonElement = document.querySelector('#sign-out-button');
    signOutButtonElement.style.display = 'block';
    signOutButtonElement.addEventListener('click', AUTH_EVENTS.signOutEvent);    
  } else {
    const logInButtonElement = document.querySelector('#log-in-button');
    logInButtonElement.style.display = 'block';
    logInButtonElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await renderLoginScreenEvent();
    });
    
    const signUpButtonElement = document.querySelector('#sign-up-button');
    signUpButtonElement.style.display = 'block';
    signUpButtonElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await renderSignUpScreenEvent();
    });
  }

  const createPublicMatchElement = document.querySelector('#create-public-match');
  const createPrivateMatchElement = document.querySelector('#create-private-match');
  const joinPublicMatchElement = document.querySelector('#join-public-match');
  const joinPrivateMatchElement = document.querySelector('#join-private-match');

  createPublicMatchElement.addEventListener('click', (event) => GAME_EVENTS.createRoomEvent(event, false));
  joinPublicMatchElement.addEventListener('click', renderJoinPublicMatchScreenEvent);
  createPrivateMatchElement.addEventListener('click', (event) => GAME_EVENTS.createRoomEvent(event, true));
  joinPrivateMatchElement.addEventListener('click', renderJoinPrivateMatchScreenEvent);
}

const renderGameLobbyScreenEvent = ({ roomCode, roomPlayer, roomPlayers }) => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="popup-head-container">
        <h1>Game Room</h1>
        <p id="copy-code-message"></p>
      </div>
      <div id="copy-code-container">
        <p id="room-code" class="room-code"></p>
        <button type="button" id="copy-code-button">Copy</button>
      </div>
      <div id="room-players-container"></div>
      <button type="button" id="leave-room-button">Leave</button>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const roomCodeElement = document.querySelector('#room-code');
  roomCodeElement.innerText = roomCode;

  const roomPlayersContainerElement = document.querySelector('#room-players-container');

  roomPlayers.forEach(roomPlayer => {
    const divElement = document.createElement('div');
    divElement.innerText = roomPlayer.username;
    if (roomPlayer.socketId === GLOBAL_STATE.socket.id) {
      divElement.className = 'room-player-highlight';
    } else {
      divElement.className = 'room-player';
    }
    roomPlayersContainerElement.append(divElement);
  });
  
  const copyCodeButton = document.querySelector('#copy-code-button');
  copyCodeButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(roomCode);
    const copyCodeMessage = document.querySelector('#copy-code-message');
    copyCodeMessage.innerText = 'Copied room code!';
  });

  const leaveRoomButton = document.querySelector('#leave-room-button');
  leaveRoomButton.addEventListener('click', (event) => GAME_EVENTS.leaveRoomEvent(event, roomCode, roomPlayer));
}

const renderJoinPublicMatchScreenEvent = () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="icon" id="close-join-public-match">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1>Join Public Match</h1>
        <p id="join-match-message"></p>
      </div>
      
      <form id="join-public-match-form-container-1">
        <input
          id="room-code-input"
          type="text"
          placeholder="Enter Room Code"
          autocomplete="off"
        />
        
        <button id="public-room-code-button" type="button">Join</button>
      </form>

      <div class="divider"></div>

      <div id="join-public-match-form-container-2"></div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const closeJoinPublicMatchElement = document.querySelector('#close-join-public-match');
  closeJoinPublicMatchElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });

  const publicRoomCodeButtonElement = document.querySelector('#public-room-code-button');
  publicRoomCodeButtonElement.addEventListener('click', GAME_EVENTS.joinRoomEvent);

  GAME_EVENTS.getOpenRoomsEvent();
}

const renderJoinPrivateMatchScreenEvent = () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="icon" id="close-join-private-match">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1>Join Private Match</h1>
        <p id="join-match-message"></p>
      </div>
      
      <form id="join-private-match-form-container">
        <input
          id="room-code-input"
          type="text"
          placeholder="Enter Room Code"
          autocomplete="off"
        />
        
        <button id="private-room-code-button" type="button">Join</button>
      </form>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const closeJoinPrivateMatchElement = document.querySelector('#close-join-private-match');
  closeJoinPrivateMatchElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameMenuScreenEvent();
  });

  const privateRoomCodeButtonElement = document.querySelector('#private-room-code-button');
  privateRoomCodeButtonElement.addEventListener('click', GAME_EVENTS.joinRoomEvent);
}

const renderLoginScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="icon" id="close-log-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1>Log In</h1>
        <p id="sign-in-message"></p>
      </div>
      
      <form id="log-in-form-container-1">
        <input
          id="sign-in-email"
          type="email"
          placeholder="Email"
          autocomplete="off"
        />

        <input
          id="sign-in-password"
          type="password"
          placeholder="Password"
          autocomplete="off"
        />
        
        <button id="sign-in-button" type="button">Confirm</button>
      </form>

      <div id="log-in-form-container-2">
        <button type="button" id="sign-in-help-1">Can't log in?</button>
        <button type="button" id="sign-in-help-2">Create account</button>
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
    <div class="popup-container">
      <div class="icon" id="close-sign-up">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1 class="game-font">Sign Up</h1>
        <p id="create-account-message"></p>
      </div>

      <form id="sign-up-form-container-1">
        <input
          id="create-account-email"
          type="email"
          placeholder="Email"
          autocomplete="off"
        />

        <input
          id="create-account-username"
          type="text"
          placeholder="Username"
          autocomplete="off"
        />

        <input
          id="create-account-password"
          type="password"
          placeholder="Password"
          autocomplete="off"
        />

        <input
          id="create-account-confirm-password"
          type="password"
          placeholder="Confirm Password"
          autocomplete="off"
        />

        <button id="create-account-button" type="button">Confirm</button>
      </form>

      <div id="sign-up-form-container-2">
        <button type="button" id="sign-up-help">Already have an account?</button>
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
    <div class="popup-container">
      <div class="icon" id="close-reset-password">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1>Reset Password</h1>
        <p id="reset-password-message"></p>
      </div>

      <form id="reset-password-form-container">
        <input
          id="reset-password-email"
          type="email"
          placeholder="Email"
          autocomplete="off"
        />

        <input
          id="reset-password-new-password"
          type="password"
          placeholder="New Password"
          autocomplete="off"
        />

        <input
          id="reset-password-confirm-new-password"
          type="password"
          placeholder="Confirm New Password"
          autocomplete="off"
        />

        <button id="reset-password-button" type="button">Confirm</button>
      </form>
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

export {
  renderGameMenuScreenEvent,
  renderGameLobbyScreenEvent,
  renderJoinPublicMatchScreenEvent,
  renderJoinPrivateMatchScreenEvent,
  renderLoginScreenEvent,
  renderSignUpScreenEvent,
  renderResetPasswordScreenEvent,
};