import Canvas from 'canvas-browserify';
import drawPolygonsOnContext from '../util/drawPolygonsOnContext';

export default function ( polygons, size, options ) {
	let dpr = options && options.dpr ? options.dpr : 1;
	let backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	let canvas = new Canvas( size.width * dpr, size.height * dpr );
	let ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}
	
	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return ctx.getImageData( 0, 0, size.width * dpr, size.height * dpr );
}