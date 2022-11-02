import makeCanvasAndContext from './makeCanvasAndContext';

/**
 * Transform CSS color definition to RGBA
 * @param  {String} color CSS color (name,HSL,RGB,HEX..)
 * @return {Object}       RGBA color object
 */
export default color => {
	const size = 1; // single pixel
	const ctx = makeCanvasAndContext(
		{ width: size, height: size },
		{},
		1,
		true
	).ctx;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, size, size);

	// Read the pixel, and get RGBA values
	const data = ctx.getImageData(0, 0, size, size).data;

	return {
		r: data[0],
		g: data[1],
		b: data[2],
		a: data[3] / 255, // For alpha we scale to 0..1 float
	};
};
