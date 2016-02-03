// https://github.com/Automattic/node-canvas#canvaspngstream
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

var _utilDrawPolygonsOnContext = require('../../util/drawPolygonsOnContext');

var _utilDrawPolygonsOnContext2 = _interopRequireDefault(_utilDrawPolygonsOnContext);

exports['default'] = function (polygons, size, options) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	var canvas = new _canvasBrowserify2['default'](size.width * dpr, size.height * dpr);
	var ctx = canvas.getContext('2d');

	if (backgroundColor) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
		ctx.fillStyle = 'transparent';
	}

	(0, _utilDrawPolygonsOnContext2['default'])(ctx, polygons, size, dpr);

	return canvas.pngStream();
};

module.exports = exports['default'];