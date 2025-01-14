'use strict';

const AccessTokenModel = require('../models/access-token.model');
const UserModel = require('../models/user.model');
const LampModel = require('../models/lamp.model');
const HttpError = require('../errors/http-error');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.token.id);
        if (!user) return next(new HttpError(404, 'Utente non trovato'));
        return res.status(200).json({ success: true, data: user }).end();
    } catch (error) {
        console.error("Error in getProfile:", error);
        return next(error);
    };
};

exports.updateProfile = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente prima di aggiornare i dati!
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) return next(new HttpError(400, 'Nome e cognome sono obbligatori'));

        const user = await UserModel.findById(req.token.id);
        if (!user) return next(new HttpError(404, 'Utente non trovato'));

        user.firstName = firstName;
        user.lastName = lastName;
        if (req.body.nickname) {
            user.nickname = req.body.nickname?.toString()?.trim();
        };

        await user.save();

        return res.status(200).json({ success: true, data: user }).end();
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return next(error);
    };
};

exports.deleteProfile = async (req, res, next) => {
    try {
        await LampModel.updateMany({ owner: req.token.id }, { $unset: { owner: '', name: '' }, $set: { isOn: false } });
        await AccessTokenModel.deleteMany({ user: req.token.id });
        await UserModel.findOneAndDelete({ _id: req.token.id });

        return res.status(204).json({ success: true, data: "Deleted" }).end();
    } catch (error) {
        console.error("Error in deleteProfile:", error);
        return next(error);
    };
};