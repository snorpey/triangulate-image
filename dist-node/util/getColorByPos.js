'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getColorByPos;

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get color object by position
 * @param  {Object} pos         {x,y} object
 * @param  {Object} colorData   Image color data object
 * @param  {Object} [transparentColor] (optional) RGBA color object. Used to set specific color to transparent pixels
 * @return {Object}             RGBA color object
 */
function getColorByPos(pos, colorData, transparentColor) {
	var x = (0, _clamp2.default)(pos.x, 1, colorData.width - 2);
	var y = (0, _clamp2.default)(pos.y, 1, colorData.height - 2);
	var index = (x | 0) + (y | 0) * colorData.width << 2;

	if (index >= colorData.data.length) {
		index = colorData.data.length - 5;
	}

	var alpha = colorData.data[index + 3] / 255;

	// Return RGBA color object
	return transparentColor && alpha === 0 ? transparentColor : {
		r: colorData.data[index],
		g: colorData.data[index + 1],
		b: colorData.data[index + 2],
		a: alpha
	};
}
module.exports = exports['default'];