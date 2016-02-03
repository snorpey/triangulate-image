'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (polygons, colorData, params) {
	var pixelIndex = 0;
	var polygonCenterX = undefined;
	var polygonCenterY = undefined;

	var fill = params.fill;
	var fillColor = typeof fill === 'string' ? params.fill : false;
	var stroke = params.stroke;
	var strokeColor = typeof stroke === 'string' ? params.stroke : false;
	var strokeWidth = params.strokeWidth;
	var lineJoin = params.lineJoin;
	var r = undefined;
	var g = undefined;
	var b = undefined;

	polygons.forEach(function (polygon, index) {
		polygonCenterX = (polygon.a.x + polygon.b.x + polygon.c.x) * 0.33333;
		polygonCenterY = (polygon.a.y + polygon.b.y + polygon.c.y) * 0.33333;
		pixelIndex = (polygonCenterX | 0) + (polygonCenterY | 0) * colorData.width << 2;
		r = colorData.data[pixelIndex];
		g = colorData.data[pixelIndex + 1];
		b = colorData.data[pixelIndex + 2];

		if (fill) {
			polygon.fill = fillColor || 'rgb(' + r + ', ' + g + ', ' + b + ')';
		}

		if (stroke) {
			if (strokeColor) {
				polygon.strokeColor = strokeColor;
			} else {
				polygon.strokeColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
			}

			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	});

	return polygons;
};

module.exports = exports['default'];