/* MODULES */

import { io } from 'socket.io-client';

/* GLOBAL STATE */

const DEBUG = false;

const GLOBAL_STATE = {
  MAX_PLAYERS: 4,
  socket: io(),
  user: undefined,
  isGameLive: false,
  youtubeSearchResults: undefined,
};

if (DEBUG) console.log('[GLOBAL_STATE]', GLOBAL_STATE);

export default GLOBAL_STATE;