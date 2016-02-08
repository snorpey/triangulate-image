'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (polygons, colorData, params) {
	polygons.forEach(function (polygon) {
		polygon.boundingBox = (0, _getBoundingBox2.default)([polygon.a, polygon.b, polygon.c]);
	});

	return polygons.filter(function (polygon) {
		return polygon.boundingBox.width > 0 && polygon.boundingBox.height > 0;
	});
};

var _getBoundingBox = require('../util/getBoundingBox');

var _getBoundingBox2 = _interopRequireDefault(_getBoundingBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];