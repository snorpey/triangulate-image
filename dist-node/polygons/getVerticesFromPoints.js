'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilClamp = require('../util/clamp');

var _utilClamp2 = _interopRequireDefault(_utilClamp);

function sortByArea(a, b) {
	return a.x * a.y - b.y * b.x;
}

// most parts taken from akm2's script:
// http://jsdo.it/akm2/xoYx (line 230++)

exports['default'] = function (points, maxPointCount, accuracy, width, height) {
	var result = [];
	var sidePointCount = Math.ceil(width / (100 - accuracy)) * 2 + Math.ceil(height / (100 - accuracy)) * 2 + 2;
	var pointCount = Math.max(points.length, maxPointCount);
	var randomPointCount = (0, _utilClamp2['default'])(pointCount - sidePointCount, 0, maxPointCount - sidePointCount);
	var increment = pointCount / randomPointCount;

	var i = 0;
	var x = 0;
	var y = 0;
	var len = 0;

	// sort the points array so that it looks like randomly shuffled
	// (it's not really random, because we want to be able to test the resulting images)
	points.sort(sortByArea);

	for (i = 0, len = pointCount; i < len; i += increment) {
		result.push({ x: points[~ ~i].x, y: points[~ ~i].y });
	}

	// add more points along the edges so we always use the full canvas,
	for (x = 0; x < width; x += 100 - accuracy) {
		result.push({ x: ~ ~x, y: 0 });
		result.push({ x: ~ ~x, y: height });
	}

	for (y = 0; y < height; y += 100 - accuracy) {
		result.push({ x: 0, y: ~ ~y });
		result.push({ x: width, y: ~ ~y });
	}

	result.push({ x: 0, y: height });
	result.push({ x: width, y: height });

	points = null;

	return result;
};

module.exports = exports['default'];