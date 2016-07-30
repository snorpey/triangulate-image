'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (color) {
	var size = 1; // single pixel
	var ctx = (0, _makeCanvasAndContext2.default)({ width: size, height: size }, {}, 1, true).ctx;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, size, size);

	// Read the pixel, and get RGBA values
	var data = ctx.getImageData(0, 0, size, size).data;
	return {
		r: data[0],
		g: data[1],
		b: data[2],
		a: data[3] / 255 // For alpha we scale to 0..1 float
	};
};

var _makeCanvasAndContext = require('./makeCanvasAndContext');

var _makeCanvasAndContext2 = _interopRequireDefault(_makeCanvasAndContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Transform CSS color definition to RGBA
 * @param  {String} color CSS color (name,HSL,RGB,HEX..)
 * @return {Object}       RGBA color object
 */