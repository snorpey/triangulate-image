"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;

	return Math.sqrt(dx * dx + dy * dy);
};

module.exports = exports['default'];