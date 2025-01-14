'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const isAuthMiddleware = require('../middlewares/is-auth.middleware');

router.post('/register', authController.register);

router.post('/login', authController.login);
router.post('/logout', isAuthMiddleware, authController.logout);

module.exports = router;