/*global describe, it, done*/
var fs = require('fs');
var assert = require('assert');
var stream = require('stream');
var libxmljs = require('libxmljs');
var Canvas = require('canvas-browserify');
var Image = Canvas.Image;

var triangulate = require('../dist-node/index.js');

var imagePath = '../examples/img/lincoln.jpg';

var defaultParams = {
	accuracy: 0.7,
	blur: 40,
	fill: true,
	stroke: true,
	strokeWidth: 0.5,
	lineJoin: 'miter',
	vertexCount: 700
};

describe( 'node tests for triangulate-image', function () {
	describe( '#triangulate()', function () {
		it ( 'should be a function', function () {
			assert.equal( typeof triangulate, 'function' );
		} );

		it ( 'should return an object', function () {
			assert.equal( typeof triangulate(), 'object' );
		} );

		it ( 'should return all input methods available in node', function () {
			var t = triangulate();
			assert.equal( typeof t.fromImageData, 'function' );
			assert.equal( typeof t.fromBuffer, 'function' );
		} );

// getParams()

		it ( 'should have a getParams method', function () {
			assert.equal( typeof triangulate().getParams, 'function' );
		} );

		describe( '#getParams()', function () {
			it ( 'should return an object with all parameters', function () {
				var params = triangulate().getParams();
				assert.equal( typeof params.accuracy, 'number' );
				assert.equal( typeof params.blur, 'number' );
				assert.equal( typeof params.fill === 'string' || typeof params.fill === 'boolean', true );
				assert.equal( typeof params.stroke === 'string' || typeof params.stroke === 'boolean', true );
				assert.equal( typeof params.strokeWidth === 'number' || typeof params.strokeWidth === 'boolean', true );
				assert.equal( typeof params.lineJoin === 'string' && [ 'miter', 'round', 'bevel' ].indexOf( params.lineJoin ) > -1, true );
				assert.equal( typeof params.vertexCount, 'number' );
			} );

			it ( 'should set the default no parameters are submitted', function () {
				var params = triangulate().getParams();

				for ( var key in defaultParams ) {
					assert.equal( params[key], defaultParams[key] );
				}
			} );

			it ( 'should add missing parameters', function () {
				var params = triangulate( { accuracy: 0.3, blur: 39 } ).getParams();

				for ( var key in defaultParams ) {
					assert.notEqual( typeof params[key], 'undefined' );
				}
			} );

			it ( 'should clamp the accuracy parameter', function () {
				var params = triangulate( { accuracy: 300 } ).getParams();
				assert.equal( params.accuracy >= 0 && params.accuracy <= 1, true );
			} );
		} );

		it ( 'should not have a fromImage method', function () {
			assert.notEqual( typeof triangulate().fromImage, 'function' );
		} );

// fromImageData()

		it ( 'should have a fromImageData method', function () {
			assert.equal( typeof triangulate().fromImageData, 'function' );
		} );

		describe( '#fromImageData()', function () {
			it ( 'should return all output methods available in node', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var imageData = bufferToImageData( buffer );
					var output = triangulate().fromImageData( imageData );
					assert.equal( typeof output.toBuffer, 'function' );
					assert.equal( typeof output.toDataURL, 'function' );
					assert.equal( typeof output.toImageData, 'function' );
					assert.equal( typeof output.toSVG, 'function' );
					assert.equal( typeof output.toJPGStream, 'function' );
					assert.equal( typeof output.toJPEGStream, 'function' );
					assert.equal( typeof output.toPNGStream, 'function' );
					assert.equal( typeof output.toSVGStream, 'function' );
					done();
				} );
			} );
			
			it ( 'should be able to handle an imageData object', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var imageData = bufferToImageData( buffer );
					triangulate().fromImageData( imageData ).toSVG();
					done();
				} );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function () {
				assert.throws( function () {
					triangulate().fromImageData().toSVG();
				}, "Can't work with the imageData provided. It seems to be corrupt" );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function () {
				assert.throws( function () {
					triangulate().fromImageData( { width: 0, data: 'LOL', height: 10 } ).toSVG();
				}, "Can't work with the imageData provided. It seems to be corrupt" );
			} );
		} );

// fromBuffer

		it ( 'should have a fromBuffer method', function () {
			assert.equal( typeof triangulate().fromBuffer, 'function' );
		} );

		describe( '#fromBuffer()', function () {
			it ( 'should be able to handle a buffer object', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					triangulate().fromBuffer( buffer );
					done();
				} );
			} );

			it ( 'should return all output methods available in node', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var output = triangulate().fromBuffer( buffer );
					assert.equal( typeof output.toBuffer, 'function' );
					assert.equal( typeof output.toData, 'function' );
					assert.equal( typeof output.toDataURL, 'function' );
					assert.equal( typeof output.toImageData, 'function' );
					assert.equal( typeof output.toSVG, 'function' );
					assert.equal( typeof output.toJPGStream, 'function' );
					assert.equal( typeof output.toPNGStream, 'function' );
					assert.equal( typeof output.toSVGStream, 'function' );
					done();
				} );
			} );

			it ( 'should throw an error when provided with corrupt or no buffer object', function () {
				assert.throws( function () {
					triangulate().fromBuffer().toSVG();
				}, "Can't work with the buffer object provided." );

				assert.throws( function () {
					triangulate().fromBuffer( 'test123' ).toSVG();
				}, "Can't work with the buffer object provided." );
			} );
		} );

// toBuffer

		describe( '#toBuffer()', function () {
			it ( 'should return a buffer', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					assert.equal( triangulate().fromBuffer( buffer ).toBuffer() instanceof Buffer, true );
					done();
				} );
			} );

			it ( 'should accept svg as parameter', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					assert.equal( triangulate().fromBuffer( buffer ).toBuffer( { format: 'svg' } ) instanceof Buffer, true );
					done();
				} );
			} );

			it ( 'should accept pdf as parameter', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					assert.equal( triangulate().fromBuffer( buffer ).toBuffer( { format: 'pdf' } ) instanceof Buffer, true );
					done();
				} );
			} );
		} );

// toData

		describe( '#toData()', function () {
			it ( 'should return valid polygon data', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var data = triangulate().fromBuffer( buffer ).toData();

					assert.equal( Array.isArray( data ), true );
					assert.equal( data.length > 0, true );

					var firstPolygon = data[0];

					assert.equal( typeof firstPolygon.a, 'object' );
					assert.equal( typeof firstPolygon.b, 'object' );
					assert.equal( typeof firstPolygon.c, 'object' );

					[ 'a', 'b', 'c' ].forEach( function ( key ) {
						assert.equal( typeof firstPolygon[key].x, 'number' );
						assert.equal( typeof firstPolygon[key].y, 'number' );
					} );

					done();
				} );
			} );
		} );

// toDataURL

		describe( '#toDataURL()', function () {
			it ( 'should return a dataURL', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var url = triangulate().fromBuffer( buffer ).toDataURL();

					assert.equal( typeof url, 'string' );
					assert.equal( url.length > 21, true );
					assert.equal( url.indexOf( 'data:image/png;base64' ) === 0, true );
					done();
				} );
			} );
		} );

// toImageData

		describe( '#toImageData()', function () {
			it ( 'should return an imageData object', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var imageData = triangulate().fromBuffer( buffer ).toImageData();

					assert.equal( typeof imageData, 'object' );
					assert.equal( typeof imageData.width, 'number' );
					assert.equal( typeof imageData.height, 'number' );
					assert.notEqual( typeof imageData.data, 'undefined' );
					assert.equal( imageData.data.length > 0, true );
					
					done();
				} );
			} );
		} );

// toSVG

		describe( '#toSVG()', function () {
			it ( 'should return valid SVG markup', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var markup = triangulate().fromBuffer( buffer ).toSVG();
					var isValid = false;

					assert.equal( typeof markup, 'string' );
					assert.equal( markup.indexOf( '<?xml' ), 0 );
					assert.notEqual( markup.indexOf( '<svg ' ), -1 );

					try {
						libxmljs.parseXml( markup );
						isValid = true;
					} catch ( e ) {
						done( e );
					}

					assert.equal( isValid, true );
					
					done();
				} );
			} );
		} );

// toSVGStream

		describe( '#toSVGStream()', function () {
			it ( 'should return valid SVGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var svgStream = triangulate().fromBuffer( buffer ).toSVGStream();
					
					assert.equal( svgStream instanceof stream.Readable, true );
					done();
				} );
			} );

			it ( 'should send data via SVGStream', function ( done ) {
					loadImageBuffer( done, function ( buffer ) {
					var svgStream = triangulate().fromBuffer( buffer ).toSVGStream();
					var hasSentData = false;

					assert.equal( svgStream instanceof stream.Readable, true );

					svgStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					svgStream.on( 'end', function () {
						assert.equal( hasSentData, true );
						done();
					} );

					svgStream.on( 'error', done );					
				} );
			} );
		} );

// toJPGStream

		describe( '#toJPGStream()', function () {
			it ( 'should return valid JPGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var svgStream = triangulate().fromBuffer( buffer ).toJPGStream();
					
					assert.equal( svgStream instanceof Canvas.JPEGStream, true );
					done();
				} );
			} );

			it ( 'should send data via JPGStream', function ( done ) {
					loadImageBuffer( done, function ( buffer ) {
					var jpgStream = triangulate().fromBuffer( buffer ).toJPGStream();
					var hasSentData = false;

					jpgStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					jpgStream.on( 'end', function () {
						assert.equal( hasSentData, true );
						done();
					} );

					jpgStream.on( 'error', done );
				} );
			} );
		} );

// toPNGStream

		describe( '#toPNGStream()', function () {
			it ( 'should return valid PNGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var svgStream = triangulate().fromBuffer( buffer ).toPNGStream();
					
					assert.equal( svgStream instanceof Canvas.PNGStream, true );
					done();
				} );
			} );

			it ( 'should send data via PNGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var pngStream = triangulate().fromBuffer( buffer ).toPNGStream();
					var hasSentData = false;

					pngStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					pngStream.on( 'end', function () {
						assert.equal( hasSentData, true );
						done();
					} );

					pngStream.on( 'error', done );
				} );
			} );
		} );
	} );
} );

function loadImageBuffer ( err, callback ) {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) { done( err ); throw err; }

		callback( buffer );
	} );
}

function bufferToImageData ( buffer ) {
	var img = new Image();
	img.src = buffer;

	var canvas = new Canvas( img.width, img.height );
	var ctx = canvas.getContext( '2d' );
	ctx.drawImage( img, 0, 0 );

	return ctx.getImageData( 0, 0, img.width, img.height );
}
