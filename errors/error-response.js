'use strict';

const debugMode = false;

module.exports = (error, req, res) => {
    if (!error.code) error = { code: 418, name: '', message: error };
    if (debugMode) console.log("\n" + "| ERROR | - " + error.code + ": " + req.originalUrl + "\n\t Name: " + (error.name || "Unexpected Error") + "\n\t Message: " + error.message + "\n\n");
    const errore = {
        code: error.code || 418,
        title: error.name || "Unexpected Error",
        message: (error.message) ? error.message.toString().trim() : "Message not available",
        details: (error.details) ? error.details.toString().trim() : undefined
    };
    res.set('Content-Type', 'application/json');
    return res.status(error.code).json({
        success: false,
        request: { method: req.method, url: req.originalUrl },
        error: errore
    }).end();
};