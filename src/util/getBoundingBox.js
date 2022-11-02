export default points => {
	let xMin = Infinity;
	let xMax = -Infinity;
	let yMin = Infinity;
	let yMax = -Infinity;

	points.forEach(p => {
		if (p.x < xMin) {
			xMin = p.x;
		}

		if (p.y < yMin) {
			yMin = p.y;
		}

		if (p.x > xMax) {
			xMax = p.x;
		}

		if (p.y > yMax) {
			yMax = p.y;
		}
	});

	return {
		x: xMin,
		y: yMin,
		width: xMax - xMin,
		height: yMax - yMin,
	};
};
