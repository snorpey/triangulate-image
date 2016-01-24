'use strict';

var stackBlur = require('stackblur-canvas');
var delaunay = require('delaunay-fast');

var isImageData = require('../util/isImageData.js');
var copyImageData = require('../imagedata/copyImageData.js');
var greyscale = require('../imagedata/greyscale');
var detectEdges = require('../imagedata/detectEdges');
var getEdgePoints = require('./getEdgePoints.js');
var getVerticesFromPoints = require('./getVerticesFromPoints.js');
var addColorToPolygons = require('./addColorToPolygons.js');

module.exports = function (imageData, params) {

	if (isImageData(imageData)) {
		var imageSize = { width: imageData.width, height: imageData.height };

		var tmpImageData = copyImageData(imageData);
		var colorImageData = copyImageData(imageData);

		var blurredImageData = stackBlur.imageDataRGBA(tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur);
		var greyscaleImageData = greyscale(blurredImageData);
		var edgesImageData = detectEdges(greyscaleImageData);
		var edgePoints = getEdgePoints(edgesImageData, 50, params.accuracy);
		var edgeVertices = getVerticesFromPoints(edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height);
		var polygons = delaunay.triangulate(edgeVertices);

		return addColorToPolygons(polygons, colorImageData, params);
	} else {
		throw new Error("Can't work with the imageData provided. It seems to be corrupt");
		return;
	}
};