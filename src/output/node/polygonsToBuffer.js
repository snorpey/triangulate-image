import Canvas from 'canvas-browserify';
import drawPolygonsOnContext from '../../util/drawPolygonsOnContext';

// https://github.com/Automattic/node-canvas#pdf-support
let allowedFormats = [ 'svg', 'pdf' ];

export default function ( polygons, size, options ) {
	let canvas;
	let format = options && options.format ? options.format : false;
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