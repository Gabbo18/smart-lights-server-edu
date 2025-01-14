'use strict';

const LampModel = require('../models/lamp.model');
const HttpError = require('../errors/http-error');

exports.getLamps = async (req, res, next) => {
    try {
        // Query params
        const {
            mine,
            isOn,
            brightnessMin,
            brightnessMax,
            saving,
            txt
        } = req.query;
        // Query construction
        const query = {
            owner: { $exists: false },
            brightness: { $gte: Number(brightnessMin || 0), $lte: Number(brightnessMax || 100) }
        };
        if (['true', 'false'].includes((isOn || '').trim())) {
            query.isOn = isOn.trim() === 'true';
        };
        if (['true', 'false'].includes((saving || '').trim())) {
            query.energySavingMode = saving.trim() === 'true';
        };
        if (req.token?.id && (mine || '').toString().trim() === 'true') {
            query.owner = req.token.id.toString().trim();
        };
        // Text search
        if (txt?.trim()) {
            query.$or = [
                { name: { $regex: txt.trim(), $options: 'i' } },
                { device: { $regex: txt.trim(), $options: 'i' } },
                { manufacturer: { $regex: txt.trim(), $options: 'i' } },
                { productId: { $regex: txt.trim(), $options: 'i' } }
            ];
        };
        // Query execution
        const lamps = await LampModel.find(query).sort({ device: 1, manufacturer: 1 }).select('-owner').lean();
        if (!lamps.length) return next(new HttpError(404, 'Lamps not found'));
        // Response
        return res.status(200).json({ success: true, data: lamps }).end();
    } catch (error) {
        console.error("Error in getLampsListing:", error);
        return next(error);
    };
};

exports.getLamp = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente!
        const lamp = await LampModel.findById(req.params.id.toString().trim()).select({ owner: 0 }).lean();
        if (!lamp) return next(new HttpError(404, 'Lamp not found'));
        return res.status(200).json({ success: true, data: lamp }).end();
    } catch (error) {
        console.error("Error in getLamp:", error);
        return next(error);
    };
};

exports.claimLamp = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente!

        const check = await LampModel.countDocuments(req.params.id);
        if (check === 0) return next(new HttpError(404, 'Lamp not found'));

        const lamp = await LampModel.findOneAndUpdate({
            _id: req.params.id, owner: { $exists: false }
        }, { owner: req.token.id.toString().trim() }, { new: true }).lean();

        if (!!!lamp) return next(new HttpError(403, 'Lamp has already an owner'));

        return res.status(200).json({ success: true, data: lamp }).end();
    } catch (error) {
        console.error("Error in claimLamp:", error);
        return next(error);
    };
};

exports.updateLamp = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente prima di aggiornare i dati!
        const lamp = await LampModel.findById(req.params.id);
        if (!lamp) return next(new HttpError(404, 'Lamp not found'));
        if ((lamp.owner || '').toString() !== req.token.id) return next(new HttpError(403, 'Per aggiornare i dati devi essere il proprietario'));
        // Update
        const { name, brightness, energySavingMode, isOn } = req.body;
        if (name) lamp.name = name.toString().trim();
        if (brightness) lamp.brightness = Number(brightness);
        if (['true', 'false'].includes(isOn?.toString().trim())) lamp.isOn = isOn === true;
        if (['true', 'false'].includes(energySavingMode?.toString().trim())) {
            lamp.energySavingMode = energySavingMode === true;
        };
        // Save
        await lamp.save();
        return res.status(200).json({ success: true, data: lamp }).end();
    } catch (error) {
        console.error("Error in updateLamp:", error);
        return next(error);
    };
};

exports.releaseLamp = async (req, res, next) => {
    try {
        //FIXME: ATTENZIONE: Bisognerebbe sempre validare l'input dell'utente!

        let lamp = await LampModel.findOneAndUpdate({
            _id: req.params.id.toString().trim(), owner: req.token.id.toString().trim()
        }, { $unset: { owner: '', name: '' }, $set: { isOn: false } }, { new: true }).lean();
        if (!!!lamp) return next(new HttpError(404, 'Lamp not found or not owned by you'));
        delete lamp.owner;

        return res.status(200).json({ success: true, data: lamp }).end();
    } catch (error) {
        console.error("Error in releaseLamp:", error);
        return next(error);
    };
};