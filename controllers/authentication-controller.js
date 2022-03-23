/* CONFIG */

const pool = require('../config/pg');

/* UTILS */

const encryption = require('../utils/encryption');

/* FUNCTIONS */

const authenticationCreateAccount = (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  if (email === '' || username === '' || password === '' || confirmPassword === '') return res.json({ message: 'Please fill in all fields.' });

  pool.query(`SELECT * FROM game_user WHERE email='${email}' OR username='${username}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (userRow && userRow.email === email) return res.json({ message: `An account with email ${email} already exists.`, isSuccessful: 0 });
    if (userRow && userRow.username === username) return res.json({ message: `An account with username ${username} already exists.`, isSuccessful: 0 });
    if (username.length < 8 || username.length > 20) return res.json({ message: 'Username must be between 8 and 20 characters long.', isSuccessful: 0 });
    if (password.length < 8 || password.length > 20) return res.json({ message: 'Password must be between 8 and 20 characters long.', isSuccessful: 0 });
    if (confirmPassword !== password) return res.json({ message: 'Passwords do not match.', isSuccessful: 0 });

    const encryptedPassword = await encryption.generatePassword(password);
    const salt = encryptedPassword.salt;
    const hash = encryptedPassword.hash;

    pool.query(`INSERT INTO game_user (email, username, salt, hash) VALUES ('${email}', '${username}', '${salt}', '${hash}')`, (error, result) => {
      if (error) console.log(error);

      return res.json({ message: `Account created for ${email}`, isSuccessful: 1 });
    });
  });
}

const authenticationSignIn = (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') return res.json({ message: 'Please fill in all fields.' });

  pool.query(`SELECT * FROM game_user WHERE email='${email}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (!userRow) return res.json({ message: `An account with email ${email} does not exist.`, user: undefined });

    const isValid = encryption.validatePassword(password, userRow.hash, userRow.salt);

    if (!isValid) return res.json({ message: `Password is incorrect.`, user: undefined });

    req.session.user = {
      id: userRow.id,
      email: userRow.email,
      username: userRow.username,
    };

    return res.json({
      message: `Signed in as ${userRow.email}`,
      user: req.session.user,
    });
  });
}

const authenticationResetPassword = (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (email === '' || newPassword === '' || confirmNewPassword === '') return res.json({ message: 'Please fill in all fields.', isAccountCreated: false });

  pool.query(`SELECT * FROM game_user WHERE email='${email}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (!userRow) return res.json({ message: `An account with email ${email} does not exist.`, isSuccessful: 0 });
    if (newPassword.length < 8 || newPassword.length > 20) return res.json({ message: 'Password must be between 8 and 20 characters long.', isSuccessful: 0 });
    if (confirmNewPassword !== newPassword) return res.json({ message: 'Passwords do not match.', isSuccessful: 0 });

    const encryptedPassword = await encryption.generatePassword(newPassword);
    const salt = encryptedPassword.salt;
    const hash = encryptedPassword.hash;

    pool.query(`UPDATE game_user SET salt='${salt}', hash='${hash}' WHERE email='${email}'`, (error, result) => {
      if (error) console.log(error);

      return res.json({ message: `Password reset for ${email}`, isSuccessful: 1 });
    });
  });
}

const authenticationSignOut = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log(error);

    return res.json({ message: 'Signed out.', user: undefined });
  });
}

const authentication404NotFound = (req, res, next) => {
  res.json({ message: '404 Not Found' });
}

module.exports = {
  authenticationCreateAccount,
  authenticationSignIn,
  authenticationResetPassword,
  authenticationSignOut,
  authentication404NotFound,
};