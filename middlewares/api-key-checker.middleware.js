'use strict';

const HttpError = require("../errors/http-error");

const allowedPaths = ['/', '/api', '/api/status'];
const apiKeyHeader = 'x-api-key';

module.exports = async (req, _, next) => {
    const apiKey = req.headers[apiKeyHeader] || 'NO-API-KEY';
    if (allowedPaths.includes(req.originalUrl) || process.env.API_KEY === apiKey) return next();
    return next(new HttpError(423, 'Attenzione: richiesta bloccata', 'Il tuo progetto non risulta abilitato'));
};