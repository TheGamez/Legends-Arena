/* MODULES */

import GLOBAL_STATE from '../global.js';

/* FUNCTIONS */

const createAccountEvent = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#create-account-email').value;
  const password = document.querySelector('#create-account-password').value;

  try {
    const endpoint = '/authentication/create-account';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log('[DATA]:', data);

    GLOBAL_STATE.isAccountCreated = data.isAccountCreated;
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

    console.log('[DATA]:', data);

    GLOBAL_STATE.isAuthenticated = data.isAuthenticated;
  } catch (error) {
    console.log(error);
  }
}

const resetPasswordEvent = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#reset-password-email').value;
  const password = document.querySelector('#reset-password-new-password').value;

  try {
    const endpoint = '/authentication/reset-password';
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log('[DATA]:', data);

    GLOBAL_STATE.isPasswordReset = data.isPasswordReset;
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

    console.log('[DATA]:', data);

    GLOBAL_STATE.isAuthenticated = data.isAuthenticated;
  } catch (error) {
    console.log(error);
  }
}

export {
  createAccountEvent,
  signInEvent,
  resetPasswordEvent,
  signOutEvent,
};