var stackBlur = require('stackblur-canvas');
var delaunay = require('delaunay-fast');

var clamp = require('../util/clamp.js');
var copyImageData = require('../imagedata/copyImageData.js');
var greyscale = require('../imagedata/greyscale');
var detectEdges = require('../imagedata/detectEdges');
var getEdgePoints = require('./getEdgePoints.js');
var getVerticesFromPoints = require('./getVerticesFromPoints.js');
var addColorToPolygons = require('./addColorToPolygons.js');

var allowedLineJoins = [ 'miter', 'round', 'bevel' ];

module.exports = function ( imageData, params ) {
	params.accuracy = clamp( params.accuracy || 0.7, 0, 1 );
	params.blur = params.blur || 40;
	params.vertexCount = params.vertexCount || 700;
	params.fill = typeof params.fill === 'undefined' ? true : params.fill;
	params.stroke = typeof params.stroke === 'undefined' ? true : params.stroke;
	params.strokeWidth = typeof params.stroke === 'number' ? 0.5 : params.strokeWidth;
	params.lineJoin = allowedLineJoins.indexOf( params.lineJoin ) !== -1 ? params.lineJoin : allowedLineJoins[0];
	
	var imageSize = { width: imageData.width, height: imageData.height };

	var tmpImageData = copyImageData( imageData );
	var colorImageData = copyImageData( imageData );

	var blurredImageData = stackBlur.imageDataRGBA( tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur );
	var greyscaleImageData = greyscale( blurredImageData );
	var edgesImageData = detectEdges( greyscaleImageData );
	var edgePoints = getEdgePoints( edgesImageData, 50, params.accuracy );
	var edgeVertices = getVerticesFromPoints( edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height );
	var polygons = delaunay.triangulate( edgeVertices );
	
	return addColorToPolygons( polygons, colorImageData, params );
}