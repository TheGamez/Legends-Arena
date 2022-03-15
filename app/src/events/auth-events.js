/* MODULES */

import * as RENDER_EVENTS from './render-events.js';
import GLOBAL_STATE from '../global.js';

/* VARIABLES */
const DEBUG = true;

/* FUNCTIONS */

const authenticateUserEvent = async () => {
  try {
    const endpoint = '/users/user';
    const options = {
      method: 'GET',
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (DEBUG) console.log(data);

    GLOBAL_STATE.isAuthenticated = data.isAuthenticated;
    await RENDER_EVENTS.renderGameMenuScreenEvent();
  } catch (error) {
    console.log(error);
  }
}

const createAccountEvent = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#create-account-email').value;
  const username = document.querySelector('#create-account-username').value;
  const password = document.querySelector('#create-account-password').value;
  const confirmPassword = document.querySelector('#create-account-confirm-password').value;

  try {
    const endpoint = '/authentication/create-account';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, confirmPassword }),
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (DEBUG) console.log(data);

    if (data.isAccountCreated) {
      GLOBAL_STATE.isAccountCreated = data.isAccountCreated;
      await RENDER_EVENTS.renderLoginScreenEvent();
    } else {
      const createAccountMessageElement = document.querySelector('#create-account-message');
      createAccountMessageElement.innerHTML = data.message;
    }
  } catch (error) {
    console.log(error);
  }
}

const signInEvent = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#sign-in-email').value;
  const password = document.querySelector('#sign-in-password').value;

  try {
    const endpoint = '/authentication/sign-in';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (DEBUG) console.log(data);

    if (data.isAuthenticated) {
      GLOBAL_STATE.isAuthenticated = data.isAuthenticated;
      await RENDER_EVENTS.renderGameMenuScreenEvent();
    } else {
      const signInMessageElement = document.querySelector('#sign-in-message');
      signInMessageElement.innerHTML = data.message;
    }
  } catch (error) {
    console.log(error);
  }
}

const resetPasswordEvent = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#reset-password-email').value;
  const newPassword = document.querySelector('#reset-password-new-password').value;
  const confirmNewPassword = document.querySelector('#reset-password-confirm-new-password').value;

  try {
    const endpoint = '/authentication/reset-password';
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, confirmNewPassword }),
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (DEBUG) console.log(data);

    if (data.isPasswordReset) {
      GLOBAL_STATE.isPasswordReset = data.isPasswordReset;
      await RENDER_EVENTS.renderGameMenuScreenEvent();
    } else {
      const resetPasswordMessageElement = document.querySelector('#reset-password-message');
      resetPasswordMessageElement.innerHTML = data.message;
    }
  } catch (error) {
    console.log(error);
  }
}

const signOutEvent = async (event) => {
  event.preventDefault();

  try {
    const endpoint = '/authentication/sign-out';
    const options = {
      method: 'DELETE',
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (DEBUG) console.log(data);

    GLOBAL_STATE.isAuthenticated = data.isAuthenticated;
    await RENDER_EVENTS.renderGameMenuScreenEvent();
  } catch (error) {
    console.log(error);
  }
}

export {
  authenticateUserEvent,
  createAccountEvent,
  signInEvent,
  resetPasswordEvent,
  signOutEvent,
};