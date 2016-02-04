'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilGetBoundingBox = require('../util/getBoundingBox');

var _utilGetBoundingBox2 = _interopRequireDefault(_utilGetBoundingBox);

exports['default'] = function (polygons, colorData, params) {
	polygons.forEach(function (polygon) {
		polygon.boundingBox = (0, _utilGetBoundingBox2['default'])([polygon.a, polygon.b, polygon.c]);
	});

	return polygons.filter(function (polygon) {
		return polygon.boundingBox.width > 0 && polygon.boundingBox.height > 0;
	});
};

module.exports = exports['default'];