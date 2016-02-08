"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (points) {
	var xMin = Infinity;
	var xMax = -Infinity;
	var yMin = Infinity;
	var yMax = -Infinity;

	points.forEach(function (p) {
		if (p.x < xMin) {
			xMin = p.x;
		}

		if (p.y < yMin) {
			yMin = p.y;
		}

		if (p.x > xMax) {
			xMax = p.x;
		}

		if (p.y > yMax) {
			yMax = p.y;
		}
	});

	return {
		x: xMin,
		y: yMin,
		width: xMax - xMin,
		height: yMax - yMin
	};
};

module.exports = exports['default'];