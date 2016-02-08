'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (polygons, size, options) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var ctx = (0, _makeCanvasAndContext2.default)(size, options, dpr, true).ctx;

	(0, _drawPolygonsOnContext2.default)(ctx, polygons, size, dpr);

	return ctx.getImageData(0, 0, size.width * dpr, size.height * dpr);
};

var _makeCanvasAndContext = require('../util/makeCanvasAndContext');

var _makeCanvasAndContext2 = _interopRequireDefault(_makeCanvasAndContext);

var _drawPolygonsOnContext = require('../util/drawPolygonsOnContext');

var _drawPolygonsOnContext2 = _interopRequireDefault(_drawPolygonsOnContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];