'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (polygons, size, options) {
	options = options || {};

	var dpr = options.dpr || 1;

	var streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	var backgroundColor = options.backgroundColor || '#ffffff';
	var canvas = new _canvasBrowserify2.default(size.width * dpr, size.height * dpr);
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
	ctx.fillStyle = 'transparent';

	(0, _drawPolygonsOnContext2.default)(ctx, polygons, size, dpr);

	return canvas.jpegStream(streamParams);
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

var _drawPolygonsOnContext = require('../../util/drawPolygonsOnContext');

var _drawPolygonsOnContext2 = _interopRequireDefault(_drawPolygonsOnContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default']; // https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream