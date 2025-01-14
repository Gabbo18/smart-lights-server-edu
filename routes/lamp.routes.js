'use strict';

const express = require('express');
const router = express.Router();

const lampController = require('../controllers/lamp.controller');
const isAuthMiddleware = require('../middlewares/is-auth.middleware');

router.use(isAuthMiddleware);

router.route('/:id/off').patch((req, _, next) => { req.body = { isOn: true }; return next(); }, lampController.updateLamp);
router.route('/:id/on').patch((req, _, next) => { req.body = { isOn: true }; return next(); }, lampController.updateLamp);
router.route('/:id/claim').patch(lampController.claimLamp);
router.route('/:id/release').patch(lampController.releaseLamp);
router.route('/:id').get(lampController.getLamp).patch(lampController.updateLamp);
router.route('/').get(lampController.getLamps);

module.exports = router;