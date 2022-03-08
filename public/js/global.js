
/* GLOBAL STATE */

const GLOBAL_STATE = {
  socket: io(),
  isGameActive: false,
  player: undefined,
  isAuthenticated: false,
  isAccountCreated: false,
  isPasswordReset: false,
};

export default GLOBAL_STATE;