'use strict';

const HttpError = require("../errors/http-error");
const jwt = require("jsonwebtoken");

const errorMessage401 = "Non sei autenticato, esegui l'accesso con le tue credenziali e riprova.";
const authHeader = "authorization";

module.exports = async (req, _, next) => {
    try {
        if (!req.headers[authHeader]) return next(new HttpError(401, errorMessage401));
        const accessToken = req.headers[authHeader].split(" ")[1].toString().trim();
        const tokenData = jwt.verify(accessToken, process.env.JWT_SECRET, {
            algorithms: process.env.JWT_ALGORITHM,
            complete: false
        });
        req.token = Object.assign({ jwt: accessToken }, tokenData);
        return next();
    } catch (error) {
        console.error("Error in isAuth:", error);
        const expMsg = "jwt expired";
        return next(new HttpError(401, errorMessage401, (error.message === expMsg) ? expMsg : undefined));
    };
};