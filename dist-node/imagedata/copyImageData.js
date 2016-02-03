'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

exports['default'] = function (imageData) {
	// this is mainly required to run the browser tests.
	// phantomjs < v2 doesn't understand Uint8ClampedArray
	if (typeof Uint8ClampedArray === 'undefined') {
		if (typeof window === 'undefined') {
			//
			throw new Error("Can't copy imageData in Webworker without Uint8ClampedArray support.");
			return imageData;
		}

		// http://stackoverflow.com/a/11918126/229189
		var canvas = (0, _canvasBrowserify2['default'])(imageData.width, imageData.height);
		var ctx = canvas.getContext('2d');
		ctx.putImageData(imageData, 0, 0);

		return ctx.getImageData(0, 0, imageData.width, imageData.height);
	} else {
		// http://stackoverflow.com/a/15238036/229189
		return {
			width: imageData.width,
			height: imageData.height,
			data: new Uint8ClampedArray(imageData.data)
		};
	}
};

module.exports = exports['default'];