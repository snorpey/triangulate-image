import makeCanvasAndContext from '../util/makeCanvasAndContext';
import drawPolygonsOnContext from '../util/drawPolygonsOnContext';

export default (polygons, size, options) => {
	const dpr = options && options.dpr ? options.dpr : 1;
	const canvasData = makeCanvasAndContext(size, options, dpr);

	drawPolygonsOnContext(canvasData.ctx, polygons, size, dpr);

	return canvasData.canvas.toDataURL();
};
