"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Transform color object to rgb/a
                                                                                                                                                                                                                                                                   * @param  {Object} colorObj RGB(A) color object
                                                                                                                                                                                                                                                                   * @return {String}       	 rgba css string
                                                                                                                                                                                                                                                                   */


exports.default = function (colorObj) {
  var c = _extends({ a: 1 }, colorObj); // rgb-to-rgba:  alpha is optionally set to 1
  return "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
};

module.exports = exports["default"];