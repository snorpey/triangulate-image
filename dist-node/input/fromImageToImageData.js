'use strict';

var Canvas = require('canvas-browserify');
var Image = Canvas.Image;

module.exports = function (image) {
	if (image instanceof HTMLImageElement) {
		// http://stackoverflow.com/a/3016076/229189
		if (image.naturalWidth === 0 || image.naturalHeight === 0 || image.complete === false) {
			throw new Error("This this image hasn't finished loading: " + image.src);
		}

		var canvas = new Canvas(image.naturalWidth, image.naturalHeight);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	} else {
		throw new Error('This object does not seem to be an image.');
		return;
	}
};