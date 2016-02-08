'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (imageData, params) {
	if ((0, _isImageData2.default)(imageData)) {
		var imageSize = { width: imageData.width, height: imageData.height };
		var tmpImageData = (0, _copyImageData2.default)(imageData);
		var colorImageData = (0, _copyImageData2.default)(imageData);
		var blurredImageData = (0, _stackblurCanvas.imageDataRGBA)(tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur);
		var greyscaleImageData = (0, _greyscale2.default)(blurredImageData);
		var edgesImageData = (0, _sobel2.default)(greyscaleImageData).toImageData();
		var edgePoints = (0, _getEdgePoints2.default)(edgesImageData, params.threshold);
		var edgeVertices = (0, _getVerticesFromPoints2.default)(edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height);
		var polygons = (0, _delaunayFast.triangulate)(edgeVertices);

		polygons = (0, _addBoundingBoxesToPolygons2.default)(polygons);

		if (params.fill === true && params.gradients === true) {
			polygons = (0, _addGradientsToPolygons2.default)(polygons, colorImageData, params);
		} else {
			polygons = (0, _addColorToPolygons2.default)(polygons, colorImageData, params);
		}

		return polygons;
	} else {
		throw new Error("Can't work with the imageData provided. It seems to be corrupt.");
		return;
	}
};

var _stackblurCanvas = require('stackblur-canvas');

var _delaunayFast = require('delaunay-fast');

var _sobel = require('sobel');

var _sobel2 = _interopRequireDefault(_sobel);

var _isImageData = require('../util/isImageData');

var _isImageData2 = _interopRequireDefault(_isImageData);

var _copyImageData = require('../imagedata/copyImageData');

var _copyImageData2 = _interopRequireDefault(_copyImageData);

var _greyscale = require('../imagedata/greyscale');

var _greyscale2 = _interopRequireDefault(_greyscale);

var _getEdgePoints = require('./getEdgePoints');

var _getEdgePoints2 = _interopRequireDefault(_getEdgePoints);

var _getVerticesFromPoints = require('./getVerticesFromPoints');

var _getVerticesFromPoints2 = _interopRequireDefault(_getVerticesFromPoints);

var _addBoundingBoxesToPolygons = require('./addBoundingBoxesToPolygons');

var _addBoundingBoxesToPolygons2 = _interopRequireDefault(_addBoundingBoxesToPolygons);

var _addColorToPolygons = require('./addColorToPolygons');

var _addColorToPolygons2 = _interopRequireDefault(_addColorToPolygons);

var _addGradientsToPolygons = require('./addGradientsToPolygons');

var _addGradientsToPolygons2 = _interopRequireDefault(_addGradientsToPolygons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];