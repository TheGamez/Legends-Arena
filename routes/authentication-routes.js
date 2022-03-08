/* LIBRARIES */

const express = require('express');

/* UTILS */

const authentication = require('../utils/authentication');

/* CONTROLLERS */

const authenticationController = require('../controllers/authentication-controller');

/* ROUTES */

const router = express.Router();

router.post('/create-account', authenticationController.authenticationCreateAccount);
router.post('/sign-in', authenticationController.authenticationSignIn);
router.put('/reset-password', authenticationController.authenticationResetPassword);
router.delete('/sign-out', authenticationController.authenticationSignOut);
router.all('*', authenticationController.authentication404NotFound);

module.exports = router;