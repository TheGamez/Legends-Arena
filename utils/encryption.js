/* LIBRARIES */

const crypto = require('crypto');

/* FUNCTIONS */

const generatePassword = async (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return { salt, hash };
}

const validatePassword = (password, user_hash, user_salt) => {
  const hash = crypto.pbkdf2Sync(password, user_salt, 10000, 64, 'sha512').toString('hex');
  
  const isValid = user_hash === hash;
  
  return isValid;
}

module.exports = {
  generatePassword,
  validatePassword,
};