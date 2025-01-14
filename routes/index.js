'use strict';

const express = require("express");
const router = express.Router();

const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const lampRoutes = require('./lamp.routes.js');

const moment = require("moment-timezone");
const getCurrentDate = () => new moment().tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');

router.use(["/lamp", "/lamps"], lampRoutes);
router.use(["/user", "/users"], userRoutes);
router.use("/auth", authRoutes);

router.use("/status", (_, res) => res.status(200).json({
    success: true,
    server: process.env.SERVER_NAME
}).end());

router.use("/", (_, res) => res.status(200).json({
    success: true,
    data: {
        env: process.env.NODE_ENV.toUpperCase(),
        server: process.env.SERVER_NAME,
        date: getCurrentDate(),
        tz: process.env.TZ
    }
}).end());

module.exports = router;