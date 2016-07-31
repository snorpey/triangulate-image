import makeCanvasAndContext from '../../util/makeCanvasAndContext';
import drawPolygonsOnContext from '../../util/drawPolygonsOnContext';

// https://github.com/Automattic/node-canvas#pdf-support
let allowedFormats = [ 'svg', 'pdf' ];

export default function ( polygons, size, options ) {
	let dpr = options && options.dpr ? options.dpr : 1;
	let format = options && options.format ? options.format : false;
	
	format = allowedFormats.indexOf( format ) === -1 ? undefined : format;
	
	let canvasData = makeCanvasAndContext( size, options, dpr, format );
	
	drawPolygonsOnContext( canvasData.ctx, polygons, size );

	return canvasData.canvas.toBuffer();
}