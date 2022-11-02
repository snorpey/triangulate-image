import makeCanvasAndContext from '../../util/makeCanvasAndContext';
import drawPolygonsOnContext from '../../util/drawPolygonsOnContext';

// https://github.com/Automattic/node-canvas#pdf-support
const allowedFormats = ['svg', 'pdf'];

export default (polygons, size, options) => {
	const dpr = options && options.dpr ? options.dpr : 1;
	let format = options && options.format ? options.format : false;

	format = allowedFormats.indexOf(format) === -1 ? undefined : format;

	const canvasData = makeCanvasAndContext(size, options, dpr, format);

	drawPolygonsOnContext(canvasData.ctx, polygons, size);

	return canvasData.canvas.toBuffer();
};
