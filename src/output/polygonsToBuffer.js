var Canvas = require( 'canvas-browserify');
var drawPolygonsOnContext = require('../util/drawPolygonsOnContext.js');

// https://github.com/Automattic/node-canvas#pdf-support
let allowedFormats = [ 'svg', 'pdf' ];

module.exports = function ( polygons, size, options ) {
	var canvas;
	var format = options && options.format ? options.format : false;
	let dpr = options && options.dpr ? options.dpr : 1;
	let backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;

	if ( allowedFormats[format] !== -1 ){
		canvas = new Canvas( size.width * dpr, size.height * dpr, format );
	} else {
		canvas = new Canvas( size.width * dpr, size.height * dpr );
	}

	let ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}
	
	drawPolygonsOnContext( ctx, polygons, size );

	return canvas.toBuffer();
}