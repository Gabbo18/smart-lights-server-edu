'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const lampController = require('../controllers/lamp.controller');
const isAuthMiddleware = require('../middlewares/is-auth.middleware');

router.use(isAuthMiddleware);

router.route('/lamps').get((req, _, next) => { req.query.mine = true; return next(); }, lampController.getLamps);
router.route('/')
    .get(userController.getProfile)
    .patch(userController.updateProfile)
    .delete(userController.deleteProfile);

module.exports = router;