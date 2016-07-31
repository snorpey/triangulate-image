"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (color) {
  return color.a === 0;
};

module.exports = exports["default"]; /**
                                      * Is color transparent ?
                                      * @param  {Object} color Color object
                                      * @return {Boolean}      Is transparent?
                                      */