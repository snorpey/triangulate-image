'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (polygons, size, options) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var format = options && options.format ? options.format : false;

	format = allowedFormats.indexOf(format) === -1 ? undefined : format;

	var canvasData = (0, _makeCanvasAndContext2.default)(size, options, dpr, format);

	(0, _drawPolygonsOnContext2.default)(canvasData.ctx, polygons, size);

	return canvasData.canvas.toBuffer();
};

var _makeCanvasAndContext = require('../../util/makeCanvasAndContext');

var _makeCanvasAndContext2 = _interopRequireDefault(_makeCanvasAndContext);

var _drawPolygonsOnContext = require('../../util/drawPolygonsOnContext');

var _drawPolygonsOnContext2 = _interopRequireDefault(_drawPolygonsOnContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/Automattic/node-canvas#pdf-support
var allowedFormats = ['svg', 'pdf'];

module.exports = exports['default'];