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

    <div class="icon" id="user-game-settings">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  if (GLOBAL_STATE.isAuthenticated) {
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

  // game settings icon / button
  const SettingsIconElement = document.querySelector('#user-game-settings');
  SettingsIconElement.style.display = 'block';
  SettingsIconElement.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderSettingsEvent();
  });

  const createPublicMatchElement = document.querySelector('#create-public-match');
  const createPrivateMatchElement = document.querySelector('#create-private-match');
  const joinPublicMatchElement = document.querySelector('#join-public-match');
  const joinPrivateMatchElement = document.querySelector('#join-private-match');

  createPublicMatchElement.addEventListener('click', (event) => GAME_EVENTS.createRoomEvent(event, false));
  joinPublicMatchElement.addEventListener('click', renderJoinPublicMatchScreenEvent);
  createPrivateMatchElement.addEventListener('click', (event) => GAME_EVENTS.createRoomEvent(event, true));
  joinPrivateMatchElement.addEventListener('click', renderJoinPrivateMatchScreenEvent);
}


// temporarely made the currentlevel, totallosses, and totalwins all set to 0
const renderGameLobbyScreenEvent = ({ roomCode, roomPlayer , CurrentLevel = 0, TotalLosses = 0, TotalWins = 0}) => {
  rootScreenElement.innerHTML = '';

   rendergameStatisticsEvent(); // the previous game statistics, game code, and profile button

  //game code var
  const roomCodeElement = document.querySelector('#room-code');
  roomCodeElement.innerText = roomCode;

  const roomPlayersElement = document.querySelector('#room-players');
  roomPlayersElement.append(`Player ${roomPlayer}`);

  //game statistics var
  const CurrentLevelElement = document.querySelector('#current-level');
  CurrentLevelElement.innerText = (`Current Level: ${CurrentLevel}`);

  const TotalLossesElement = document.querySelector('#total-losses');
  TotalLossesElement.innerText = (`Total Losses: ${TotalLosses}`);

  const TotalWinsElement = document.querySelector('#total-wins');
  TotalWinsElement.innerText = (`Total Wins: ${TotalWins}`);

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

const renderResetPasswordScreenEvent1 = async () => {
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
    await renderUserProfileScreenEvent();
  });
}

const rendergameStatisticsEvent = async () => {

  rootScreenElement.innerHTML = '';

  const html = `
    <div id="game-room">
      <h1>Game Room</h1>
      <p id="room-code"></p>
      <div id="room-players"></div>
      <br>
    </div>

    <div id="game-statistics">
      <h1>Statistics</h1>
      <p id="current-level"></p>
      <p id="total-losses"></p>
      <p id="total-wins"></p>
    </div>

    <div>
    <button id="user-profile-button" type="button">View Profile</button>
    </div>
    `;
  rootScreenElement.innerHTML = html;

  const UserProfileElement = document.querySelector('#user-profile-button');
  UserProfileElement.style.display = 'block';
  UserProfileElement.addEventListener('click', async (event) => {
  event.preventDefault();
  await renderUserProfileScreenEvent();
  });

}

const renderUserProfileScreenEvent = async (CurrentEmail, CurrentUsername, CurrentCharacter, CurrentLevel = 0) => {

  rootScreenElement.innerHTML = '';

  const html = `
  <div class="popup-container-1">
    <div class="icon" id="close-user-profile">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    <div class="popup-user-profile-container">
      <h1 class="game-font">User Profile</h1>
      <br>
      <p id="current-email"></p>
      <p id="current-username"></p>
      <p id="current-character"></p>
      <p id="current-level"></p>
      <br>
      <br>
      <button id="reset-account-password-button" type="button">Reset Password</button>
      <img src="./character modelling/loraxcharacter.png" alt="Character Image" style="width:50px;height:60px;">
    </div>

  </div>
`;
  rootScreenElement.innerHTML = html;

  //user profile screen var
  const EmailElement = document.querySelector('#current-email');
  EmailElement.innerText = (`Email: ${CurrentEmail}`);

  const UsernameElement = document.querySelector('#current-username');
  UsernameElement.innerText = (`Username: ${CurrentUsername}`);

  const CharacterElement = document.querySelector('#current-character');
  CharacterElement.innerText = (`Character: ${CurrentCharacter}`);

  const CurrentLevelElement = document.querySelector('#current-level');
  CurrentLevelElement.innerText = (`Current Level: ${CurrentLevel}`);

  const closeUserProfileButtonElement = document.querySelector('#close-user-profile');
  closeUserProfileButtonElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderGameLobbyScreenEvent();
  });

  const resetPasswordElement = document.querySelector('#reset-account-password-button');
  resetPasswordElement.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderResetPasswordScreenEvent1();
  });
}

const renderSettingsEvent = async () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="icon" id="close-settings">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="popup-head-container">
        <h1>Settings</h1>
        <h2>Change controls:</h2>
      </div>
      
      <form id="settings-container">
        <p> Up key:
        <input 
          id="up-key"
          type="text"
          placeholder="up"
          autocomplete="off"
        />
        </p>

        <br>
        <p> Down key:
        <input
          id="down-key"
          type="text"
          placeholder="down"
          autocomplete="off"
        />
        </p>

        <br>
        <p> Left key:
        <input
        id="left-key"
        type="text"
        placeholder="left"
        autocomplete="off"
        />
        </p>

        <br>
        <p> Right key:
        <input
        id="right-key"
        type="text"
        placeholder="right"
        autocomplete="off"
        />
        </p>

        <br>
        <p> Jump key:
        <input
        id="jump-key"
        type="text"
        placeholder="jump"
        autocomplete="off"
        />
        </p>

        <br>
        <p> Punch key:
        <input
        id="punch-key"
        type="text"
        placeholder="punch"
        autocomplete="off"
        />
        </p>
        <br>
        <button id="reset-keys-button" type="button">Confirm</button>
        
      </form>

    </div>
  `;
  rootScreenElement.innerHTML = html;

  const ResetKeysButtonElement = document.querySelector('#reset-keys-button');
  ResetKeysButtonElement.addEventListener('click', AUTH_EVENTS.ResetKeysEvent);

  const closeSettingsElement = document.querySelector('#close-settings');
  closeSettingsElement.addEventListener('click', async (event) => {
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
  rendergameStatisticsEvent,
  renderUserProfileScreenEvent,
  renderSettingsEvent,
};