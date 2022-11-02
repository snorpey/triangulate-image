// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream
import Canvas from '../../util/canvas.js';
import drawPolygonsOnContext from '../../util/drawPolygonsOnContext';

export default (polygons, size, options) => {
	options = options || {};

	const dpr = options.dpr || 1;

	const streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false,
	};

	const backgroundColor = options.backgroundColor || '#ffffff';
	const canvas = new Canvas(size.width * dpr, size.height * dpr);
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
	ctx.fillStyle = 'transparent';

	drawPolygonsOnContext(ctx, polygons, size, dpr);

	return canvas.jpegStream(streamParams);
};
