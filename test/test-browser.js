var defaultParams = {
	accuracy: 0.7,
	blur: 4,
	fill: true,
	stroke: true,
	strokeWidth: 0.5,
	lineJoin: 'miter',
	vertexCount: 700,
	threshold: 50
};

var imagePath = 'http://localhost:9876/base/img/lincoln.jpg';

describe( 'browser tests for triangulate-image', () => {
	it ( 'should add a global function named "triangulate"', () => {
		expect( triangulate ).to.be.a( 'function' );
		expect( false ).to.be.false;
	} );

	it ( 'should return an object', () => {
		expect( triangulate() ).to.be.an( 'object' );
	} );

	it ( 'should return all input methods available in the browser', () => {
		var t = triangulate();
		expect( t.fromImageSync ).to.be.a( 'function' );
		expect( t.fromImageDataSync ).to.be.a( 'function' );
	} );

	it ( 'should have a getParams method', () => {
		expect( triangulate().getParams ).to.be.a( 'function' );
	} );

// getParams()

	describe( '#getParams()', function () {
		it ( 'should return an object with all parameters', function () {
			var params = triangulate().getParams();
			expect( params.accuracy ).to.be.a( 'number' );
			expect( params.blur ).to.be.a( 'number' );
			expect( params.threshold ).to.be.a( 'number' );
			expect( typeof params.fill === 'string' || typeof params.fill === 'boolean' ).to.be.true;
			expect( typeof params.stroke === 'string' || typeof params.stroke === 'boolean' ).to.be.true;
			expect( typeof params.strokeWidth === 'number' || typeof params.strokeWidth === 'boolean' ).to.be.true;
			expect( [ 'miter', 'round', 'bevel' ] ).to.contain( params.lineJoin );
			expect( params.vertexCount ).to.be.a( 'number' );
			expect( typeof params.transparentColor === 'string' || typeof params.transparentColor === 'boolean' ).to.be.true;
		} );
		
		it ( 'should set the default no parameters are submitted', function () {
			var params = triangulate().getParams();

			for ( var key in defaultParams ) {
				expect( params[key] ).to.be.equal( defaultParams[key] );
			}
		} );

		it ( 'should add missing parameters', function () {
			var params = triangulate( { accuracy: 0.3, blur: 39 } ).getParams();

			for ( var key in defaultParams ) {
				expect( params[key] ).not.to.be.equal( undefined );
			}	
		} );

		it ( 'should clamp the accuracy parameter', function () {
			var params = triangulate( { accuracy: 300 } ).getParams();
			expect( params.accuracy ).to.be.within( 0, 1 );
		} );

		it ( 'should make sure that blur is a positive integer', function () {
			var params = triangulate( { blur: 0 } ).getParams();
			expect( params.blur ).to.be.above( 0 );
		} );

		it ( 'should clamp the threshold parameter', function () {
			var params = triangulate( { threshold: 300 } ).getParams();
			expect( params.threshold ).to.be.within( 1, 100 );
		} );

		it ( 'should make sure that gradients is set', function () {
			var params = triangulate().getParams();
			expect( typeof params.gradients ).to.be.equal( 'boolean' );
		} );

		it ( 'should make sure that gradientStops is >= 2', function () {
			var params = triangulate( { gradients: true } ).getParams();
			expect( params.gradientStops ).to.be.above( 1.99999 );
		} );

		it ( 'should make sure that vertexCount is a positive integer', function () {
			var params = triangulate( { vertexCount: 0 } ).getParams();
			expect( params.vertexCount ).to.be.above( 0 );
		} );
	} );

	it ( 'should not have a fromBuffer method', function () {
		expect( triangulate().fromBuffer ).to.be.a( 'undefined' );
	} );

	describe( 'Asynchronous Methods', function () {
		it ( 'should have a fromImage method', function () {
			expect( triangulate().fromImage ).to.be.a( 'function' );
		} );

		describe( '#fromImage()', function () {
			it ( 'should accept a loaded image as parameter', function ( done ) {
				loadImage()
					.then( img => {
						return triangulate()
							.fromImage( img )
							.toSVG()
							.then ( function ( res ) {
								return false;
							}, function ( err ) {
								return true;
							} );
					}, done )
					.then( failed => {
						expect( failed ).to.be.false;
						done();
					} );
			} );

			it ( 'should throw an error if an image was not loaded', function ( done ) {
				var img = new Image();
				var failed = false;

				triangulate()
					.fromImage( img )
					.toSVG()
					.then ( function ( res ) {
						failed = false;
						check();
					}, function ( err ) {
						failed = true;
						check();
					} );

				function check () {
					expect( failed ).to.be.true;
					done();
				}
			} );
		} );

		// fromImageData

		it ( 'should have a fromImageData method', function () {
			expect( triangulate().fromImageData ).to.be.a( 'function' );
		} );
		
		describe( '#fromImageData()', function () {
			it ( 'should be able to handle an imageData object', function ( done ) {
				this.timeout( 20000 );

				loadImage()
					.then( img => {
						var imageData = imageToImageData( img );

						triangulate()
							.fromImageData( imageData )
							.toSVG()
							.then ( function ( res ) {
								failed = false;
								return failed;
							}, done )
							.then( failed => {
								expect( failed ).to.be.false;
								done();
							} );
					}, done );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function ( done ) {
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
						expect( failed ).to.be.true;
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
						expect( failed ).to.be.true;
						done();
					}
			} );
		} );

		// toData
		
		it ( 'should have a toData method', function () {
			expect( triangulate().fromImage().toData ).to.be.a( 'function' );
		} );

		describe( '#toData()', function () {
			it ( 'should return valid polygon data', function ( done ) {
				this.timeout( 10000 );

				loadImage()
					.then( img => {
						return triangulate()
							.fromImage( img )
							.toData()
					}, err => {
						expect( err ).to.not.be.an( 'error' );
						done( err );
					} )
					.then( function ( data ) {
						expect( Array.isArray( data ) ).to.be.true;
						expect( data.length ).to.be.above( 0 );
						
						var firstPolygon = data[0];

						expect( firstPolygon.a ).to.be.an( 'object' );
						expect( firstPolygon.b ).to.be.an( 'object' );
						expect( firstPolygon.c ).to.be.an( 'object' );

						[ 'a', 'b', 'c' ].forEach( function ( key ) {
							expect( firstPolygon[key].x ).to.be.a( 'number' );
							expect( firstPolygon[key].y ).to.be.a( 'number' );
						} );

						done();
					}, done );
			} );
		} );

		// toDataURL
	
		it ( 'should have a toDataURL method', () => {
			expect( triangulate().fromImage().toDataURL ).to.be.a( 'function' );
		} );

		describe( '#toDataURL()', () => {
			it ( 'should return a dataURL', done => {
				loadImage()
					.then( img => triangulate().fromImage( img ).toDataURL() )
					.then( url => {
						expect( url ).to.be.a( 'string' );
						expect( url.length ).to.be.above( 21 );
						expect( url.indexOf( 'data:image/png;base64' ) ).to.be.equal( 0 );
						done();
					} )
					.catch( done );
			} );
		} );

		// toImageData
		
		it ( 'should have a toImageData method', () => {
			expect( triangulate().fromImage().toImageData ).to.be.a( 'function' );
		} );

		describe( '#toImageData()', () => {
			it ( 'should return an imageData object', done => {
				loadImage()
					.then( img => {
						return triangulate()
						 	.fromImage( img )
						 	.toImageData();
					}, done )
				 	.then ( imageData => {
						expect( typeof imageData ).to.be.equal( 'object' );
						expect( typeof imageData.width ).to.be.equal( 'number' );
						expect( typeof imageData.height ).to.be.equal( 'number' );
						expect( typeof imageData.data ).not.to.be.equal( 'undefined' );
						expect( imageData.data.length ).to.be.above( 0 );
						
						done();
				 	}, done );
			} );
		} );

		// // toSVG
		
		it ( 'should have a toSVG method', function () {
			expect( triangulate().fromImage().toSVG ).to.be.a( 'function' );
		} );

		describe( '#toSVG()', function () {
			it ( 'should return valid SVG markup', function ( done ) {
				this.timeout( 10000 );

				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						return triangulate()
							.fromImage( img )
							.toSVG()
					}, err => {
						expect( err ).to.not.be.an( 'error' );
						done( err );
					} )
					.then( function ( markup ) {
						expect( markup ).to.be.a( 'string' );
						expect( markup.indexOf( '<?xml' ) ).to.be.equal( 0 );
						expect( markup.indexOf( '<svg ' ) ).not.to.be.equal( -1 );

						var domEl = document.createElement( 'div' );
						document.body.appendChild( domEl );
						domEl.innerHTML = markup;
						
						expect( domEl.querySelectorAll( 'polygon' ).length ).to.be.above( 0 );
						
						done();
					}, done );
			} );
		} );
	} );

	describe( 'Synchronous Methods', function () {

	// fromImage

		it ( 'should have a fromImageSync method', function () {
			expect( triangulate().fromImageSync ).to.be.a( 'function' );
		} );

		describe( '#fromImageSync()', function () {
			it ( 'should accept a loaded image as parameter', function ( done ) {
				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						expect( function () {
							triangulate().fromImageSync( img ).toSVGSync();
						} ).not.to.throw();
						done();
					}, done );
				
			} );

			it ( 'should throw an error if an image was not loaded', function () {
				var img = new Image();
				expect( function () {
					triangulate().fromImageSync( img ).toSVGSync();
				} ).to.throw();
			} );
		} );

	// fromImageData

		it ( 'should have a fromImageDataSync method', function () {
			expect( triangulate().fromImageDataSync ).to.be.a( 'function' );
		} );
		
		describe( '#fromImageDataSync()', function () {
			it ( 'should be able to handle an imageData object', function ( done ) {
				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						var imageData = imageToImageData( img );			
						expect( function () {
							triangulate().fromImageDataSync( imageData ).toSVGSync();
						} ).not.to.throw();
						done();
					}, done );
			} );

			it ( 'should throw an error when provided with corrupt imageData object', function () {
				expect( function () {
					triangulate().fromImageDataSync().toSVGSync();
				} ).to.throw();

				expect( function () {
					triangulate().fromImageDataSync( { width: 0, data: 'LOL', height: 10 } ).toSVGSync();
				} ).to.throw();
			} );
		} );

	// // toData
		
		it ( 'should have a toDataSync method', function () {
			expect( triangulate().fromImageSync().toDataSync ).to.be.a( 'function' );
		} );

		describe( '#toDataSync()', function () {
			it ( 'should return valid polygon data', function ( done ) {
				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						var data = triangulate().fromImageSync( img ).toDataSync();

						expect( Array.isArray( data ) ).to.be.true;
						expect( data.length ).to.be.above( 0 );
						
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

	// toDataURL
	
		it ( 'should have a toDataURLSync method', function () {
			expect( triangulate().fromImageSync().toDataURLSync ).to.be.a( 'function' );
		} );

		describe( '#toDataURLSync()', function () {
			it ( 'should return a dataURL', function ( done ) {
				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						var url = triangulate().fromImageSync( img ).toDataURLSync();

						expect( url ).to.be.a( 'string' );
						expect( url.length ).to.be.above( 21 );
						expect( url.indexOf( 'data:image/png;base64' ) ).to.be.equal( 0 );
						done();
					}, done );
			} );
		} );

	// toImageData
		
		it ( 'should have a toImageDataSync method', function () {
			expect( triangulate().fromImageSync().toImageDataSync ).to.be.a( 'function' );
		} );

		describe( '#toImageDataSync()', function () {
			it ( 'should return an imageData object', function ( done ) {
				// loadImage( done, function ( img ) {
				loadImage()
					.then( img => {
						var imageData = triangulate().fromImageSync( img ).toImageDataSync();

						expect( typeof imageData ).to.be.equal( 'object' );
						expect( typeof imageData.width ).to.be.equal( 'number' );
						expect( typeof imageData.height ).to.be.equal( 'number' );
						expect( imageData.data ).not.to.be.equal( undefined );
						expect( imageData.data.length ).to.be.above( 0 );
						
						done();
					}, done );
			} );
		} );

	// toSVG
		
		it ( 'should have a toSVGSync method', function () {
			expect( triangulate().fromImageSync().toSVGSync ).to.be.a( 'function' );
		} );

		describe( '#toSVGSync()', function () {
			it ( 'should return valid SVG markup', function ( done ) {
				loadImage()
					.then( img => {
						var markup = triangulate().fromImageSync( img ).toSVGSync();
						
						expect( markup ).to.be.a( 'string' );
						expect( markup.indexOf( '<?xml' ) ).to.be.equal( 0 );
						expect( markup.indexOf( '<svg ' ) ).not.to.be.equal( -1 );

						var domEl = document.createElement( 'div' );
						document.body.appendChild( domEl );
						domEl.innerHTML = markup;
						
						expect( domEl.querySelectorAll( 'polygon' ).length ).to.be.above( 0 );
						
						done();
					}, done );
			} );
		} );
	} );
} );

function loadImage () {
	return new Promise( ( done, fail ) => {
		var img = new Image();

		img.onload = function () {
			done( img );
		};

		img.onerror = err => {
			fail( err );
		};

		img.src = imagePath;
	} );
}

function imageToImageData ( img ) {
	var canvas = document.createElement( 'canvas' );
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
			
	var ctx = canvas.getContext( '2d' );
	ctx.drawImage( img, 0, 0 );

	return ctx.getImageData( 0, 0, img.naturalWidth, img.naturalHeight );
}
