"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (color) {
	var a = [color.r, color.g, color.b].map(function (v) {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});

	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

module.exports = exports['default']; //  http://stackoverflow.com/a/9733420/229189