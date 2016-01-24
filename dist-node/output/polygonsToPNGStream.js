// https://github.com/Automattic/node-canvas#canvaspngstream
'use strict';

var Canvas = require('canvas-browserify');
var drawPolygonsOnContext = require('../util/drawPolygonsOnContext.js');

module.exports = function (polygons, size, options) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	var canvas = new Canvas(size.width * dpr, size.height * dpr);
	var ctx = canvas.getContext('2d');

	if (backgroundColor) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
		ctx.fillStyle = 'transparent';
	}

	drawPolygonsOnContext(ctx, polygons, size, dpr);

	return canvas.pngStream();
};