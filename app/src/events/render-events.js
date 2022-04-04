/* MODULES */

import * as GAME_EVENTS from './game-events.js';
import * as AUTH_EVENTS from './auth-events.js';
import * as YOUTUBE_EVENTS from './youtube-events.js';
import * as GAME_RENDERER from '../config/game-renderer.js';
import GLOBAL_STATE from '../global.js';

/* ELEMENTS */

const rootScreenElement = document.querySelector('#root-screen');

/* FUNCTIONS */

const renderGameScreenEvent = () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div>
      <canvas id="webgl-canvas"></canvas>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  GAME_RENDERER.initializeGameRenderer();
}

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
        <button type="button" id="user-profile-button">Profile</button>
        <button type="button" id="sign-out-button">Sign Out</button>
      </div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  if (GLOBAL_STATE.user) {
    const signOutButtonElement = document.querySelector('#sign-out-button');
    signOutButtonElement.style.display = 'block';
    signOutButtonElement.addEventListener('click', AUTH_EVENTS.signOutEvent);

    const userProfileElement = document.querySelector('#user-profile-button');
    userProfileElement.style.display = 'block';
    userProfileElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await renderUserProfileScreenEvent();
    });
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
    <div id="game-lobby-outer-layout">
      <div id="game-lobby-inner-layout">
        <div class="popup-container">
          <div class="popup-head-container">
            <h1>Statistics</h1>
          </div>
          <div>
            <p id="current-level"></p>
            <p id="total-wins"></p>
            <p id="total-losses"></p>
          </div>
        </div>

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
          <button type="button" id="start-game-button">Start</button>
          <button type="button" id="leave-room-button">Leave</button>
        </div>
      </div>

      <div>
        <div class="popup-container">
          <div class="popup-head-container">
            <h1>YouTube</h1>
          </div>
          <div id="youtube-player-container">
            <div id="youtube-video-player-container"></div>
            <div id="youtube-search-container">
              <input id="youtube-search" type="text" placeholder="Search videos" autocomplete="off" />
              <button type="button" id="youtube-search-button">Search</button>
            </div>
            <div id="youtube-videos-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const currentLevel = 0;
  const totalWins = 0;
  const totalLosses = 0;

  const currentLevelElement = document.querySelector('#current-level');
  currentLevelElement.innerText = (`Current Level: ${currentLevel}`);

  const totalWinsElement = document.querySelector('#total-wins');
  totalWinsElement.innerText = (`Wins: ${totalWins}`);

  const totalLossesElement = document.querySelector('#total-losses');
  totalLossesElement.innerText = (`Losses: ${totalLosses}`);

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

  const startGameButton = document.querySelector('#start-game-button');
  startGameButton.addEventListener('click', (event) => renderGameScreenEvent());

  const youtubeSearchButtonElement = document.querySelector('#youtube-search-button');
  const youtubeSearchElement = document.querySelector('#youtube-search');
  const youtubeVideosContainerElement = document.querySelector('#youtube-videos-container');

  const youtubeVideoPlayerContainer = document.querySelector('#youtube-video-player-container');

  youtubeSearchButtonElement.addEventListener('click', async (event) => {
    const searchTerm = youtubeSearchElement.value;

    const results = await YOUTUBE_EVENTS.searchYoutubeEvent(searchTerm);

    if (results) {
      youtubeVideosContainerElement.innerHTML = '';

      results.items.forEach(item => {
        const buttonElement = document.createElement('button');
        buttonElement.type = 'button';
        buttonElement.innerText = item.snippet.title;
        buttonElement.addEventListener('click', (event) => {
          event.preventDefault();
          
          youtubeVideoPlayerContainer.innerHTML = '';

          const iframeElement = document.createElement('iframe');

          const youtubeVideoId = item.id.videoId;
          const youtubeSnippedTitle = item.snippet.title;
          const youtubeAutoplay = '1';
          const youtubeControls = '0';
          const youtubeDisableKB = '1';
          const youtubePlaylist=youtubeVideoId;
          const youtubeLoop = 1;

          iframeElement.src = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=${youtubeAutoplay}&controls=${youtubeControls}&disablekb=${youtubeDisableKB}&playlist=${youtubePlaylist}&loop=${youtubeLoop}`;
          iframeElement.title = youtubeSnippedTitle;
          iframeElement.height = '200px';
          iframeElement.allow = 'autoplay';
          iframeElement.style.border = 'none';
          iframeElement.style.pointerEvents = 'none';

          youtubeVideoPlayerContainer.append(iframeElement);
        });
  
        youtubeVideosContainerElement.append(buttonElement);
      });

      youtubeVideosContainerElement.style.display = 'flex';
    }
  });
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

const renderUserProfileScreenEvent = async () => {
  rootScreenElement.innerHTML = '';

  const html = `
    <div class="popup-container">
      <div class="icon" id="close-user-profile">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="popup-head-container">
        <h1 class="game-font">User Profile</h1>
      </div>
      <div>
        <p id="current-email"></p>
        <p id="current-username"></p>
        <p id="current-character"></p>
        <p id="current-level"></p>
      </div>
    </div>
  `;

  rootScreenElement.innerHTML = html;

  const currentEmail = GLOBAL_STATE.user.email;
  const currentUsername = GLOBAL_STATE.user.username;
  const currentLevel = 0;

  //user profile screen var
  const emailElement = document.querySelector('#current-email');
  emailElement.innerText = (`Email: ${currentEmail}`);

  const usernameElement = document.querySelector('#current-username');
  usernameElement.innerText = (`Username: ${currentUsername}`);

  const currentLevelElement = document.querySelector('#current-level');
  currentLevelElement.innerText = (`Current Level: ${currentLevel}`);

  const closeUserProfileButtonElement = document.querySelector('#close-user-profile');
  closeUserProfileButtonElement.addEventListener('click', (event) => {
    event.preventDefault();
    renderGameMenuScreenEvent();
  });
}

const updateGameLobbyScreenEvent = ({ roomPlayers }) => {
  const roomPlayersContainerElement = document.querySelector('#room-players-container');

  roomPlayersContainerElement.innerHTML = '';

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
}

export {
  renderGameMenuScreenEvent,
  renderGameLobbyScreenEvent,
  renderJoinPublicMatchScreenEvent,
  renderJoinPrivateMatchScreenEvent,
  renderLoginScreenEvent,
  renderSignUpScreenEvent,
  renderResetPasswordScreenEvent,
  renderUserProfileScreenEvent,
  updateGameLobbyScreenEvent,
};