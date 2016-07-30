'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (polygons, colorData) {
  return polygons.filter(function (polygon) {
    var color = (0, _getColorByPos2.default)((0, _polygonCenter2.default)(polygon), colorData);
    return !(0, _isTransparent2.default)(color);
  });
};

var _getColorByPos = require('../util/getColorByPos');

var _getColorByPos2 = _interopRequireDefault(_getColorByPos);

var _polygonCenter = require('../util/polygonCenter');

var _polygonCenter2 = _interopRequireDefault(_polygonCenter);

var _isTransparent = require('../util/isTransparent');

var _isTransparent2 = _interopRequireDefault(_isTransparent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Filter polygons with transparent color
 * @param  {Array} polygons    Polygons array
 * @param  {Object} colorData  Color data
 * @return {Array}             Filtered polygons array
 */