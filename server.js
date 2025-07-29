'use strict';
require('dotenv').config();

const responseTime = require('response-time');
const compression = require('compression');
const favicon = require("serve-favicon");
const mongoose = require('mongoose');
const path = require('path');

const express = require('express');
const app = express();

app.locals.settings['x-powered-by'] = false;

app.use(responseTime());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'), { maxAge: '14 days' }));
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

const cors = require('cors');
app.use(cors({ origin: '*', credentials: true }));

const apiKeyChecker = require("./middlewares/api-key-checker.middleware");
app.use(apiKeyChecker);

const apiRoutes = require('./routes');
app.use("/api", apiRoutes);

const errorResponse = require("./errors/error-response");
app.use((error, req, res, _) => errorResponse(error, req, res));

app.on('ready', async () => {
    // await require("./sample/importer").lamps();
    app.listen(process.env.PORT, () => console.log('[√] Server is running on port 3000'));
});

mongoose.connect(
    process.env.NODE_ENV === 'production' ? process.env.DB_PROD : process.env.DB_DEV
).then(() => {
    console.log(`[√] Connected to MongoDB: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} URL`);
    app.emit('ready');
}).catch(console.error);
