var fs = require('fs');
var Canvas = require( 'canvas' );
var superfastBlur = require( './superfastBlur.js' );
var delaunay = require( './delaunay.js' );
var greyscale = require( './greyscale.js' );
var detectEdges = require( './detectEdges.js' );
var getEdgePoints = require( './getEdgePoints.js' );
var getRandomVertices = require( './getRandomVertices.js' );
var getTrianglesWithColor = require( './getTrianglesWithColor.js' );
var getSVGMarkupFromTriangleData = require( './getSVGMarkupFromTriangleData.js' );
var getDataURL = require( './getDataURL.js' );
var Image = Canvas.Image;

function triangulateImage ( imgPath, params, callback ) {
	fs.readFile( __dirname + '/' + imgPath, function ( err, src ){
		if ( err ) {
			throw err;
		}
		img = new Image();
		img.src = src;

		var canvas = new Canvas( img.width, img.height );
		ctx = canvas.getContext( '2d' );
		ctx.drawImage( img, 0, 0 );

		var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
		var colorData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

		var blurredImageData = superfastBlur( imageData, params.blur, false );
		var greyscaleImageData = greyscale( blurredImageData );
		var edgesImageData = detectEdges( greyscaleImageData );

		var edgePoints = getEdgePoints( edgesImageData, 50, params.accuracy );
		var edgeVertices = getRandomVertices( edgePoints, params.pointRate, params.pointCount, params.accuracy, canvas.width, canvas.height );

		var polygons = delaunay.triangulate( edgeVertices );
		var triangles = getTrianglesWithColor( polygons, colorData );

		if ( typeof callback === 'function' ) {
			callback( triangles, { width: img.width, height: img.height } );
		}
	} );
}

var configParams = {
	blur: 50,         // can be whatever
	accuracy: 0.2,    // between 0 - 1
	pointRate: 0.03,  // between 0.001 - 0.1
	pointCount: 1200  // can be whatever
};

triangulateImage( 'images/lincoln.jpg', configParams, function ( triangles, size ) {
	var svgMarkup = getSVGMarkupFromTriangleData( triangles, size );
	console.log( 'triangulated SVG markup', svgMarkup );

	var dataURL = getDataURL( triangles, size );
	console.log( 'triangulated Canvas Data URL:', dataURL );
} );

