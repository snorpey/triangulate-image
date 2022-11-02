import toRGBA from './toRGBA';

export default (ctx, polygons, size, dpr) => {
	dpr = dpr || 1;

	polygons.forEach(function (polygon, index) {
		ctx.beginPath();
		ctx.moveTo(polygon.a.x * dpr, polygon.a.y * dpr);
		ctx.lineTo(polygon.b.x * dpr, polygon.b.y * dpr);
		ctx.lineTo(polygon.c.x * dpr, polygon.c.y * dpr);
		ctx.lineTo(polygon.a.x * dpr, polygon.a.y * dpr);

		// http://weblogs.asp.net/dwahlin/rendering-linear-gradients-using-the-html5-canvas
		if (polygon.gradient) {
			const gradient = ctx.createLinearGradient(
				polygon.gradient.x1 * dpr,
				polygon.gradient.y1 * dpr,
				polygon.gradient.x2 * dpr,
				polygon.gradient.y2 * dpr
			);

			const lastColorIndex = polygon.gradient.colors.length - 1;

			polygon.gradient.colors.forEach((color, index) => {
				const rgba = toRGBA(color);
				gradient.addColorStop(index / lastColorIndex, rgba);
			});

			ctx.fillStyle = gradient;
			ctx.fill();

			if (polygon.strokeWidth > 0) {
				ctx.strokeStyle = gradient;
				ctx.lineWidth = polygon.strokeWidth * dpr;
				ctx.lineJoin = polygon.lineJoin;
				ctx.stroke();
			}
		} else {
			if (polygon.fill) {
				ctx.fillStyle = toRGBA(polygon.fill);
				ctx.fill();
			}

			if (polygon.strokeColor) {
				ctx.strokeStyle = toRGBA(polygon.strokeColor);
				ctx.lineWidth = polygon.strokeWidth * dpr;
				ctx.lineJoin = polygon.lineJoin;
				ctx.stroke();
			}
		}

		ctx.closePath();
	});

	return ctx;
};
