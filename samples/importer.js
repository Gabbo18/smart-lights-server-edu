'use strict';

const LampModel = require('../models/lamp.model');
const path = require("path");
const fs = require("fs");

exports.lamps = async () => {
    const check = await LampModel.countDocuments();
    if (check !== 0) return console.error(`ATTENZIONE: la collezione delle lampade non è vuota! (Documenti: ${check})`);

    const lampPath = path.join(__dirname, 'lamps.json');
    const data = fs.readFileSync(lampPath, 'utf-8');
    const jsonList = JSON.parse(data);
    const lamps = await LampModel.insertMany(jsonList);

    console.info(`Sono stati inseriti ${lamps.length} elementi`);
};