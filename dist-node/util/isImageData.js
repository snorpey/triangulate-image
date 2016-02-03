'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (imageData) {
	return imageData && typeof imageData.width === 'number' && typeof imageData.height === 'number' && imageData.data && typeof imageData.data.length === 'number';
};

;
module.exports = exports['default'];