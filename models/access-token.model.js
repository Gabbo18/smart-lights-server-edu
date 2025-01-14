'use strict';

const mongoose = require('mongoose');

const collectionName = 'access-tokens';
const modelName = 'AccessToken';

const schema = new mongoose.Schema({
    token: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expires: { type: Date, required: true }
}, {
    timestamps: true,
    collection: collectionName
}).index({ token: 1 }, { unique: true }).index({ user: 1 });

const model = mongoose.model(modelName, schema);

module.exports = model;