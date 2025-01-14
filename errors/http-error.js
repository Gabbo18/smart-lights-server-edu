'use strict';

const getTitleFromStatusCode = require("./error-titles");

// HttpError class
class HttpError extends Error {
    constructor(code, message, details = undefined) {
        super((message || "NO_MESSAGE").toString().trim());
        this.name = getTitleFromStatusCode(code);
        this.details = details
        this.code = code;
    };

    print() {
        console.log(`• HTTP-ERROR | Code: ${this.code} • Title: ${this.name} • Message: ${this.message}`);
    };

    toString() {
        return `Code: ${this.code} • Title: ${this.name} • Message: ${this.message}`;
    };

    toJSON() {
        return {
            code: this.code,
            name: this.name,
            message: this.message
        };
    };
};

module.exports = HttpError;