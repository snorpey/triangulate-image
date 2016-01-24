var clamp = require('./util/clamp.js');
var defaultParams = require('./defaultParams.js');

var fromImageToImageData = require('./input/fromImageToImageData.js');
var fromBufferToImageData = require('./input/fromBufferToImageData.js');

var polygonsToImageData = require('./output/polygonsToImageData.js');
var polygonsToDataURL = require('./output/polygonsToDataURL.js');
var polygonsToSVG = require('./output/polygonsToSVG.js');

var polygonsToBuffer;
var polygonsToPNGStream;
var polygonsToJPGStream;
var polygonsToSVGStream;

if ( process.env.NODE_ENV !== 'browser' ) {
	polygonsToSVGStream = require('./output/polygonsToSVGStream.js');
	polygonsToBuffer = require('./output/polygonsToBuffer.js');
	polygonsToPNGStream = require('./output/polygonsToPNGStream.js');
	polygonsToJPGStream = require('./output/polygonsToJPGStream.js');
}

var allowedLineJoins = [ 'miter', 'round', 'bevel' ];

function checkParams ( params ) {
	if ( typeof params !== 'object' ) {
		params = { };
	}

	if ( typeof params.accuracy !== 'number' || isNaN( params.accuracy ) ) {
		params.accuracy = defaultParams.accuracy;
	} else {
		params.accuracy = clamp( params.accuracy, 0, 1 );
	}

	if ( typeof params.blur !== 'number' || isNaN( params.blur ) ) {
		params.blur = defaultParams.blur;
	}

	if ( typeof params.fill !== 'string' && typeof params.fill !== 'boolean' ) {
		params.fill = defaultParams.fill;
	}

	if ( typeof params.stroke !== 'string' && typeof params.stroke !== 'boolean' ) {
		params.stroke = defaultParams.stroke;
	}

	if ( typeof params.strokeWidth !== 'number' || isNaN( params.strokeWidth ) ) {
		params.strokeWidth = defaultParams.strokeWidth;
	}

	if ( typeof params.lineJoin !== 'string' || allowedLineJoins.indexOf( params.lineJoin ) === -1 ) {
		params.lineJoin = defaultParams.lineJoin;
	}

	if ( typeof params.vertexCount !== 'number' || isNaN( params.vertexCount ) ) {
		params.vertexCount = defaultParams.vertexCount;
	}

	return params;
}

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromImage( img )
//     .toImageData()
// 
// etc...

module.exports = function ( params, callback ) {
	params = checkParams( params );

	var input = { getParams };
	var output = { getParams };

	var inputFn;
	var outputFn;

	input.fromImageData = function ( imageData ) {
		inputFn = function () { return imageData; };
		return go( getOutput );
	};
	
	output.toDataURL = function ( dataUrlParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToDataURL( polygons, size, dataUrlParams );
		};

		return go( getInput );
	};

	output.toImageData = function ( imageDataParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToImageData( polygons, size, imageDataParams );
		};

		return go( getInput );
	}
	
	output.toSVG  = function () {
		outputFn = polygonsToSVG;
		return go( getInput );
	}
	
	output.toData = function () {
		outputFn = function ( polygons ) {
			return polygons;
		};

		return go( getInput );
	}

	if ( process.env.NODE_ENV !== 'browser' ) {
		input.fromBuffer = function ( buffer ) {
			inputFn = function () {
				return fromBufferToImageData( buffer );
			};

			return go( getOutput );
		}

		output.toBuffer = function ( format ) {
			outputFn = function ( polygons, size ) {
				return polygonsToBuffer( polygons, size, format );
			};
			
			return go( getInput );
		}
		
		output.toSVGStream = function () {
			outputFn = polygonsToSVGStream;
			return go( getInput );
		}

		output.toPNGStream = function ( pngParams ) {
			outputFn = function ( polygons, size ) {
				return polygonsToPNGStream( polygons, size, pngParams );
			};

			return go( getInput );
		}

		output.toJPGStream = function ( jpgParams ) {
			outputFn = function ( polygons, size ) {
				return polygonsToJPGStream( polygons, size, jpgParams );
			};

			return go( getInput );
		}

		output.toJPEGStream = function ( jpgParams ) {
			outputFn = function ( polygons, size ) {
				return polygonsToJPGStream( polygons, size, jpgParams );
			};

			return go( getInput );
		}
	} else {		
		input.fromImage = function ( imageEl ) {
			inputFn = function () { return fromImageToImageData( imageEl ); };
			return go( getOutput );
		};
	}
	
	function getInput () { return input; }
	
	function getOutput () { return output; }

	function canStart () {
		return inputFn && outputFn && params;
	}

	function getParams () {
		return params;
	}

	function go ( fn ) {
		if ( canStart() ) {
			return start();
		} else {
			return fn();
		}
	}

	function start () {		
		var imageData = inputFn();
		var polygons = callback( imageData, params );


		return outputFn( polygons, imageData );
	}

	return getInput();
}