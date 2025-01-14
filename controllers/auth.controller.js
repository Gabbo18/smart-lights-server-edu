'use strict';

const AccessTokenModel = require('../models/access-token.model');
const HttpError = require('../errors/http-error');
const UserModel = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

exports.register = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente prima di inserire i dati!
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password) return next(new HttpError(400, 'Email e password sono obbligatorie'));

        const user = await UserModel.findOne({
            email: { $eq: email.toString().trim().toLowerCase() }
        });
        if (!!user) return next(new HttpError(400, 'Email già registrata, prova ad accedere'));

        const hashedPassword = await bcrypt.hash(password.toString(), 12);

        const newUser = new UserModel({
            email: email.toString().trim().toLowerCase(),
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        await newUser.save();

        return res.status(201).json({ success: true, data: 'Created' }).end();
    } catch (error) {
        console.error("Error in register:", error);
        return next(error);
    };
};

exports.login = async (req, res, next) => {
    try {
        const defaultErrorMessage401 = 'Credenziali non valide, verifica i dati inseriti e riprova';

        const { email, password } = req.body;
        if (!email || !password) return next(new HttpError(400, 'Email e password sono obbligatorie'));

        let user = await UserModel.findOne({
            email: { $eq: email.toString().trim().toLowerCase() }
        }).select('+password').lean();

        if (!!!user) return next(new HttpError(401, defaultErrorMessage401));

        const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
        if (isPasswordValid != true) return next(new HttpError(401, defaultErrorMessage401));
        delete user.password;

        const accessToken = jwt.sign({
            id: user._id.toString().trim(),
            email: user.email,
            uuid: uuid.v4(),
        }, process.env.JWT_SECRET, {
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: '1y',
        });

        await AccessTokenModel.create({
            token: accessToken,
            user: user._id,
            expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN_MS))
        });

        return res.status(200).json({
            success: true,
            data: {
                user,
                token: {
                    type: 'Bearer',
                    value: accessToken,
                    //TODO: Implementare la rotazione con scadenza corretta dei token
                    info: 'ATTENZIONE: Il server è solo per utilizzo didattico i token non prevedono rotazione e scadenza.',
                }
            }
        }).end();
    } catch (error) {
        console.error("Error in login:", error);
        return next(error);
    };
};

exports.logout = async (req, res, next) => {
    try {
        await AccessTokenModel.findOneAndDelete({ token: { $eq: req.token.jwt } });
        return res.status(204).json({ success: true, data: "Deleted" }).end();
    } catch (error) {
        console.error("Error in logout:", error);
        return next(error);
    };
};