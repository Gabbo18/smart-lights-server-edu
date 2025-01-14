'use strict';

const mongoose = require('mongoose');

const collectionName = 'users';
const modelName = 'User';

const schema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: false, trim: true, },
    lastName: { type: String, required: false, trim: true, },
    nickname: { type: String, required: false, trim: true, },
}, {
    timestamps: true,
    collection: collectionName,
}).index({ email: 1 }, { unique: true });

const model = mongoose.model(modelName, schema);

module.exports = model;