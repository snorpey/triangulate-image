'use strict';

module.exports = function (imageData) {
	return imageData && typeof imageData.width === 'number' && typeof imageData.height === 'number' && imageData.data && typeof imageData.data.length === 'number';
};