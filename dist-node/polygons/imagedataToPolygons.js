'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stackblurCanvas = require('stackblur-canvas');

var _stackblurCanvas2 = _interopRequireDefault(_stackblurCanvas);

// var stackBlur = require('stackblur-canvas');

var _delaunayFast = require('delaunay-fast');

var _delaunayFast2 = _interopRequireDefault(_delaunayFast);

var _utilIsImageData = require('../util/isImageData');

var _utilIsImageData2 = _interopRequireDefault(_utilIsImageData);

var _imagedataCopyImageData = require('../imagedata/copyImageData');

var _imagedataCopyImageData2 = _interopRequireDefault(_imagedataCopyImageData);

var _imagedataGreyscale = require('../imagedata/greyscale');

var _imagedataGreyscale2 = _interopRequireDefault(_imagedataGreyscale);

var _imagedataDetectEdges = require('../imagedata/detectEdges');

var _imagedataDetectEdges2 = _interopRequireDefault(_imagedataDetectEdges);

var _getEdgePoints = require('./getEdgePoints');

var _getEdgePoints2 = _interopRequireDefault(_getEdgePoints);

var _getVerticesFromPoints = require('./getVerticesFromPoints');

var _getVerticesFromPoints2 = _interopRequireDefault(_getVerticesFromPoints);

var _addColorToPolygons = require('./addColorToPolygons');

var _addColorToPolygons2 = _interopRequireDefault(_addColorToPolygons);

exports['default'] = function (imageData, params) {

	if ((0, _utilIsImageData2['default'])(imageData)) {
		var imageSize = { width: imageData.width, height: imageData.height };

		var tmpImageData = (0, _imagedataCopyImageData2['default'])(imageData);
		var colorImageData = (0, _imagedataCopyImageData2['default'])(imageData);

		var blurredImageData = _stackblurCanvas2['default'].imageDataRGBA(tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur);
		var greyscaleImageData = (0, _imagedataGreyscale2['default'])(blurredImageData);
		var edgesImageData = (0, _imagedataDetectEdges2['default'])(greyscaleImageData);
		var edgePoints = (0, _getEdgePoints2['default'])(edgesImageData, 50, params.accuracy);
		var edgeVertices = (0, _getVerticesFromPoints2['default'])(edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height);
		var polygons = _delaunayFast2['default'].triangulate(edgeVertices);

		return (0, _addColorToPolygons2['default'])(polygons, colorImageData, params);
	} else {
		throw new Error("Can't work with the imageData provided. It seems to be corrupt");
		return;
	}
};

;
module.exports = exports['default'];