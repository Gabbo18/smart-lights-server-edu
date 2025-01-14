'use strict';

const mongoose = require('mongoose');

const collectionName = 'lamps';
const modelName = 'Lamp';

const schema = new mongoose.Schema({
    name: { type: String, trim: true },
    device: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    productId: { type: String, trim: true },
    brightness: { type: Number, required: true, min: 0, max: 100, default: 100, },
    energySavingMode: { type: Boolean, required: true, default: false },
    isOn: { type: Boolean, required: true, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    collection: collectionName
}).index({ device: 1, manufacturer: 1 });

const model = mongoose.model(modelName, schema);

module.exports = model;