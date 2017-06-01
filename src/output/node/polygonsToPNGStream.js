// https://github.com/Automattic/node-canvas#canvaspngstream
import Canvas from '../../util/canvas.js';
import drawPolygonsOnContext from '../../util/drawPolygonsOnContext';

export default ( polygons, size, options ) => {
	const dpr = options && options.dpr ? options.dpr : 1;
	const backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	const canvas = new Canvas( size.width * dpr, size.height * dpr );
	const ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}
	
	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return canvas.pngStream();
}