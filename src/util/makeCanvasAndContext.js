import Canvas from './canvas.js';

export default (size, options, dpr, format) => {
	const backgroundColor =
		options && options.backgroundColor ? options.backgroundColor : false;
	const canvas = new Canvas(size.width * dpr, size.height * dpr, format);
	const ctx = canvas.getContext('2d');

	if (backgroundColor) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, size.width * dpr, size.height * dpr);
		ctx.fillStyle = 'transparent';
	}

	return {
		canvas: canvas,
		ctx: ctx,
	};
};
