'use strict';

var Canvas = require('canvas-browserify');

module.exports = function (image) {
	var canvas = new Canvas(image.naturalWidth, image.naturalHeight);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	return ctx.getImageData(0, 0, canvas.width, canvas.height);
};