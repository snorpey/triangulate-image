// https://github.com/Automattic/node-canvas#imagesrcbuffer
'use strict';

var Canvas = require('canvas-browserify');
var Image = Canvas.Image;

module.exports = function (buffer) {
	var image = new Image();
	image.src = buffer;

	var canvas = new Canvas(image.width, image.height);
	var ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	return ctx.getImageData(0, 0, canvas.width, canvas.height);
};