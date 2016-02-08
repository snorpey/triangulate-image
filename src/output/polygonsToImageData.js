import makeCanvasAndContext from '../util/makeCanvasAndContext';
import drawPolygonsOnContext from '../util/drawPolygonsOnContext';

export default function ( polygons, size, options ) {
	let dpr = options && options.dpr ? options.dpr : 1;	
	let ctx = makeCanvasAndContext( size, options, dpr, true ).ctx;
	
	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return ctx.getImageData( 0, 0, size.width * dpr, size.height * dpr );
}