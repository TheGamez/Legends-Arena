/* LIBRARIES */

const express = require('express');

/* UTILS */

const authentication = require('../utils/authentication');

/* CONTROLLERS */

const userController = require('../controllers/user-controller');

/* ROUTES */

const router = express.Router();

router.all('*', userController.user404NotFound);

module.exports = router;