'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (polygons, colorData, params) {
	var fill = params.fill;
	var stroke = params.stroke;
	var strokeWidth = params.strokeWidth;
	var lineJoin = params.lineJoin;
	var transparentColor = params.transparentColor;

	var fillColor = typeof fill === 'string' ? fill : false;
	var strokeColor = typeof stroke === 'string' ? stroke : false;

	/**
  * Color override logic
  * @param  {Object} color    Color object
  * @param  {String} override Override color (fillColor/strokeColor)
  * @return {String}          CSS formatted color (rgba,..)
  */
	var getColor = function getColor(color, override) {
		var t = (0, _isTransparent2.default)(color) && transparentColor; // Color is transparent, and transparentColor override is defined
		var c = t ? transparentColor : color;
		return override && !t ? override : (0, _toRGBA2.default)(c); // Priority: transparentColor -> override -> supplied color
	};

	polygons.forEach(function (polygon, index) {
		var color = (0, _getColorByPos2.default)((0, _polygonCenter2.default)(polygon), colorData);

		if (fill) {
			polygon.fill = getColor(color, fillColor);
		}

		if (stroke) {
			polygon.strokeColor = getColor(color, strokeColor);
			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	});

	return polygons;
};

var _getColorByPos = require('../util/getColorByPos');

var _getColorByPos2 = _interopRequireDefault(_getColorByPos);

var _polygonCenter = require('../util/polygonCenter');

var _polygonCenter2 = _interopRequireDefault(_polygonCenter);

var _isTransparent = require('../util/isTransparent');

var _isTransparent2 = _interopRequireDefault(_isTransparent);

var _toRGBA = require('../util/toRGBA');

var _toRGBA2 = _interopRequireDefault(_toRGBA);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];