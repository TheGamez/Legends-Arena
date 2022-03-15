/* MODULES */

import { io } from 'socket.io-client';

/* GLOBAL STATE */

const DEBUG = true;

const GLOBAL_STATE = {
  socket: io(),
  isGameActive: false,
  player: undefined,
  isAuthenticated: false,
  isAccountCreated: false,
  isPasswordReset: false,
};

if (DEBUG) console.log('[GLOBAL_STATE]', GLOBAL_STATE);

export default GLOBAL_STATE;