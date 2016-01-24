"use strict";

function greyscale(imageData) {
	var len = imageData.data.length;
	var data = imageData.data;
	var brightness = undefined;

	for (var i = 0; i < len; i += 4) {
		brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

		data[i] = brightness;
		data[i + 1] = brightness;
		data[i + 2] = brightness;
	}

	imageData.data = data;

	return imageData;
}

module.exports = greyscale;