// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream
var Canvas = require( 'canvas-browserify');
var drawPolygonsOnContext = require('../util/drawPolygonsOnContext.js');

module.exports = function ( polygons, size, options ) {	
	options = options || { };
	
	let dpr = options.dpr || 1;

	let streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	let backgroundColor = options.backgroundColor || '#ffffff';
	let canvas = new Canvas( size.width * dpr, size.height * dpr );
	let ctx = canvas.getContext( '2d' );

	ctx.fillStyle = backgroundColor;
	ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
	ctx.fillStyle = 'transparent';

	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return canvas.jpegStream( streamParams );
}