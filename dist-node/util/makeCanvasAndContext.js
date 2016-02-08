'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (size, options, dpr, format) {
	var backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	var canvas = new _canvasBrowserify2.default(size.width * dpr, size.height * dpr, format);
	var ctx = canvas.getContext('2d');

	if (backgroundColor) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
		ctx.fillStyle = 'transparent';
	}

	return {
		canvas: canvas,
		ctx: ctx
	};
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];