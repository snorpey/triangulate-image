/*global describe, it, done*/
var fs = require('fs');
var assert = require('assert');
var stream = require('stream');
var libxmljs = require('libxmljs');
var Canvas = require('canvas-browserify');
var expect = require('expect.js');

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
		it ( 'should be a', function () {
			expect( triangulate ).to.be.a( 'function' );
		} );

		it ( 'should return an object', function () {
			expect( triangulate() ).to.be.an( 'object' );
		} );

		it ( 'should return all input methods available in the browser', function () {
			var t = triangulate();
			expect( t.fromBuffer ).to.be.a( 'function' );
			expect( t.fromBufferSync ).to.be.a( 'function' );
			expect( t.fromImageData ).to.be.a( 'function' );
			expect( t.fromImageDataSync ).to.be.a( 'function' );
			expect( t.fromStream ).to.be.a( 'function' );
		} );

		it ( 'should have a getParams method', function () {
			expect( triangulate().getParams ).to.be.a( 'function' );
		} );
	} );

// getParams()

	describe( '#getParams()', function () {
		it ( 'should return an object with all parameters', function () {
			var params = triangulate().getParams();
			expect( params.accuracy ).to.be.a( 'number' );
			expect( params.blur ).to.be.a( 'number' );
			expect( typeof params.fill === 'string' || typeof params.fill === 'boolean' ).to.be( true );
			expect( typeof params.stroke === 'string' || typeof params.stroke === 'boolean' ).to.be( true );
			expect( typeof params.strokeWidth === 'number' || typeof params.strokeWidth === 'boolean' ).to.be( true );
			expect( [ 'miter', 'round', 'bevel' ] ).to.contain( params.lineJoin );
			expect( params.vertexCount ).to.be.a( 'number' );
		} );
		
		it ( 'should set the default no parameters are submitted', function () {
			var params = triangulate().getParams();

			for ( var key in defaultParams ) {
				expect( params[key] ).to.be( defaultParams[key] );
			}
		} );

		it ( 'should add missing parameters', function () {
			var params = triangulate( { accuracy: 0.3, blur: 39 } ).getParams();

			for ( var key in defaultParams ) {
				expect( params[key] ).not.to.be( 'undefined' );
			}	
		} );

		it ( 'should clamp the accuracy parameter', function () {
			var params = triangulate( { accuracy: 300 } ).getParams();
			expect( params.accuracy ).to.be.within( 0, 1 );
		} );

		it ( 'should make sure that blur is a positive integer', function () {
			var params = triangulate( { blur: 0 } ).getParams();
			expect( params.blur ).to.be.greaterThan( 0 );
		} );

		it ( 'should make sure that vertexCount is a positive integer', function () {
			var params = triangulate( { vertexCount: 0 } ).getParams();
			expect( params.vertexCount ).to.be.greaterThan( 0 );
		} );
	} );

	it ( 'should not have a fromImage method', function () {
		expect( triangulate().fromImage ).to.be.a( 'undefined' );
	} );

	describe( 'Asynchronous Methods', function () {
		it ( 'should have a fromBuffer method', function () {
			expect( triangulate().fromBuffer ).to.be.a( 'function' );
		} );

		describe( '#fromBuffer()', function () {
			it ( 'should accept a buffer as parameter', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var failed = false;
					
					triangulate()
						.fromBuffer( buffer )
						.toSVG()
						.then ( function ( res ) {
							failed = false;
							check();
						}, function ( err ) {
							failed = true;
							check();
						} );

					function check () {
						expect( failed ).to.be( false );
						done();
					}
				} );
			} );
		} );

		// fromImageData

		it ( 'should have a fromImageData method', function () {
			expect( triangulate().fromImageData ).to.be.a( 'function' );
		} );
		
		describe( '#fromImageData()', function () {
			it ( 'should be able to handle an imageData object', function ( done ) {
				this.timeout( 10000 );
				
				loadImageBuffer( done, function ( buffer ) {
					var imageData = bufferToImageData( buffer );

					var failed = false;
					triangulate()
						.fromImageData( imageData )
						.toSVG()
						.then ( function ( res ) {
							failed = false;
							check();
						}, function ( err ) {
							failed = true;
							check();
						} );

					function check () {
						expect( failed ).to.be( false );
						done();
					}
				} );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function ( done ) {
				this.timeout( 10000 );

				var failed = false;
					triangulate()
						.fromImageData( { width: 0, data: 'LOL', height: 10 } )
						.toSVG()
						.then ( function ( res ) {
							failed = false;
							check();
						}, function ( err ) {
							failed = true;
							check();
						} );

					function check () {
						expect( failed ).to.be( true );
						done();
					}
			} );

			it ( 'should throw an error when provided with no imageData object', function ( done ) {
				this.timeout( 10000 );

				var failed = false;
					triangulate()
						.fromImageData()
						.toSVG()
						.then ( function ( res ) {
							failed = false;
							check();
						}, function ( err ) {
							failed = true;
							check();
						} );

					function check () {
						expect( failed ).to.be( true );
						done();
					}
			} );
		} );

		// fromStream

		it ( 'should have a fromStream method', function () {
			expect( triangulate().fromStream ).to.be.a( 'function' );
		} );

		describe( '#fromStream()', function () {
			it ( 'should accept a readStream as input', function ( done ) {
				var readStream = fs.createReadStream( __dirname + '/' + imagePath );

				triangulate()
					.fromStream( readStream )
					.toData()
					.then( function ( data ) {
						expect( Array.isArray( data ) ).to.be( true );
						expect( data.length ).to.be.greaterThan( 0 );
						
						var firstPolygon = data[0];

						expect( firstPolygon.a ).to.be.an( 'object' );
						expect( firstPolygon.b ).to.be.an( 'object' );
						expect( firstPolygon.c ).to.be.an( 'object' );

						[ 'a', 'b', 'c' ].forEach( function ( key ) {
							expect( firstPolygon[key].x).to.be.a( 'number' );
							expect( firstPolygon[key].y).to.be.a( 'number' );
						} );
						done();
					}, done )
			} );
		} );

		// toData
		
		it ( 'should have a toData method', function () {
			expect( triangulate().fromBuffer().toData ).to.be.a( 'function' );
		} );

		describe( '#toData()', function () {
			it ( 'should return valid polygon data', function ( done ) {
				this.timeout( 10000 );

				loadImageBuffer( done, function ( buffer ) {
					triangulate()
						.fromBuffer( buffer )
						.toData()
						.then( function ( data ) {
							expect( Array.isArray( data ) ).to.be( true );
							expect( data.length ).to.be.greaterThan( 0 );
							
							var firstPolygon = data[0];

							expect( firstPolygon.a ).to.be.an( 'object' );
							expect( firstPolygon.b ).to.be.an( 'object' );
							expect( firstPolygon.c ).to.be.an( 'object' );

							[ 'a', 'b', 'c' ].forEach( function ( key ) {
								expect( firstPolygon[key].x).to.be.a( 'number' );
								expect( firstPolygon[key].y).to.be.a( 'number' );
							} );

							done();
						}, done );
				} );
			} );
		} );

		// toDataURL
	
		it ( 'should have a toDataURL method', function () {
			expect( triangulate().fromBuffer().toDataURL ).to.be.a( 'function' );
		} );

		describe( '#toDataURL()', function () {
			it ( 'should return a dataURL', function ( done ) {
				this.timeout( 10000 );

				loadImageBuffer( done, function ( buffer ) {
					triangulate()
						.fromBuffer( buffer )
						.toDataURL()
						.then( function ( url ) {
							expect( url ).to.be.a( 'string' );
							expect( url.length ).to.be.greaterThan( 21 );
							expect( url.indexOf( 'data:image/png;base64' ) ).to.be( 0 );
							done();
						}, done );
				} );
			} );
		} );

		// toImageData
		
		it ( 'should have a toImageData method', function () {
			expect( triangulate().fromBuffer().toImageData ).to.be.a( 'function' );
		} );

		describe( '#toImageData()', function () {
			it ( 'should return an imageData object', function ( done ) {
				this.timeout( 10000 );

				loadImageBuffer( done, function ( buffer ) {
					triangulate()
					 	.fromBuffer( buffer )
					 	.toImageData()
					 	.then ( function ( imageData ) {
							expect( imageData ).to.be.an( 'object' );
							expect( imageData.width ).to.be.a( 'number' );
							expect( imageData.height ).to.be.a( 'number' );
							expect( imageData.data ).not.to.be( 'undefined' );
							expect( imageData.data.length ).to.be.greaterThan( 0 );
							
							done();
					 	}, done );
				} );
			} );
		} );

		// toSVG
		
		it ( 'should have a toSVG method', function () {
			expect( triangulate().fromBuffer().toSVG ).to.be.a( 'function' );
		} );

		describe( '#toSVG()', function () {
			it ( 'should return valid SVG markup', function ( done ) {
				this.timeout( 10000 );

				loadImageBuffer( done, function ( buffer ) {
					triangulate()
						.fromBuffer( buffer )
						.toSVG()
						.then( function ( markup ) {
							expect( markup ).to.be.a( 'string' );
							expect( markup.indexOf( '<?xml' ) ).to.be( 0 );
							expect( markup.indexOf( '<svg ' ) ).not.to.be( -1 );

							var isValid = false;

							try {
								libxmljs.parseXml( markup );
								isValid = true;
							} catch ( err ) {
								done( err );
							}

							expect( isValid ).to.be( true );
							
							done();
						}, done );
				} );
			} );
		} );
	} );

	describe( 'Synchronous Methods', function () {

	// fromImage

		it ( 'should have a fromBufferSync method', function () {
			expect( triangulate().fromBufferSync ).to.be.a( 'function' );
		} );

		describe( '#fromBufferSync()', function () {
			it ( 'should accept a buffer as parameter', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					expect( function () { triangulate().fromBufferSync( buffer ).toSVGSync(); } ).not.to.throwError();
					done();
				} );
			} );
		} );

	// fromImageData

		it ( 'should have a fromImageDataSync method', function () {
			expect( triangulate().fromImageDataSync ).to.be.a( 'function' );
		} );
		
		describe( '#fromImageDataSync()', function () {
			it ( 'should be able to handle an imageData object', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var imageData = bufferToImageData( buffer );			
					expect( function () { triangulate().fromImageDataSync( imageData ).toSVGSync(); } ).not.to.throwError();
					done();
				} );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function () {
				expect( function () {
					triangulate().fromImageDataSync().toSVGSync();
				} ).to.throwError();

				expect( function () {
					triangulate().fromImageDataSync( { width: 0, data: 'LOL', height: 10 } ).toSVGSync();
				} ).to.throwError();
			} );
		} );

	// toData
		
		it ( 'should have a toDataSync method', function () {
			expect( triangulate().fromBufferSync().toDataSync ).to.be.a( 'function' );
		} );

		describe( '#toDataSync()', function () {
			it ( 'should return valid polygon data', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var data = triangulate().fromBufferSync( buffer ).toDataSync();

					expect( Array.isArray( data ) ).to.be( true );
					expect( data.length ).to.be.greaterThan( 0 );
					
					var firstPolygon = data[0];

					expect( firstPolygon.a ).to.be.an( 'object' );
					expect( firstPolygon.b ).to.be.an( 'object' );
					expect( firstPolygon.c ).to.be.an( 'object' );

					[ 'a', 'b', 'c' ].forEach( function ( key ) {
						expect( firstPolygon[key].x).to.be.a( 'number' );
						expect( firstPolygon[key].y).to.be.a( 'number' );
					} );

					done();
				} );
			} );
		} );

	// toDataURL
	
		it ( 'should have a toDataURLSync method', function () {
			expect( triangulate().fromBufferSync().toDataURLSync ).to.be.a( 'function' );
		} );

		describe( '#toDataURLSync()', function () {
			it ( 'should return a dataURL', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var url = triangulate().fromBufferSync( buffer ).toDataURLSync();

					expect( url ).to.be.a( 'string' );
					expect( url.length ).to.be.greaterThan( 21 );
					expect( url.indexOf( 'data:image/png;base64' ) ).to.be( 0 );
					done();
				} );
			} );
		} );

	// toImageData
		
		it ( 'should have a toImageDataSync method', function () {
			expect( triangulate().fromBufferSync().toImageDataSync ).to.be.a( 'function' );
		} );

		describe( '#toImageDataSync()', function () {
			it ( 'should return an imageData object', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var imageData = triangulate().fromBufferSync( buffer ).toImageDataSync();

					expect( imageData ).to.be.an( 'object' );
					expect( imageData.width ).to.be.a( 'number' );
					expect( imageData.height ).to.be.a( 'number' );
					expect( imageData.data ).not.to.be( 'undefined' );
					expect( imageData.data.length ).to.be.greaterThan( 0 );
					
					done();
				} );
			} );
		} );

	// toSVG
		
		it ( 'should have a toSVGSync method', function () {
			expect( triangulate().fromBufferSync().toSVGSync ).to.be.a( 'function' );
		} );

		describe( '#toSVGSync()', function () {
			it ( 'should return valid SVG markup', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var markup = triangulate().fromBufferSync( buffer ).toSVGSync();
					
					expect( markup ).to.be.a( 'string' );
					expect( markup.indexOf( '<?xml' ) ).to.be( 0 );
					expect( markup.indexOf( '<svg ' ) ).not.to.be( -1 );

					var isValid = false;

					try {
						libxmljs.parseXml( markup );
						isValid = true;
					} catch ( err ) {
						done( err );
					}

					expect( isValid ).to.be( true );
					
					done();
				} );
			} );
		} );

		// toSVGStream

		it ( 'should have a toSVGStream method', function () {
			expect( triangulate().fromBufferSync().toSVGStream ).to.be.a( 'function' );
		} );

		describe( '#toSVGStream()', function () {
			it ( 'should return a readable stream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var svgStream = triangulate().fromBufferSync( buffer ).toSVGStream();
					
					expect( svgStream instanceof stream.Readable ).to.be( true );
					done();
				} );
			} );

			it ( 'should send data via SVGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {

					var svgStream = triangulate().fromBufferSync( buffer ).toSVGStream();
					var hasSentData = false;

					svgStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					svgStream.on( 'end', function () {
						expect( hasSentData ).to.be( true );
						done();
					} );

					svgStream.on( 'error', done );					
				} );
			} );
		} );

		// toJPGStream

		it ( 'should have a toJPGStream method', function () {
			expect( triangulate().fromBufferSync().toJPGStream ).to.be.a( 'function' );
			expect( triangulate().fromBufferSync().toJPEGStream ).to.be.a( 'function' );
		} );

		describe( '#toJPGStream()', function () {
			it ( 'should return a JPGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var jpgStream = triangulate().fromBufferSync( buffer ).toJPGStream();
					
					expect( jpgStream instanceof Canvas.JPEGStream ).to.be( true );
					done();
				} );
			} );

			it ( 'should send data via JPGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var jpgStream = triangulate().fromBufferSync( buffer ).toJPGStream();
					var hasSentData = false;

					jpgStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					jpgStream.on( 'end', function () {
						expect( hasSentData ).to.be( true );
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
					var pngStream = triangulate().fromBufferSync( buffer ).toPNGStream();
					
					assert.equal( pngStream instanceof Canvas.PNGStream, true );
					done();
				} );
			} );

			it ( 'should send data via PNGStream', function ( done ) {
				loadImageBuffer( done, function ( buffer ) {
					var pngStream = triangulate().fromBufferSync( buffer ).toPNGStream();
					var hasSentData = false;

					pngStream.on( 'data', function ( chunk ) {
						hasSentData = !! chunk;
					} );

					pngStream.on( 'end', function () {
						expect( hasSentData ).to.be( true );
						done();
					} );

					pngStream.on( 'error', done );
				} );
			} );
		} );
	} );
} );




	// toSVGStream

			// describe( '#toSVGStream()', function () {
			// 	it ( 'should return valid SVGStream', function ( done ) {
			// 		loadImageBuffer( done, function ( buffer ) {
			// 			var svgStream = triangulate().fromBuffer( buffer ).toSVGStream();
						
			// 			assert.equal( svgStream instanceof stream.Readable, true );
			// 			done();
			// 		} );
			// 	} );

			// 	it ( 'should send data via SVGStream', function ( done ) {
			// 			loadImageBuffer( done, function ( buffer ) {
			// 			var svgStream = triangulate().fromBuffer( buffer ).toSVGStream();
			// 			var hasSentData = false;

			// 			assert.equal( svgStream instanceof stream.Readable, true );

			// 			svgStream.on( 'data', function ( chunk ) {
			// 				hasSentData = !! chunk;
			// 			} );

			// 			svgStream.on( 'end', function () {
			// 				assert.equal( hasSentData, true );
			// 				done();
			// 			} );

			// 			svgStream.on( 'error', done );					
			// 		} );
			// 	} );
			// } );

	// toJPGStream

			// describe( '#toJPGStream()', function () {
			// 	it ( 'should return valid JPGStream', function ( done ) {
			// 		loadImageBuffer( done, function ( buffer ) {
			// 			var svgStream = triangulate().fromBuffer( buffer ).toJPGStream();
						
			// 			assert.equal( svgStream instanceof Canvas.JPEGStream, true );
			// 			done();
			// 		} );
			// 	} );

			// 	it ( 'should send data via JPGStream', function ( done ) {
			// 			loadImageBuffer( done, function ( buffer ) {
			// 			var jpgStream = triangulate().fromBuffer( buffer ).toJPGStream();
			// 			var hasSentData = false;

			// 			jpgStream.on( 'data', function ( chunk ) {
			// 				hasSentData = !! chunk;
			// 			} );

			// 			jpgStream.on( 'end', function () {
			// 				assert.equal( hasSentData, true );
			// 				done();
			// 			} );

			// 			jpgStream.on( 'error', done );
			// 		} );
			// 	} );
			// } );

	// // toPNGStream

	// 		describe( '#toPNGStream()', function () {
	// 			it ( 'should return valid PNGStream', function ( done ) {
	// 				loadImageBuffer( done, function ( buffer ) {
	// 					var svgStream = triangulate().fromBuffer( buffer ).toPNGStream();
						
	// 					assert.equal( svgStream instanceof Canvas.PNGStream, true );
	// 					done();
	// 				} );
	// 			} );

	// 			it ( 'should send data via PNGStream', function ( done ) {
	// 				loadImageBuffer( done, function ( buffer ) {
	// 					var pngStream = triangulate().fromBuffer( buffer ).toPNGStream();
	// 					var hasSentData = false;

	// 					pngStream.on( 'data', function ( chunk ) {
	// 						hasSentData = !! chunk;
	// 					} );

	// 					pngStream.on( 'end', function () {
	// 						assert.equal( hasSentData, true );
	// 						done();
	// 					} );

	// 					pngStream.on( 'error', done );
	// 				} );
	// 			} );
	// 		} );
// 		} );
// 	} );
// } );

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
