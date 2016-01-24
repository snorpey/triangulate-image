// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream
'use strict';

var Canvas = require('canvas-browserify');
var drawPolygonsOnContext = require('../util/drawPolygonsOnContext.js');

module.exports = function (polygons, size, options) {
	options = options || {};

	var dpr = options.dpr || 1;

	var streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	var backgroundColor = options.backgroundColor || '#ffffff';
	var canvas = new Canvas(size.width * dpr, size.height * dpr);
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
	ctx.fillStyle = 'transparent';

	drawPolygonsOnContext(ctx, polygons, size, dpr);

	return canvas.jpegStream(streamParams);
};