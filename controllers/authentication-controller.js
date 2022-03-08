/* CONFIG */

const pool = require('../config/pg');

/* UTILS */

const encryption = require('../utils/encryption');

/* FUNCTIONS */

const authenticationCreateAccount = (req, res, next) => {
  const { email, password } = req.body;

  pool.query(`SELECT * FROM game_user WHERE email='${email}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (userRow) return res.json({ message: `An account with email ${email} already exists.`, isAccountCreated: false });

    const encryptedPassword = await encryption.generatePassword(password);
    const salt = encryptedPassword.salt;
    const hash = encryptedPassword.hash;

    pool.query(`INSERT INTO game_user (email, salt, hash) VALUES ('${email}', '${salt}', '${hash}')`, (error, result) => {
      if (error) console.log(error);

      return res.json({ message: 'Created account!', isAccountCreated: true });
    });
  });
}

const authenticationSignIn = (req, res, next) => {
  const { email, password } = req.body;

  pool.query(`SELECT * FROM game_user WHERE email='${email}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (!userRow) return res.json({ message: `An account with email ${email} does not exist.`, isAuthenticated: false });

    const isValid = encryption.validatePassword(password, userRow.hash, userRow.salt);

    if (!isValid) return res.json({ message: `Password is incorrect.`, isAuthenticated: false });

    req.session.user = { email, id: userRow.id };

    return res.json({ message: 'Signed in!', isAuthenticated: true });
  });
}

const authenticationResetPassword = (req, res, next) => {
  const { email, password } = req.body;

  pool.query(`SELECT * FROM game_user WHERE email='${email}'`, async (error, result) => {
    if (error) console.log(error);

    const userRow = result.rows[0];

    if (!userRow) return res.json({ message: `No account found with email ${email}.`, isPasswordReset: false });

    const encryptedPassword = await encryption.generatePassword(password);
    const salt = encryptedPassword.salt;
    const hash = encryptedPassword.hash;

    pool.query(`UPDATE game_user SET salt='${salt}', hash='${hash}' WHERE email='${email}'`, (error, result) => {
      if (error) console.log(error);

      return res.json({ message: 'Reset password!', isPasswordReset: true });
    });
  });
}

const authenticationSignOut = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log(error);

    return res.json({ message: 'Signed out!', isAuthenticated: false });
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