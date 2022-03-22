/* MODULES */

import { io } from 'socket.io-client';

/* GLOBAL STATE */

const DEBUG = false;

const GLOBAL_STATE = {
  socket: io(),
  isGameActive: false,
  player: undefined,
  isAuthenticated: false,
  isAccountCreated: false,
  isPasswordReset: false,
  maxPlayerCount: 4,
};

if (DEBUG) console.log('[GLOBAL_STATE]', GLOBAL_STATE);

export default GLOBAL_STATE;