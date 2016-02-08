import makeCanvasAndContext from '../util/makeCanvasAndContext';
import drawPolygonsOnContext from '../util/drawPolygonsOnContext';

export default function ( polygons, size, options ) {
	let dpr = options && options.dpr ? options.dpr : 1;	
	let canvasData = makeCanvasAndContext( size, options, dpr );

	drawPolygonsOnContext( canvasData.ctx, polygons, size, dpr );

	return canvasData.canvas.toDataURL();
}