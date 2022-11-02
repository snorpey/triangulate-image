// most parts taken from http://jsdo.it/akm2/xoYx
// (starting line 293++)
export default (imageData, threshold) => {
	// only check every 2nd pixel in imageData to save some time.
	const multiplier = 2;
	const width = imageData.width;
	const height = imageData.height;
	const data = imageData.data;
	const points = [];
	var x, y, row, col, sx, sy, step, sum, total;

	for (y = 0; y < height; y += multiplier) {
		for (x = 0; x < width; x += multiplier) {
			sum = total = 0;

			for (row = -1; row <= 1; row++) {
				sy = y + row;
				step = sy * width;

				if (sy >= 0 && sy < height) {
					for (col = -1; col <= 1; col++) {
						sx = x + col;

						if (sx >= 0 && sx < width) {
							sum += data[(sx + step) << 2];
							total++;
						}
					}
				}
			}

			if (total) {
				sum /= total;
			}

			if (sum > threshold) {
				points.push({ x: x, y: y });
			}
		}
	}

	return points;
};
