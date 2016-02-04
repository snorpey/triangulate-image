'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = getColorByPos;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

function getColorByPos(pos, colorData) {
	var x = (0, _clamp2['default'])(pos.x, 1, colorData.width - 2);
	var y = (0, _clamp2['default'])(pos.y, 1, colorData.height - 2);
	var index = (x | 0) + (y | 0) * colorData.width << 2;

	if (index >= colorData.data.length) {
		index = colorData.data.length - 5;
	}

	return {
		r: colorData.data[index],
		g: colorData.data[index + 1],
		b: colorData.data[index + 2]
	};
}

module.exports = exports['default'];