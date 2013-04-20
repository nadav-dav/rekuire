"use strict";

module.exports = isString;

function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}
